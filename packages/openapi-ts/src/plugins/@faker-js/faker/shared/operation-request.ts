import type { IR } from '@hey-api/shared';
import { buildSymbolIn, pathToName } from '@hey-api/shared';

import { $ } from '../../../../ts-dsl';
import type { FakerJsFakerPlugin } from '../types';
import type { ProcessorResult } from './processor';
import type { FakerResult } from './types';

interface RequestPart {
  key: string;
  result: FakerResult;
}

/**
 * Convert a record of IR parameters into an IR object schema.
 * Follows the same pattern as valibot's `buildOperationSchema`.
 */
function irParametersToIrSchema(
  params: Record<string, IR.ParameterObject>,
): IR.SchemaObject | undefined {
  const properties: Record<string, IR.SchemaObject> = {};
  const required: Array<string> = [];

  for (const key in params) {
    const parameter = params[key]!;
    properties[parameter.name] = parameter.schema;
    if (parameter.required) {
      required.push(parameter.name);
    }
  }

  if (!Object.keys(properties).length) return undefined;

  return { properties, required, type: 'object' };
}

/**
 * Collect the non-void request parts from an operation.
 * Returns an array of { key, schema } entries for body, headers, path, query.
 */
function collectRequestParts(
  operation: IR.OperationObject,
): ReadonlyArray<{ key: string; schema: IR.SchemaObject }> {
  const parts: Array<{ key: string; schema: IR.SchemaObject }> = [];

  if (operation.body) {
    parts.push({ key: 'body', schema: operation.body.schema });
  }

  if (operation.parameters) {
    for (const location of ['header', 'path', 'query'] satisfies ReadonlyArray<
      keyof typeof operation.parameters
    >) {
      const params = operation.parameters[location];
      if (!params) continue;

      const propKey = location === 'header' ? 'headers' : location;
      const schema = irParametersToIrSchema(params);
      if (schema) {
        parts.push({ key: propKey, schema });
      }
    }
  }

  return parts;
}

/**
 * Generate a single request factory per operation that combines
 * body, path params, query params, and headers into one object.
 */
export function irOperationRequestToAst({
  operation,
  path,
  plugin,
  processor,
  tags,
}: {
  operation: IR.OperationObject;
  path: ReadonlyArray<string | number>;
  plugin: FakerJsFakerPlugin['Instance'];
  processor: ProcessorResult;
  tags?: ReadonlyArray<string>;
}): void {
  if (!plugin.config.requests.enabled) return;

  const parts = collectRequestParts(operation);
  if (parts.length === 0) return;

  // Process each part independently through the processor
  const processedParts: Array<RequestPart> = [];
  let usesFaker = false;
  let usesAccessor = false;

  for (const part of parts) {
    const result = processor.process({
      export: false,
      meta: {
        resource: 'operation',
        resourceId: operation.id,
        role: 'request',
      },
      naming: plugin.config.requests,
      namingAnchor: operation.id,
      path: [...path, 'request', part.key],
      plugin,
      schema: part.schema,
      tags,
    }) as FakerResult | void;

    if (!result) continue;

    processedParts.push({ key: part.key, result });
    usesFaker = usesFaker || result.usesFaker;
    usesAccessor = usesAccessor || result.usesAccessor;
  }

  if (processedParts.length === 0) return;

  // Build combined object expression
  let obj = $.object().pretty();
  for (const { key, result } of processedParts) {
    obj = obj.prop(key, result.expression);
  }

  const name = pathToName([...path, 'request'], { anchor: operation.id });

  const symbol = plugin.symbol(
    buildSymbolIn({
      meta: {
        category: 'schema',
        path: [...path, 'request'],
        resource: 'operation',
        resourceId: operation.id,
        role: 'request',
        tags,
      },
      name,
      naming: plugin.config.requests,
      plugin,
      schema: { type: 'object' },
    }),
  );

  // Look up TypeScript Data type for return type annotation
  const typeSymbol = plugin.querySymbol({
    artifact: 'types',
    category: 'type',
    resource: 'operation',
    resourceId: operation.id,
    role: 'data',
  });

  const arrowFn = $.func()
    .arrow()
    .$if(usesFaker, (f) => f.param('options', (p) => p.optional().type('Options')))
    .$if(typeSymbol, (f) =>
      f.returns(
        $.type
          .expr('Omit')
          .generic($.type(typeSymbol!))
          .generic($.type.or($.type.literal('url'), $.type.literal('method'))),
      ),
    )
    .$if(
      usesAccessor,
      (f) => {
        const fDecl = $.const('f').assign(
          $.binary($('options').attr('faker').optional(), '??', $(plugin.imports.faker)),
        );
        return f.do(fDecl, $.return(obj));
      },
      (f) => f.do($.return(obj)),
    );

  plugin.node($.const(symbol).export().assign(arrowFn));
}
