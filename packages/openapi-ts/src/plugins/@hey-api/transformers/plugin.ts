import type { SymbolMeta } from '@hey-api/codegen-core';
import type { IR } from '@hey-api/shared';
import { applyNaming, createOperationKey, operationResponsesMap, refToName } from '@hey-api/shared';

import { $ } from '../../../ts-dsl';
import type { HeyApiTransformersPlugin } from './types';

const dataVariableName = 'data';

// Track symbols that are currently being built so recursive references
// can emit calls to transformers that will be implemented later.
const buildingSymbols = new Set<number>();

type Expr = ReturnType<typeof $.fromValue | typeof $.for | typeof $.if | typeof $.return>;

function isNodeReturnStatement(node: Expr) {
  return node['~dsl'] === 'ReturnTsDsl';
}

function schemaResponseTransformerNodes({
  plugin,
  schema,
}: {
  plugin: HeyApiTransformersPlugin['Instance'];
  schema: IR.SchemaObject;
}): Array<ReturnType<typeof $.expr | typeof $.stmt> | Expr> {
  const nodes = processSchemaType({
    dataExpression: $(dataVariableName),
    plugin,
    schema,
  });
  // append return statement if one does not already exist
  if (nodes.length) {
    const last = nodes[nodes.length - 1]!;
    if (!isNodeReturnStatement(last)) {
      nodes.push($.return(dataVariableName));
    }
  }
  return nodes;
}

