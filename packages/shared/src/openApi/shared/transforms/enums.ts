import type { Parser } from '../../../config/parser/types';
import { applyNaming } from '../../../utils/naming/naming';
import { jsonPointerToPath } from '../../../utils/ref';
import { deepClone } from '../utils/schema';
import { childSchemaRelationships } from '../utils/schemaChildRelationships';
import { getSchemasObject } from '../utils/transforms';
import { getUniqueComponentName, isPathRootSchema, specToSchemasPointerNamespace } from './utils';

type EnumsConfig = Parser['transforms']['enums'];

/**
 * Generate a unique, structural signature for an enum schema for deduplication.
 * Only considers 'type' and sorted 'enum' values, ignoring other fields.
 *
 * @param schema - The schema object to analyze
 * @returns A string signature if the schema is an enum, otherwise undefined
 */
const getEnumSignature = (schema: unknown): string | undefined => {
  if (
    !schema ||
    typeof schema !== 'object' ||
    !('enum' in schema) ||
    !(schema.enum instanceof Array)
  ) {
    return;
  }
  // Use type + sorted enum values for signature
  const type = ('type' in schema ? schema.type : undefined) || '';
  const values = [...schema.enum].sort();
  return JSON.stringify({ type, values });
};

type NodeInfo = {
  key: string | number | null;
  node: unknown;
  parent: unknown;
  path: ReadonlyArray<string | number>;
};

/**
 * Recursively walk all schemas in the OpenAPI spec, visiting every object/array
 * that could contain an enum. Calls the visitor with node info for each.
 *
 * @param key - The key of the current node
 * @param node - The current node
 * @param parent - The parent node
 * @param path - The path to the current node
 * @param visitor - Function to call for each visited node
 */
const walkSchemas = ({
  key,
  node,
  parent,
  path,
  visitor,
}: NodeInfo & {
  visitor: (nodeInfo: NodeInfo) => void;
}) => {
  if (!node || typeof node !== 'object' || node instanceof Array) return;

  const value = node as Record<string, unknown>;

  if (
    'type' in value ||
    'enum' in value ||
    childSchemaRelationships.some(([keyword]) => keyword in value)
  ) {
    visitor({ key, node, parent, path });
  }

  for (const [k, v] of Object.entries(value)) {
    if (typeof v === 'object' && v !== null) {
      if (v instanceof Array) {
        v.forEach((item, index) =>
          walkSchemas({
            key: index,
            node: item,
            parent: v,
            path: [...path, k, index],
            visitor,
          }),
        );
      } else {
        walkSchemas({
          key: k,
          node: v,
          parent: node,
          path: [...path, k],
          visitor,
        });
      }
    }
  }
};

/**
 * Inlines all root/top-level enums by replacing $refs to them with the actual enum schema,
 * and then removes the now-unreferenced root enums from the schemas object.
 *
 * @param spec - The OpenAPI spec object to transform
 */
const inlineMode = ({ spec }: { spec: unknown }) => {
  const schemasObj = getSchemasObject(spec);
  if (!schemasObj) {
    return;
  }

  const schemasPointerNamespace = specToSchemasPointerNamespace(spec);

  // Collect all root enums
  const rootEnums: Record<string, unknown> = {};
  for (const [name, schema] of Object.entries(schemasObj)) {
    const signature = getEnumSignature(schema);
    if (signature) {
      rootEnums[`${schemasPointerNamespace}${name}`] = schema;
    }
  }

  // Walk the spec and replace $refs to root enums with inline enum schemas
  const replaceEnumRefs = (node: unknown) => {
    if (node instanceof Array) {
      node.forEach(replaceEnumRefs);
    } else if (node && typeof node === 'object') {
      for (const [k, v] of Object.entries(node)) {
        if (k === '$ref' && typeof v === 'string' && v in rootEnums) {
          // Replace $ref with a deep clone of the enum schema
          Object.assign(node, deepClone(rootEnums[v]));
          delete (node as Record<string, unknown>)['$ref'];
        } else {
          replaceEnumRefs(v);
        }
      }
    }
  };
  replaceEnumRefs(spec);

  // Remove unreferenced root enums
  for (const pointer of Object.keys(rootEnums)) {
    const path = jsonPointerToPath(pointer);
    const name = path[path.length - 1]!;
    if (name) {
      delete schemasObj[name];
    }
  }
};

