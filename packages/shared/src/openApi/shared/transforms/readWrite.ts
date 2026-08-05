import type { Logger } from '@hey-api/codegen-core';

import type { Parser } from '../../../config/parser/types';
import type { Graph } from '../../../graph';
import { applyNaming } from '../../../utils/naming/naming';
import { jsonPointerToPath } from '../../../utils/ref';
import deepEqual from '../utils/deepEqual';
import { buildGraph, type Scope } from '../utils/graph';
import { deepClone } from '../utils/schema';
import { childSchemaRelationships } from '../utils/schemaChildRelationships';
import {
  getSchemasObject,
  hasComponentsSchemasObject,
  hasDefinitionsObject,
} from '../utils/transforms';
import { getUniqueComponentName, isPathRootSchema, specToSchemasPointerNamespace } from './utils';

type OriginalSchemas = Record<string, unknown>;

type SplitMapping = Record<
  string,
  {
    read?: string;
    write?: string;
  }
>;

type SplitSchemas = {
  /** Key is the original schema pointer. */
  mapping: SplitMapping;
  /** splitPointer -> originalPointer */
  reverseMapping: Record<string, string>;
  /** name -> schema object */
  schemas: Record<string, unknown>;
};

type ReadWriteConfig = Parser['transforms']['readWrite'];

const schemaKeys = new Set([
  'additionalProperties',
  'allOf',
  'anyOf',
  'items',
  'not',
  'oneOf',
  'patternProperties',
  'properties',
  'schema',
  'unevaluatedProperties',
]);

function getComponentContext(path: ReadonlyArray<string | number>): Scope | undefined {
  // OpenAPI 3.x: #/components/{type}/{name}
  if (path.length === 3 && path[0] === 'components') {
    const type = path[1];
    if (type === 'parameters') return 'write';
    if (type === 'requestBodies') return 'write';
    if (type === 'responses') return 'read';
    if (type === 'headers') return 'read';
  }
  // OpenAPI 2.x: #/parameters/{name}, #/responses/{name}
  if (path.length === 2) {
    const type = path[0];
    if (type === 'parameters') return 'write';
    if (type === 'responses') return 'read';
  }
  return;
}

/**
 * Capture the original schema objects by pointer before splitting.
 * This is used to safely remove only the true originals after splitting,
 * even if names are swapped or overwritten by split variants.
 */
function captureOriginalSchemas(spec: unknown, logger: Logger): OriginalSchemas {
  const event = logger.timeEvent('capture-original-schemas');
  const originals: OriginalSchemas = {};
  if (hasComponentsSchemasObject(spec)) {
    for (const [name, obj] of Object.entries((spec as any).components.schemas)) {
      originals[`#/components/schemas/${name}`] = obj;
    }
  } else if (hasDefinitionsObject(spec)) {
    for (const [name, obj] of Object.entries((spec as any).definitions)) {
      originals[`#/definitions/${name}`] = obj;
    }
  }
  event.timeEnd();
  return originals;
}

/**
 * Inserts split schemas into the spec at the correct location (OpenAPI 3.x or 2.0).
 * This function is robust to spec version and will assign all split schemas
 * to either components.schemas (OAS3) or definitions (OAS2).
 *
 * @param spec - The OpenAPI spec object
 * @param split - The split schemas (from splitSchemas)
 */
function insertSplitSchemasIntoSpec({
  logger,
  spec,
  split,
}: {
  logger: Logger;
  spec: unknown;
  split: Pick<SplitSchemas, 'schemas'>;
}) {
  const event = logger.timeEvent('insert-split-schemas-into-spec');
  if (hasComponentsSchemasObject(spec)) {
    Object.assign((spec as any).components.schemas, split.schemas);
  } else if (hasDefinitionsObject(spec)) {
    Object.assign((spec as any).definitions, split.schemas);
  }
  event.timeEnd();
}