function processSchemaType({
  dataExpression,
  plugin,
  schema,
}: {
  dataExpression?: string | ReturnType<typeof $.attr | typeof $.expr>;
  plugin: HeyApiTransformersPlugin['Instance'];
  schema: IR.SchemaObject;
}): Array<Expr> {
  if (schema.$ref) {
    const query: SymbolMeta = {
      category: 'transform',
      resource: 'definition',
      resourceId: schema.$ref,
    };
    const symbol =
      // TODO: contract (self)
      plugin.querySymbol(query) ??
      plugin.symbol(
        applyNaming(refToName(schema.$ref), {
          case: 'camelCase',
          name: '{{name}}SchemaResponseTransformer',
        }),
        {
          meta: query,
        },
      );

    // Only compute the implementation if the symbol isn't already being built.
    // This prevents infinite recursion on self-referential schemas. We still
    // allow emitting a call when the symbol is currently being built so
    // parent nodes can reference the transformer that will be emitted later.
    if (!symbol.node && !buildingSymbols.has(symbol.id)) {
      buildingSymbols.add(symbol.id);
      try {
        const refSchema = plugin.context.resolveIrRef<IR.SchemaObject>(schema.$ref);
        const nodes = schemaResponseTransformerNodes({
          plugin,
          schema: refSchema,
        });

        if (nodes.length) {
          const node = $.const(symbol).assign(
            // TODO: parser - add types, generate types without transforms
            $.func()
              .param(dataVariableName, (p) => p.type('any'))
              .do(...nodes),
          );
          plugin.node(node);
        }
      } finally {
        buildingSymbols.delete(symbol.id);
      }
    }

    // Only emit a call if the symbol has a value (implementation) OR the
    // symbol is currently being built (recursive reference) — in the
    // latter case we allow emitting a call that will be implemented later.
    if (symbol.node || buildingSymbols.has(symbol.id)) {
      // TODO: contract (self)
      const ref = plugin.referenceSymbol(query);
      const callExpression = $(ref).call(dataExpression);

      if (dataExpression) {
        // In a map callback, the item needs to be returned, not just the transformation result
        if (typeof dataExpression === 'string' && dataExpression === 'item') {
          return [$.return(callExpression)];
        }

        return [
          typeof dataExpression === 'string'
            ? callExpression
            : $(dataExpression).assign(callExpression),
        ];
      }
    }

    return [];
  }

  if (schema.type === 'array') {
    if (!dataExpression || typeof dataExpression === 'string') {
      return [];
    }

    // TODO: parser - handle tuples and complex arrays
    const nodes = !schema.items
      ? []
      : processSchemaType({
          dataExpression: 'item',
          plugin,
          schema: schema.items?.[0]
            ? schema.items[0]
            : {
                ...schema,
                type: undefined,
              },
        });

    if (!nodes.length) {
      return [];
    }

    // TODO: remove
    // Ensure the map callback has a return statement for the item
    const mapCallbackStatements: Array<Expr> = nodes;
    const hasReturnStatement = mapCallbackStatements.some((stmt) => isNodeReturnStatement(stmt));

    if (!hasReturnStatement) {
      mapCallbackStatements.push($.return('item'));
    }

    return [
      $(dataExpression).assign(
        $(dataExpression)
          .attr('map')
          .call(
            $.func()
              .param('item', (p) => p.type('any'))
              .do(...mapCallbackStatements),
          ),
      ),
    ];
  }

  if (schema.type === 'object') {
    let nodes: Array<Expr> = [];
    const required = schema.required ?? [];

    for (const name in schema.properties) {
      const property = schema.properties[name]!;
      const propertyAccessExpression = $(dataExpression || dataVariableName).attr(name);
      const propertyNodes = processSchemaType({
        dataExpression: propertyAccessExpression,
        plugin,
        schema: property,
      });
      if (!propertyNodes.length) {
        continue;
      }
      const noNullableTypesInSchema = !property.items?.find((x) => x.type === 'null');
      const requiredField = required.includes(name);
      // Cannot fully rely on required fields
      // Such value has to be present, but it doesn't guarantee that this value is not nullish
      if (requiredField && noNullableTypesInSchema) {
        nodes = nodes.concat(propertyNodes);
      } else {
        nodes.push(
          // todo: Probably, it would make more sense to go with if(x !== undefined && x !== null) instead of if(x)
          // this place influences all underlying transformers, while it's not exactly transformer itself
          // Keep in mind that !!0 === false, so it already makes output for Bigint undesirable
          $.if(propertyAccessExpression).do(...propertyNodes),
        );
      }
    }

    if (schema.additionalProperties && dataExpression) {
      const key = plugin.symbol('key');
      const entryValueNodes = processSchemaType({
        dataExpression: $(dataExpression).attr(key).computed(),
        plugin,
        schema: schema.additionalProperties,
      });

      if (entryValueNodes.length) {
        const properties = Object.keys(schema.properties ?? {});
        nodes.push(
          $.for($.const(key))
            .of($('Object').attr('keys').call(dataExpression))
            .$if(
              properties.length,
              (f) =>
                f.do(
                  $.if(
                    $.not(
                      $.array(...properties)
                        .attr('includes')
                        .call(key),
                    ),
                  ).do(...entryValueNodes),
                ),
              (f) => f.do(...entryValueNodes),
            ),
        );
      }
    }

    return nodes;
  }

  if (schema.items) {
    if (schema.items.length === 1) {
      return processSchemaType({
        dataExpression: 'item',
        plugin,
        schema: schema.items[0]!,
      });
    }

    let arrayNodes: Array<Expr> = [];
    // process 2 items if one of them is null
    if (
      schema.logicalOperator === 'and' ||
      (schema.items.length === 2 &&
        schema.items.find((item) => item.type === 'null' || item.type === 'void'))
    ) {
      for (const item of schema.items) {
        const nodes = processSchemaType({
          dataExpression: dataExpression || 'item',
          plugin,
          schema: item,
        });
        if (nodes.length) {
          if (dataExpression) {
            arrayNodes = arrayNodes.concat(nodes);
          } else {
            // processed means the item was transformed
            arrayNodes.push($.if('item').do(...nodes), $.return('item'));
          }
        }
      }
      return arrayNodes;
    }

    // assume enums do not contain transformable values
    if (schema.type !== 'enum') {
      const hasSimpleTypes = (schema.items ?? []).every((item) =>
        (
          ['boolean', 'integer', 'null', 'number', 'string'] as ReadonlyArray<typeof item.type>
        ).includes(item.type),
      );

      // Skip warning if items are processable through other mechanisms:
      // 1. All items are $ref-based (e.g., discriminated oneOf/anyOf)
      // 2. All items are nested allOf ($ref wrapped in allOf for discriminators)
      // These patterns are handled correctly by recursive processing logic
      const isProcessable = (schema.items ?? []).every((item) => {
        // Direct $ref items are processable
        if (item.$ref) {
          return true;
        }
        // Nested allOf items (common in discriminated unions) are processable
        if (item.logicalOperator === 'and' && item.items) {
          return true;
        }
        return false;
      });

      if (!hasSimpleTypes && !isProcessable) {
        console.warn(
          `❗️ Transformers warning: schema ${JSON.stringify(schema)} is too complex and won't be currently processed. This will likely produce an incomplete transformer which is not what you want. Please open an issue if you'd like this improved https://github.com/hey-api/hey-api/issues`,
        );
      }
    }
  }

  for (const transformer of plugin.config.transformers) {
    const t = transformer({
      $,
      config: plugin.config,
      dataExpression,
      plugin,
      schema,
    });
    if (t) {
      return t;
    }
  }

  return [];
}

