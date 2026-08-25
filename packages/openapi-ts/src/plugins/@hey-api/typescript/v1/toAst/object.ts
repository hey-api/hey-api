import { ref } from '@hey-api/codegen-core';
import type { IR } from '@hey-api/shared';
import { deduplicateSchema } from '@hey-api/shared';

import { $ } from '../../../../../ts-dsl';
import { createSchemaComment } from '../../../../shared/utils/schema';
import type { ObjectResolverContext } from '../../resolvers';
import type { Type } from '../../shared/types';

function shapeNode(ctx: ObjectResolverContext): ReturnType<typeof $.type.object> {
  const { plugin, schema, walk } = ctx;
  const shape = $.type.object();
  const required = schema.required ?? [];

  for (const name in schema.properties) {
    const property = schema.properties[name]!;
    const propertyResult = walk(property, { path: ref([]), plugin });
    const isRequired = required.includes(name);
    shape.prop(name, (p) =>
      p
        .$if(plugin.config.comments && createSchemaComment(property), (p, v) =>
          p.styledDoc(v, plugin.config.commentsStyle),
        )
        .readonly(property.accessScope === 'read')
        .required(isRequired)
        .type(propertyResult.type),
    );
  }

  return shape;
}

function baseNode(ctx: ObjectResolverContext): Type {
  const { plugin, schema, walk } = ctx;
  const shape = shapeNode(ctx);
  const required = schema.required ?? [];
  let indexSchemas: Array<IR.SchemaObject> = [];
  let hasOptionalProperties = false;

  for (const name in schema.properties) {
    const property = schema.properties[name]!;
    const isRequired = required.includes(name);
    indexSchemas.push(property);

    if (!isRequired) {
      hasOptionalProperties = true;
    }
  }

  if (schema.patternProperties) {
    for (const pattern in schema.patternProperties) {
      const ir = schema.patternProperties[pattern]!;
      indexSchemas.unshift(ir);
    }
  }

  const hasPatterns = schema.patternProperties && Object.keys(schema.patternProperties).length;

  const addPropsRaw = schema.additionalProperties;
  const addPropsObj =
    addPropsRaw !== false && addPropsRaw ? (addPropsRaw as IR.SchemaObject) : undefined;
  const shouldCreateIndex =
    hasPatterns || (addPropsObj && (addPropsObj.type !== 'never' || !indexSchemas.length));

  if (shouldCreateIndex) {
    const addProps = addPropsObj;
    if (addProps && addProps.type !== 'never') {
      if (addProps.type === 'unknown') {
        const patternSchemas: Array<IR.SchemaObject> = schema.patternProperties
          ? Object.values(schema.patternProperties)
          : [];
        indexSchemas = [addProps, ...patternSchemas];
      } else {
        indexSchemas.unshift(addProps);
      }
    } else if (!hasPatterns && !indexSchemas.length && addProps && addProps.type === 'never') {
      indexSchemas = [addProps];
    }

    if (hasOptionalProperties && addProps?.type !== 'unknown') {
      indexSchemas.push({ type: 'undefined' });
    }

    if (indexSchemas.length) {
      const unionSchema: IR.SchemaObject =
        indexSchemas.length === 1
          ? indexSchemas[0]!
          : deduplicateSchema({ schema: { items: indexSchemas, logicalOperator: 'or' } });

      const indexType = walk(unionSchema, { path: ref([]), plugin }).type;

      if (schema.propertyNames?.$ref) {
        const propertyNamesResult = walk(
          { $ref: schema.propertyNames.$ref },
          { path: ref([]), plugin },
        );
        return $.type.mapped('key').key(propertyNamesResult.type).optional().type(indexType);
      }

      shape.idxSig('key', (i) => i.key('string').type(indexType));
    }
  }

  return shape;
}

function objectResolver(ctx: ObjectResolverContext): Type {
  return ctx.nodes.base(ctx);
}

export function objectToAst({
  path,
  plugin,
  schema,
  walk,
}: Pick<ObjectResolverContext, 'path' | 'plugin' | 'schema' | 'walk'>): Type {
  const ctx: ObjectResolverContext = {
    $,
    nodes: {
      base: baseNode,
      shape: shapeNode,
    },
    path,
    plugin,
    schema,
    walk,
  };

  const resolver = plugin.config.$resolvers?.object ?? plugin.config['~resolvers']?.object;
  return resolver?.(ctx) ?? objectResolver(ctx);
}