/**
 * Prunes a schema by removing all child schemas (in any structural keyword)
 * that are marked with the given scope (readOnly/writeOnly), or that are $ref to a schema
 * that is exclusively the excluded scope (according to the graph).
 *
 * Uses childSchemaRelationships for parity with graph traversal.
 * Returns true if the schema itself should be removed from its parent.
 *
 * @param graph - The Graph containing all nodes and their scopes
 * @param schema - The schema object to prune
 * @param scope - The scope to exclude ('readOnly' or 'writeOnly')
 * @returns boolean - Whether the schema should be removed from its parent
 */
function pruneSchemaByScope(
  graph: Graph,
  schema: unknown,
  scope: 'readOnly' | 'writeOnly',
): boolean {
  if (schema && typeof schema === 'object') {
    // Handle $ref schemas
    if ('$ref' in schema && typeof schema.$ref === 'string') {
      const nodeInfo = graph.nodes.get(schema.$ref);
      if (nodeInfo?.scopes) {
        // Only remove $ref if the referenced schema is *exclusively* the excluded scope.
        // This ensures 'normal' or multi-scope schemas are always kept.
        if (
          (scope === 'writeOnly' && nodeInfo.scopes.size === 1 && nodeInfo.scopes.has('write')) ||
          (scope === 'readOnly' && nodeInfo.scopes.size === 1 && nodeInfo.scopes.has('read'))
        ) {
          delete (schema as Record<string, unknown>)['$ref'];
          // If the schema is now empty, remove it
          if (!childSchemaRelationships.some(([keyword]) => keyword in schema)) {
            return true;
          }
        }
      }
    }
    // Recursively prune all child schemas according to childSchemaRelationships
    for (const [keyword, type] of childSchemaRelationships) {
      if (!(keyword in schema)) {
        continue;
      }
      const value = (schema as Record<string, unknown>)[keyword];
      if (type === 'array' && value instanceof Array) {
        for (let index = value.length - 1; index >= 0; index--) {
          const item = value[index];
          if (
            item &&
            typeof item === 'object' &&
            (item as Record<string, unknown>)[scope] === true
          ) {
            value.splice(index, 1);
          } else {
            const shouldRemove = pruneSchemaByScope(graph, item, scope);
            if (shouldRemove) value.splice(index, 1);
          }
        }
        if (!value.length) {
          delete (schema as Record<string, unknown>)[keyword];
        }
      } else if (
        type === 'objectMap' &&
        typeof value === 'object' &&
        value !== null &&
        !(value instanceof Array)
      ) {
        const objMap = value as Record<string, unknown>;
        // Track removed properties for object schemas to update required array
        const removedProperties = new Set<string>();

        for (const key of Object.keys(objMap)) {
          const prop = objMap[key];
          if (
            prop &&
            typeof prop === 'object' &&
            (prop as Record<string, unknown>)[scope] === true
          ) {
            delete objMap[key];
            // Track removed properties for object schemas
            if (keyword === 'properties') {
              removedProperties.add(key);
            }
          } else {
            const shouldRemove = pruneSchemaByScope(graph, prop, scope);
            if (shouldRemove) {
              delete objMap[key];
              // Track removed properties for object schemas
              if (keyword === 'properties') {
                removedProperties.add(key);
              }
            }
          }
        }

        // Update required array if properties were removed
        if (
          removedProperties.size > 0 &&
          keyword === 'properties' &&
          'required' in schema &&
          Array.isArray((schema as Record<string, unknown>).required)
        ) {
          const required = (schema as Record<string, unknown>).required as string[];
          const filteredRequired = required.filter((prop) => !removedProperties.has(prop));

          if (!filteredRequired.length) {
            delete (schema as Record<string, unknown>).required;
          } else {
            (schema as Record<string, unknown>).required = filteredRequired;
          }
        }

        if (!Object.keys(objMap).length) {
          delete (schema as Record<string, unknown>)[keyword];
        }
      } else if (type === 'single' && typeof value === 'object' && value !== null) {
        if ((value as Record<string, unknown>)[scope] === true) {
          delete (schema as Record<string, unknown>)[keyword];
        } else {
          const shouldRemove = pruneSchemaByScope(graph, value, scope);
          if (shouldRemove) {
            delete (schema as Record<string, unknown>)[keyword];
          }
        }
      } else if (type === 'singleOrArray') {
        if (value instanceof Array) {
          for (let index = value.length - 1; index >= 0; index--) {
            const item = value[index];
            if (
              item &&
              typeof item === 'object' &&
              (item as Record<string, unknown>)[scope] === true
            ) {
              value.splice(index, 1);
            } else {
              const shouldRemove = pruneSchemaByScope(graph, item, scope);
              if (shouldRemove) value.splice(index, 1);
            }
          }
          if (!value.length) {
            delete (schema as Record<string, unknown>)[keyword];
          }
        } else if (typeof value === 'object' && value !== null) {
          if ((value as Record<string, unknown>)[scope] === true) {
            delete (schema as Record<string, unknown>)[keyword];
          } else {
            const shouldRemove = pruneSchemaByScope(graph, value, scope);
            if (shouldRemove) {
              delete (schema as Record<string, unknown>)[keyword];
            }
          }
        }
      }
    }
    // After all removals, if this is type: object and has no structural fields, remove it
    if (
      (schema as Record<string, unknown>).type === 'object' &&
      !childSchemaRelationships.some(([keyword]) => keyword in schema)
    ) {
      return true;
    }
  }
  return false;
}