// handles only response transformers for now
export const handler: HeyApiTransformersPlugin['Handler'] = ({ plugin }) => {
  plugin.forEach(
    'operation',
    ({ operation }) => {
      const { response } = operationResponsesMap(operation);
      if (!response) return;

      const isNullableUnion =
        response.items?.length === 2 &&
        response.items.some((item) => item.type === 'null' || item.type === 'void');

      if (
        response.items &&
        response.items.length > 1 &&
        response.logicalOperator !== 'and' &&
        !isNullableUnion
      ) {
        if (plugin.context.config.logs.level === 'debug') {
          console.warn(
            `❗️ Transformers warning: route ${createOperationKey(operation)} has ${response.items.length} non-void success responses. This is currently not handled and we will not generate a response transformer. Please open an issue if you'd like this feature https://github.com/hey-api/hey-api/issues`,
          );
        }
        return;
      }

      // TODO: contract (?)
      const symbolResponse = plugin.querySymbol({
        category: 'type',
        resource: 'operation',
        resourceId: operation.id,
        role: 'response',
      });
      if (!symbolResponse) return;

      // TODO: parser - consider handling simple string response which is also a date
      const nodes = schemaResponseTransformerNodes({
        plugin,
        schema: response,
      });
      if (!nodes.length) return;

      // For nullable union responses (e.g., anyOf: [SomeSchema, null]), wrap the
      // transformation in a null guard so that null data is returned as-is.
      // We require nodes.length >= 2 because we need at least one transformation
      // statement AND a return statement (empty .do() would fail validation).
      let finalNodes = nodes;
      if (isNullableUnion && nodes.length >= 2) {
        const lastNode = nodes[nodes.length - 1]!;
        if (isNodeReturnStatement(lastNode as Expr)) {
          const transformNodes = nodes.slice(0, -1) as Array<Expr>;
          finalNodes = [$.if($(dataVariableName)).do(...transformNodes), lastNode];
        }
      }

      const symbol = plugin.symbol(
        applyNaming(operation.id, {
          case: 'camelCase',
          name: '{{name}}ResponseTransformer',
        }),
        {
          meta: {
            category: 'transform',
            resource: 'operation',
            resourceId: operation.id,
            role: 'response',
          },
        },
      );
      const value = $.const(symbol)
        .export()
        .assign(
          // TODO: parser - add types, generate types without transforms
          $.func()
            .async()
            .param(dataVariableName, (p) => p.type('any'))
            .returns($.type('Promise').generic(symbolResponse))
            .do(...finalNodes),
        );
      plugin.node(value);
    },
    {
      order: 'declarations',
    },
  );
};
