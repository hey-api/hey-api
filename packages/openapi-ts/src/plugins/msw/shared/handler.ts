import type { Symbol } from '@hey-api/codegen-core';
import type { IR } from '@hey-api/shared';
import { applyNaming } from '@hey-api/shared';

import { $ } from '../../../ts-dsl';
import type { MswPlugin } from '../types';
import { computeDominantResponse, type DominantResponse } from './compute-dominant-response';
import { getOperationComment } from './operation';
import { sanitizeParamName, sanitizePath } from './path';
import { createHttpResponse } from './response';

function emitToResponseUnion(plugin: MswPlugin['Instance']) {
  const symbol = plugin.symbol('ToResponseUnion', {
    meta: {
      category: 'type',
      resource: 'to-response-union',
    },
  });
  const extractKeyofTNumber = $.type('Extract')
    .generic($.type('keyof T'))
    .generic($.type('number'));
  const toResponseUnionType = $.type
    .alias(symbol)
    .generic('T')
    .type(
      $.type.idx(
        $.type
          .mapped('K')
          .key(extractKeyofTNumber)
          .type(
            $.type
              .object()
              .prop('status', (p) => p.type('K'))
              .prop('body', (p) => p.type($.type('T').idx($.type('K')))),
          ),
        $.type('Extract').generic($.type('keyof T')).generic($.type('number')),
      ),
    );
  plugin.node(toResponseUnionType);
}

function createHandlerNode({
  baseUrl,
  bodyType,
  operation,
  paramsType,
  plugin,
  response,
  responseParamType,
}: {
  baseUrl: string | undefined;
  bodyType: ReturnType<typeof $.type.idx | typeof $.type>;
  operation: IR.OperationObject;
  paramsType: ReturnType<typeof $.type | typeof $.type.object>;
  plugin: MswPlugin['Instance'];
  response: DominantResponse;
  responseParamType: ReturnType<typeof $.type | typeof $.type.or>;
}): Symbol {
  const symbolHttp = plugin.imports.http;
  const symbolResponse = plugin.symbol('response');
  const symbolOptions = plugin.symbol('options');

  const symbol = plugin.symbol(
    applyNaming(`handle-${operation.id}`, {
      casing: 'camelCase', // TODO: expose as a config option
    }),
  );

  const notImplementedResponse = $.new(
    'Response',
    $.literal('Not Implemented'),
    $.object()
      .pretty()
      .prop('status', $.literal(501))
      .prop('statusText', $.literal('Not Implemented')),
  );

  const hasResponse = response.example !== undefined;

  const handlerFunc = $.func(symbol)
    .export()
    .$if(plugin.config.comments && getOperationComment(operation), (f, v) =>
      f.styledDoc(v, plugin.config.commentsStyle),
    )
    .param(symbolResponse, (p) => p.optional().type(responseParamType))
    .param(symbolOptions, (p) =>
      p.optional().type(
        plugin.referenceSymbol({
          artifact: 'msw',
          category: 'type',
          resource: 'request-handler-options',
        }),
      ),
    )
    .returns(plugin.imports.HttpHandler)
    .do(
      $(symbolHttp)
        .attr(operation.method)
        .call(
          $.template(
            $(symbolOptions)
              .attr('baseUrl')
              .optional()
              .coalesce($.literal(baseUrl ?? '')),
          ).add(sanitizePath(operation.path)),
          $.func()
            .param('info')
            .do(
              $.if($.typeofExpr(symbolResponse).eq($.literal('function'))).do(
                $(symbolResponse).call('info').return(),
              ),
              $.const('body').assign(
                $(symbolResponse)
                  .attr('body')
                  .optional()
                  .$if(hasResponse, (c) => c.coalesce($.fromValue(response.example))),
              ),
              $.if($('body').neq($('undefined'))).do(
                createHttpResponse({
                  plugin,
                  response,
                  symbol: symbolResponse,
                }).return(),
              ),
            )
            .$if(!hasResponse, (f) =>
              f.$if(
                plugin.config.responseFallback === 'error',
                (f) =>
                  f.do(
                    $.if(
                      $(symbolOptions)
                        .attr('responseFallback')
                        .optional()
                        .eq($.literal('passthrough')),
                    ).do($.return()),
                    notImplementedResponse.return(),
                  ),
                (f) =>
                  f.do(
                    $.if(
                      $(symbolOptions).attr('responseFallback').optional().eq($.literal('error')),
                    ).do(notImplementedResponse.return()),
                  ),
              ),
            ),
          symbolOptions,
        )
        .generics(paramsType, bodyType)
        .return(),
    );
  plugin.node(handlerFunc);
  return symbol;
}