/**
 * Remove only the true original schemas that were split, by object identity.
 * This is robust to swaps, overwrites, and name collisions.
 *
 * @param originalSchemas - Map of original pointers to their schema objects (captured before splitting)
 * @param spec - The OpenAPI spec object
 * @param split - The split mapping (from splitSchemas)
 */
function removeOriginalSplitSchemas({
  logger,
  originalSchemas,
  spec,
  split,
}: {
  logger: Logger;
  originalSchemas: OriginalSchemas;
  spec: unknown;
  split: Pick<SplitSchemas, 'mapping'>;
}) {
  const event = logger.timeEvent('remove-original-split-schemas');
  const schemasObj = getSchemasObject(spec);

  for (const originalPointer of Object.keys(split.mapping)) {
    const path = jsonPointerToPath(originalPointer);
    const name = path[path.length - 1]!;
    if (
      typeof name === 'string' &&
      schemasObj &&
      Object.prototype.hasOwnProperty.call(schemasObj, name) &&
      schemasObj[name] === originalSchemas[originalPointer]
    ) {
      delete schemasObj[name];
    }
  }
  event.timeEnd();
}

/**
 * Create writable variants of parent schemas that have discriminators
 * and are referenced by split schemas.
 */
function splitDiscriminatorSchemas({
  config,
  existingNames,
  schemasPointerNamespace,
  spec,
  split,
}: {
  config: ReadWriteConfig;
  existingNames: Set<string>;
  schemasPointerNamespace: string;
  spec: unknown;
  split: SplitSchemas;
}) {
  const schemasObj = getSchemasObject(spec);
  if (!schemasObj) return;

  const parentSchemasToSplit = new Map<string, Set<Scope>>();

  // First pass: identify parent schemas that need writable variants
  for (const [name, schema] of Object.entries(split.schemas)) {
    const pointer = `${schemasPointerNamespace}${name}`;
    const originalPointer = split.reverseMapping[pointer];

    if (originalPointer) {
      const mapping = split.mapping[originalPointer];
      if (mapping) {
        const contextVariant: Scope | null =
          mapping.read === pointer ? 'read' : mapping.write === pointer ? 'write' : null;

        // Check allOf for $refs to schemas with discriminators
        if (
          contextVariant &&
          schema &&
          typeof schema === 'object' &&
          'allOf' in schema &&
          schema.allOf instanceof Array
        ) {
          for (const comp of schema.allOf) {
            if (
              comp &&
              typeof comp === 'object' &&
              '$ref' in comp &&
              typeof comp.$ref === 'string'
            ) {
              const refPath = jsonPointerToPath(comp.$ref);
              const schemaName = refPath[refPath.length - 1];

              if (typeof schemaName === 'string' && schemaName in schemasObj) {
                const resolvedSchema = schemasObj[schemaName];

                // Check if this schema has a discriminator with mapping
                if (
                  resolvedSchema &&
                  typeof resolvedSchema === 'object' &&
                  'discriminator' in resolvedSchema &&
                  resolvedSchema.discriminator &&
                  typeof resolvedSchema.discriminator === 'object' &&
                  'mapping' in resolvedSchema.discriminator &&
                  resolvedSchema.discriminator.mapping &&
                  typeof resolvedSchema.discriminator.mapping === 'object'
                ) {
                  // This parent schema needs a variant for this context
                  if (!parentSchemasToSplit.has(comp.$ref)) {
                    parentSchemasToSplit.set(comp.$ref, new Set());
                  }
                  parentSchemasToSplit.get(comp.$ref)!.add(contextVariant);
                }
              }
            }
          }
        }
      }
    }
  }

  // Second pass: create writable variants of parent schemas and update their discriminator mappings
  const parentSchemaVariants = new Map<string, SplitMapping[keyof SplitMapping]>();

  for (const [parentRef, contexts] of parentSchemasToSplit) {
    const refPath = jsonPointerToPath(parentRef);
    const parentName = refPath[refPath.length - 1];

    if (typeof parentName !== 'string' || !(parentName in schemasObj)) continue;

    const parentSchema = schemasObj[parentName];
    if (!parentSchema || typeof parentSchema !== 'object') continue;

    const variants: SplitMapping[keyof SplitMapping] = {};

    // Create variants for each context
    for (const context of contexts) {
      const variantSchema = deepClone(parentSchema);

      // Update discriminator mapping in the variant
      if (
        'discriminator' in variantSchema &&
        variantSchema.discriminator &&
        typeof variantSchema.discriminator === 'object' &&
        'mapping' in variantSchema.discriminator &&
        variantSchema.discriminator.mapping &&
        typeof variantSchema.discriminator.mapping === 'object'
      ) {
        const mapping = variantSchema.discriminator.mapping;
        const updatedMapping: Record<string, string> = {};

        for (const [discriminatorValue, originalRef] of Object.entries(mapping)) {
          const map = split.mapping[originalRef];
          if (map) {
            if (context === 'read' && map.read) {
              updatedMapping[discriminatorValue] = map.read;
            } else if (context === 'write' && map.write) {
              updatedMapping[discriminatorValue] = map.write;
            } else {
              updatedMapping[discriminatorValue] = originalRef;
            }
          } else {
            updatedMapping[discriminatorValue] = originalRef;
          }
        }

        variantSchema.discriminator.mapping = updatedMapping;
      }

      // Add the variant to split.schemas with an appropriate name
      if (context === 'write') {
        const writeBase = applyNaming(parentName, config.requests);
        const writeName = getUniqueComponentName({
          base: writeBase,
          components: existingNames,
        });
        existingNames.add(writeName);
        split.schemas[writeName] = variantSchema;
        variants.write = `${schemasPointerNamespace}${writeName}`;
      }
      // We could create read variants too, but typically they're not needed
      // since the original schema serves as the read variant
    }

    parentSchemaVariants.set(parentRef, variants);
  }

  // Third pass: update $refs in split schemas to point to the parent variants
  for (const [name, schema] of Object.entries(split.schemas)) {
    const pointer = `${schemasPointerNamespace}${name}`;
    const originalPointer = split.reverseMapping[pointer];
    if (!originalPointer) continue;

    const mapping = split.mapping[originalPointer];
    if (!mapping) continue;

    const contextVariant: Scope | null =
      mapping.read === pointer ? 'read' : mapping.write === pointer ? 'write' : null;

    if (contextVariant && schema && typeof schema === 'object') {
      // Update $refs in allOf
      if ('allOf' in schema && schema.allOf instanceof Array) {
        for (let i = 0; i < schema.allOf.length; i++) {
          const comp = schema.allOf[i];

          if (comp && typeof comp === 'object' && '$ref' in comp && typeof comp.$ref === 'string') {
            const variants = parentSchemaVariants.get(comp.$ref);

            if (variants) {
              if (contextVariant === 'write' && variants.write) {
                comp.$ref = variants.write;
              } else if (contextVariant === 'read' && variants.read) {
                comp.$ref = variants.read;
              }
            }
          }
        }
      }
    }
  }
}