/**
 * Promotes all inline enums to reusable root components (if mode is 'root'),
 * deduplicates by signature, and replaces inline enums with $refs.
 *
 * Naming, casing, and deduplication are controlled by the enums transform config.
 * Existing root enums are reused if structurally identical.
 *
 * @param spec - The OpenAPI spec object to transform
 * @param config - The enums transform config
 */
const rootMode = ({ config, spec }: { config: EnumsConfig; spec: unknown }) => {
  const schemasObj = getSchemasObject(spec);
  if (!schemasObj) {
    return;
  }

  // Build a map of existing root enum signatures to their names for deduplication
  const rootEnumSignatures: Record<string, string> = {};
  for (const [name, schema] of Object.entries(schemasObj)) {
    const signature = getEnumSignature(schema);
    if (signature) {
      rootEnumSignatures[signature] = name;
    }
  }

  // Collect all inline enums (not at root schemas)
  const inlineEnums: Array<{
    key: string | number | null;
    node: unknown;
    parent: unknown;
    path: ReadonlyArray<string | number>;
    signature: string;
  }> = [];

  walkSchemas({
    key: null,
    node: spec,
    parent: null,
    path: [],
    visitor: (nodeInfo) => {
      if (!isPathRootSchema(nodeInfo.path)) {
        const signature = getEnumSignature(nodeInfo.node);
        if (signature) {
          inlineEnums.push({ ...nodeInfo, signature });
        }
      }
    },
  });

  // Deduplicate and assign unique names for promoted enums
  const signatureToName: Record<string, string | undefined> = {};
  const signatureToSchema: Record<string, unknown> = {};

  for (const { key, node, signature } of inlineEnums) {
    if (signature in signatureToName) {
      // Already handled
      continue;
    }

    // Use existing root enum if available
    if (signature in rootEnumSignatures) {
      signatureToName[signature] = rootEnumSignatures[signature];
      continue;
    }

    // Generate a unique name for the new root enum using config
    const base = applyNaming(
      typeof node === 'object' && node && 'title' in node && typeof node.title === 'string'
        ? node.title
        : String(key),
      config,
    );
    const name = getUniqueComponentName({
      base,
      components: schemasObj,
      extraComponents: Object.values(signatureToName),
    });
    signatureToName[signature] = name;
    signatureToSchema[signature] = node;
  }

  // Add new root enums to the schemas object
  for (const [signature, name] of Object.entries(signatureToName)) {
    // Only add if not already present
    const schema = signatureToSchema[signature];
    if (name && !(name in schemasObj) && schema && typeof schema === 'object') {
      schemasObj[name] = schema;
    }
  }

  // Replace inline enums with $ref to the new root enum
  const schemasPointerNamespace = specToSchemasPointerNamespace(spec);
  for (const { key, parent, signature } of inlineEnums) {
    const name = signatureToName[signature];
    if (name && key !== null && parent && typeof parent === 'object') {
      (parent as Record<string, unknown>)[key] = {
        $ref: `${schemasPointerNamespace}${name}`,
      };
    }
  }
};

/**
 * Applies the enums transform according to the configured mode ('inline' or 'root').
 *
 * - In 'inline' mode, all root enums are inlined and removed.
 * - In 'root' mode, all inline enums are promoted to root components and deduplicated.
 *
 * @param config - The enums transform config
 * @param spec - The OpenAPI spec object to transform
 */
export function enumsTransform({ config, spec }: { config: EnumsConfig; spec: unknown }) {
  if (config.mode === 'inline') {
    inlineMode({ spec });
    return;
  }

  if (config.mode === 'root') {
    rootMode({ config, spec });
    return;
  }
}