export function getHandler({
  baseUrl,
  operation,
  plugin,
}: {
  baseUrl: string | undefined;
  operation: IR.OperationObject;
  plugin: MswPlugin['Instance'];
}): Symbol {
  const response = computeDominantResponse({ operation, plugin });

  const symbolResponsesType = plugin.querySymbol({
    category: 'type',
    resource: 'operation',
    resourceId: operation.id,
    role: 'responses',
  });

  const symbolDataType = plugin.querySymbol({
    category: 'type',
    resource: 'operation',
    resourceId: operation.id,
    role: 'data',
  });

  let bodyType: ReturnType<typeof $.type.idx | typeof $.type>;
  if (operation.body && symbolDataType) {
    if (operation.body?.schema.type === 'unknown') {
      bodyType = $.type(plugin.imports.DefaultBodyType);
    } else {
      bodyType = $.type(symbolDataType).idx($.type.literal('body'));
    }
  } else {
    bodyType = $.type('never');
  }

  let paramsType: ReturnType<typeof $.type | typeof $.type.object>;
  if (operation.parameters?.path && Object.keys(operation.parameters.path).length) {
    // Generate inline object type with sanitized param names derived from the
    // path string (not the IR keys, which are lowercased and may diverge from
    // the original spec names that the TypeScript plugin preserves).
    const objType = $.type.object();
    for (const parameter of Object.values(operation.parameters.path ?? {})) {
      // OpenAPI 3.x path params are always single-segment, so MSW (path-to-regexp v6)
      // will always provide a single string. Multi-segment params ({path+}) are proposed
      // for OpenAPI 4.0 — revisit this if/when that lands.
      objType.prop(sanitizeParamName(parameter.name), (p) => p.type('string'));
    }
    paramsType = objType;
  } else {
    paramsType = $.type('never');
  }

  const resolverType = $.type(plugin.imports.HttpResponseResolver).generics(
    paramsType,
    bodyType,
    // omit response type to avoid DefaultBodyType constraint issues
  );

  if (!plugin.config.source.includes('@hey-api/examples')) {
    // examples are disabled, strip the example from the dominant response
    response.example = undefined;
  }

  const responseType = $.type
    .object()
    .prop('body', (p) =>
      p.type(
        response.statusCode !== undefined && symbolResponsesType
          ? $.type(symbolResponsesType).idx($.type.literal(response.statusCode))
          : $.type(plugin.imports.DefaultBodyType),
      ),
    )
    .prop('status', (p) =>
      p
        .optional()
        .type(
          response.statusCode !== undefined
            ? $.type.literal(response.statusCode)
            : $.type('number'),
        ),
    );
  const symbolResponseType = plugin.symbol(
    applyNaming(`handle-${operation.id}-response`, {
      casing: 'PascalCase', // TODO: expose as a config option
    }),
  );
  plugin.node($.type.alias(symbolResponseType).export().type(responseType));

  let responsesOverrideType: ReturnType<typeof $.type> | undefined;
  if (symbolResponsesType && response.allCandidates.length > 1) {
    if (!plugin.querySymbol({ category: 'type', resource: 'to-response-union' })) {
      emitToResponseUnion(plugin);
    }
    responsesOverrideType = $.type(
      plugin.referenceSymbol({
        category: 'type',
        resource: 'to-response-union',
      }),
    ).generic(symbolResponsesType);
  }
  const responseParamType = $.type.or(
    symbolResponseType,
    responsesOverrideType ? $.type.or(responsesOverrideType, resolverType) : resolverType,
  );

  return createHandlerNode({
    baseUrl,
    bodyType,
    operation,
    paramsType,
    plugin,
    response,
    responseParamType,
  });
}