/**
 * Splits schemas with both 'read' and 'write' scopes into read/write variants.
 * Returns the new schemas and a mapping from original pointer to new variant pointers.
 *
 * @param config - The readWrite transform config
 * @param graph - The Graph containing all nodes and their scopes
 * @param spec - The OpenAPI spec object
 * @returns SplitSchemas - The split schemas and pointer mappings
 */
export function splitSchemas({
  config,
  graph,
  logger,
  spec,
}: {
  config: ReadWriteConfig;
  graph: Graph;
  logger: Logger;
  spec: unknown;
}): SplitSchemas {
  const event = logger.timeEvent('split-schemas');
  const existingNames = new Set<string>();
  const split: SplitSchemas = {
    mapping: {},
    reverseMapping: {},
    schemas: {},
  };

  const schemasPointerNamespace = specToSchemasPointerNamespace(spec);
  const schemasNamespaceSegments = schemasPointerNamespace.split('/').length - 1;

  /**
   * Extracts the schema name from pointer, but only if it's a top-level schema
   * pointer. Returns an empty string if it's a nested pointer.
   * @param pointer
   * @returns Schema's base name.
   */
  const pointerToSchema = (pointer: string): string => {
    if (pointer.startsWith(schemasPointerNamespace)) {
      const path = jsonPointerToPath(pointer);
      if (path.length === schemasNamespaceSegments) {
        return path[schemasNamespaceSegments - 1] || '';
      }
    }
    return '';
  };

  // Collect all existing schema names
  for (const pointer of graph.nodes.keys()) {
    const name = pointerToSchema(pointer);
    if (name) existingNames.add(name);
  }

  for (const [pointer, nodeInfo] of graph.nodes) {
    const name = pointerToSchema(pointer);
    // Only split top-level schemas, with either read-only or write-only scopes (or both).
    if (
      !name ||
      !(nodeInfo.scopes?.has('read') || nodeInfo.scopes?.has('write')) ||
      !nodeInfo.scopes?.has('normal')
    ) {
      continue;
    }

    // read variant
    const readSchema = deepClone<unknown>(nodeInfo.node);
    pruneSchemaByScope(graph, readSchema, 'writeOnly');
    const readBase = applyNaming(name, config.responses);
    const readName =
      readBase === name
        ? readBase
        : getUniqueComponentName({
            base: readBase,
            components: existingNames,
          });
    existingNames.add(readName);
    split.schemas[readName] = readSchema;
    const readPointer = `${schemasPointerNamespace}${readName}`;

    // write variant
    const writeSchema = deepClone<unknown>(nodeInfo.node);
    pruneSchemaByScope(graph, writeSchema, 'readOnly');

    // Check if this schema (or any of its descendants) references any schema that
    // will need read/write variants. This is determined by checking transitive
    // dependencies for schemas with both 'normal' and ('read' or 'write') scopes.
    const transitiveDeps = graph.transitiveDependencies.get(pointer) || new Set();
    const referencesReadWriteSchemas = Array.from(transitiveDeps).some((depPointer) => {
      const depNodeInfo = graph.nodes.get(depPointer);
      return (
        depNodeInfo?.scopes?.has('normal') &&
        (depNodeInfo.scopes.has('read') || depNodeInfo.scopes.has('write'))
      );
    });

    // If pruning did not change anything (both variants equal and equal to original),
    // and the schema doesn't reference any schemas that will have read/write variants,
    // skip splitting and keep the original single schema.
    if (
      !referencesReadWriteSchemas &&
      deepEqual(readSchema, writeSchema) &&
      deepEqual(readSchema, nodeInfo.node)
    ) {
      continue;
    }
    const writeBase = applyNaming(name, config.requests);
    const writeName =
      writeBase === name && writeBase !== readName
        ? writeBase
        : getUniqueComponentName({
            base: writeBase,
            components: existingNames,
          });
    existingNames.add(writeName);
    split.schemas[writeName] = writeSchema;
    const writePointer = `${schemasPointerNamespace}${writeName}`;

    split.mapping[pointer] = {
      read: readPointer,
      write: writePointer,
    };
    split.reverseMapping[readPointer] = pointer;
    split.reverseMapping[writePointer] = pointer;
  }

  splitDiscriminatorSchemas({
    config,
    existingNames,
    schemasPointerNamespace,
    spec,
    split,
  });

  event.timeEnd();
  return split;
}

type WalkArgs = {
  context: Scope | null;
  currentPointer: string | null;
  inSchema: boolean;
  node: unknown;
  path: ReadonlyArray<string | number>;
  visited?: Set<string>;
};

/**
 * Recursively updates $ref fields in the spec to point to the correct read/write variant
 * according to the current context (read/write), using the split mapping.
 *
 * @param spec - The OpenAPI spec object
 * @param split - The split mapping (from splitSchemas)
 */
export function updateRefsInSpec({
  logger,
  spec,
  split,
}: {
  logger: Logger;
  spec: unknown;
  split: Omit<SplitSchemas, 'schemas'>;
}): void {
  const event = logger.timeEvent('update-refs-in-spec');
  const schemasPointerNamespace = specToSchemasPointerNamespace(spec);

  function walk({
    context,
    currentPointer,
    inSchema,
    node,
    path,
    visited = new Set(),
  }: WalkArgs): void {
    if (node instanceof Array) {
      node.forEach((item, index) =>
        walk({
          context,
          currentPointer,
          inSchema,
          node: item,
          path: [...path, index],
          visited,
        }),
      );
    } else if (node && typeof node === 'object') {
      // Detect if we're entering a split schema variant
      let nextPointer = currentPointer;
      let nextContext = context;
      if (isPathRootSchema(path)) {
        // Use the last path segment instead of a fixed index (path[2]) because
        // path depth varies across OAS2/OAS3 and contexts; fixed indexing is brittle.
        const nameSegment = path[path.length - 1] as string;
        nextPointer = `${schemasPointerNamespace}${nameSegment}`;
        const originalPointer = split.reverseMapping[nextPointer];
        if (originalPointer) {
          const mapping = split.mapping[originalPointer];
          if (mapping?.read === nextPointer) {
            nextContext = 'read';
          } else if (mapping?.write === nextPointer) {
            nextContext = 'write';
          }
        }
        // For schemas that are not split variants, keep the inherited context.
        // This ensures that $refs inside these schemas are resolved based on
        // where the schema is actually used (requestBody vs responses), not
        // based on the schema's own scopes which track readOnly/writeOnly fields.
      }

      const compContext = getComponentContext(path);
      if (compContext !== undefined) {
        // For each component, walk with the correct context
        for (const key in node) {
          if (!Object.prototype.hasOwnProperty.call(node, key)) {
            continue;
          }
          walk({
            context: compContext,
            currentPointer: nextPointer,
            inSchema: false,
            node: (node as Record<string, unknown>)[key],
            path: [...path, key],
            visited,
          });
        }
        return;
      }

      for (const key in node) {
        if (!Object.prototype.hasOwnProperty.call(node, key)) {
          continue;
        }
        const value = (node as Record<string, unknown>)[key];

        // Only treat context switches at the OpenAPI structure level (not inside schemas)
        if (!inSchema) {
          if (key === 'requestBody') {
            walk({
              context: 'write',
              currentPointer: nextPointer,
              inSchema: false,
              node: value,
              path: [...path, key],
              visited,
            });
            continue;
          }
          if (key === 'responses') {
            walk({
              context: 'read',
              currentPointer: nextPointer,
              inSchema: false,
              node: value,
              path: [...path, key],
              visited,
            });
            continue;
          }
          if (key === 'parameters' && Array.isArray(value)) {
            value.forEach((param, index) => {
              if (param && typeof param === 'object' && 'schema' in param) {
                walk({
                  context: 'write',
                  currentPointer: nextPointer,
                  inSchema: true,
                  node: param.schema,
                  path: [...path, key, index, 'schema'],
                  visited,
                });
              }
              // Also handle content (OpenAPI 3.x)
              if (param && typeof param === 'object' && 'content' in param) {
                walk({
                  context: 'write',
                  currentPointer: nextPointer,
                  inSchema: false,
                  node: param.content,
                  path: [...path, key, index, 'content'],
                  visited,
                });
              }
            });
            continue;
          }
          // OpenAPI 3.x: headers in responses
          if (key === 'headers' && typeof value === 'object' && value !== null) {
            for (const headerKey in value) {
              if (!Object.prototype.hasOwnProperty.call(value, headerKey)) {
                continue;
              }
              walk({
                context: 'read',
                currentPointer: nextPointer,
                inSchema: false,
                node: (value as Record<string, unknown>)[headerKey],
                path: [...path, key, headerKey],
                visited,
              });
            }
            continue;
          }
        }

        // Entering a schema context
        if (schemaKeys.has(key)) {
          walk({
            context: nextContext,
            currentPointer: nextPointer,
            inSchema: true,
            node: value,
            path: [...path, key],
            visited,
          });
        } else if (key === '$ref' && typeof value === 'string') {
          // Prefer exact match first
          const map = split.mapping[value];
          if (map) {
            if (nextContext === 'read' && map.read) {
              (node as Record<string, unknown>)[key] = map.read;
            } else if (nextContext === 'write' && map.write) {
              (node as Record<string, unknown>)[key] = map.write;
            } else if (!nextContext && map.read) {
              // For schemas with no context (unused in operations), default to read variant
              // This ensures $refs in unused schemas don't point to removed originals
              (node as Record<string, unknown>)[key] = map.read;
            }
          }
        } else if (key === 'discriminator' && typeof value === 'object' && value !== null) {
          // Update discriminator mappings to point to the correct read/write variants
          if ('mapping' in value && value.mapping && typeof value.mapping === 'object') {
            const updatedMapping: Record<string, string> = {};
            for (const [discriminatorValue, originalRef] of Object.entries(value.mapping)) {
              const map = split.mapping[originalRef];
              if (map) {
                if (nextContext === 'read' && map.read) {
                  updatedMapping[discriminatorValue] = map.read;
                } else if (nextContext === 'write' && map.write) {
                  updatedMapping[discriminatorValue] = map.write;
                } else {
                  // For schemas with no context, don't update the mapping.
                  // This preserves the original mapping for base schemas.
                  updatedMapping[discriminatorValue] = originalRef;
                }
              } else {
                updatedMapping[discriminatorValue] = originalRef;
              }
            }
            value.mapping = updatedMapping;
          }
          // Continue walking the discriminator object for other properties
          walk({
            context: nextContext,
            currentPointer: nextPointer,
            inSchema,
            node: value,
            path: [...path, key],
            visited,
          });
        } else {
          walk({
            context: nextContext,
            currentPointer: nextPointer,
            inSchema,
            node: value,
            path: [...path, key],
            visited,
          });
        }
      }
    }
  }
  walk({
    context: null,
    currentPointer: null,
    inSchema: false,
    node: spec,
    path: [],
  });
  event.timeEnd();
}

/**
 * Orchestrates the full read/write transform:
 * - Captures original schemas
 * - Splits schemas into read/write variants
 * - Inserts split schemas into the spec
 * - Updates $refs throughout the spec
 * - Removes original schemas that were split
 *
 * @param config - The readWrite transform config
 * @param spec - The OpenAPI spec object
 */
export function readWriteTransform({
  config,
  logger,
  spec,
}: {
  config: ReadWriteConfig;
  logger: Logger;
  spec: unknown;
}) {
  const { graph } = buildGraph(spec, logger);
  const originalSchemas = captureOriginalSchemas(spec, logger);
  const split = splitSchemas({ config, graph, logger, spec });
  insertSplitSchemasIntoSpec({ logger, spec, split });
  updateRefsInSpec({ logger, spec, split });
  removeOriginalSplitSchemas({ logger, originalSchemas, spec, split });
}
