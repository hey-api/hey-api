import type { IR } from '@hey-api/shared';
import { applyNaming, operationPagination } from '@hey-api/shared';

import type { TsDsl } from '../../../../ts-dsl';
import { $ } from '../../../../ts-dsl';
import {
  createOperationComment,
  isOperationOptionsRequired,
} from '../../../shared/utils/operation';
import { createQueryKeyFunction, createQueryKeyType, queryKeyStatement } from '../query-key';
import { handleMeta } from '../shared/meta';
import {
  ensureFieldsResponseTypes,
  fieldsResultStatements,
  fieldsStyleParamName,
  fieldsStyleUnion,
} from '../shared/response-types';
import { useTypeData, useTypeError, useTypeResponse } from '../shared/use-type';
import type { PluginInstance } from '../types';

function createInfiniteParamsFunction({ plugin }: { plugin: PluginInstance }): void {
  const symbolCreateInfiniteParams = plugin.symbol(
    applyNaming('createInfiniteParams', {
      case: plugin.config.case,
    }),
    {
      meta: {
        category: 'utility',
        resource: 'createInfiniteParams',
      },
    },
  );

  const fn = $.const(symbolCreateInfiniteParams).assign(
    $.func()
      .generic('K', (g) =>
        g.extends(
          $.type('Pick').generics(
            $.type('QueryKey').generic('Options').idx(0),
            $.type.or(
              $.type.literal('body'),
              $.type.literal('headers'),
              $.type.literal('path'),
              $.type.literal('query'),
            ),
          ),
        ),
      )
      .param('queryKey', (p) => p.type('QueryKey<Options>'))
      .param('page', (p) => p.type('K'))
      .do(
        $.const('params').assign($.object().spread($('queryKey').attr(0))),
        $.if($('page').attr('body')).do(
          $('params')
            .attr('body')
            .assign(
              $.object()
                .pretty()
                .spread($('queryKey').attr(0).attr('body').as('any'))
                .spread($('page').attr('body').as('any')),
            ),
        ),
        $.if($('page').attr('headers')).do(
          $('params')
            .attr('headers')
            .assign(
              $.object()
                .pretty()
                .spread($('queryKey').attr(0).attr('headers'))
                .spread($('page').attr('headers')),
            ),
        ),
        $.if($('page').attr('path')).do(
          $('params')
            .attr('path')
            .assign(
              $.object()
                .pretty()
                .spread($('queryKey').attr(0).attr('path').as('any'))
                .spread($('page').attr('path').as('any')),
            ),
        ),
        $.if($('page').attr('query')).do(
          $('params')
            .attr('query')
            .assign(
              $.object()
                .pretty()
                .spread($('queryKey').attr(0).attr('query').as('any'))
                .spread($('page').attr('query').as('any')),
            ),
        ),
        $.return($('params').as('unknown').as($('page').typeofType())),
      ),
  );
  plugin.node(fn);
}

export function createInfiniteQueryOptions({
  operation,
  plugin,
}: {
  operation: IR.OperationObject;
  plugin: PluginInstance;
}): void {
  const pagination = operationPagination({
    context: plugin.context,
    operation,
  });

  if (!pagination) {
    return;
  }

  const isRequiredOptions = isOperationOptionsRequired({
    context: plugin.context,
    operation,
  });

  if (
    // TODO: contract (self)
    !plugin.querySymbol({
      artifact: plugin.name,
      category: 'utility',
      resource: 'createQueryKey',
    })
  ) {
    createQueryKeyType({ plugin });
    createQueryKeyFunction({ plugin });
  }

  if (
    // TODO: contract (self)
    !plugin.querySymbol({
      artifact: plugin.name,
      category: 'utility',
      resource: 'createInfiniteParams',
    })
  ) {
    createInfiniteParamsFunction({ plugin });
  }

  const typeData = useTypeData({ operation, plugin });
  const typeResponse = useTypeResponse({ operation, plugin });
  // TODO: contract (self)
  const symbolQueryKeyType = plugin.referenceSymbol({
    artifact: plugin.name,
    category: 'type',
    resource: 'QueryKey',
  });
  const typeQueryKey = $.type(symbolQueryKeyType).generic(typeData);
  const typePageObjectParam = $.type('Pick').generics(
    typeQueryKey.idx(0),
    $.type.or(
      $.type.literal('body'),
      $.type.literal('headers'),
      $.type.literal('path'),
      $.type.literal('query'),
    ),
  );
  const pluginTypeScript = plugin.getPluginOrThrow('@hey-api/typescript');
  const type = pluginTypeScript.api.schemaToType(pluginTypeScript, pagination.schema);

  const symbolInfiniteQueryKey = plugin.symbol(
    applyNaming(operation.id, plugin.config.infiniteQueryKeys),
  );
  const node = queryKeyStatement({
    isInfinite: true,
    operation,
    plugin,
    symbol: symbolInfiniteQueryKey,
    typeQueryKey,
  });
  plugin.node(node);

  const typeError = useTypeError({ operation, plugin });
  const isFields = plugin.config.responseStyle === 'fields';

  const fieldsTypes = isFields ? ensureFieldsResponseTypes(plugin) : undefined;
  const wrappedResponse = fieldsTypes
    ? $.type(fieldsTypes.symbolResponseResult).generic(typeResponse).generic(fieldsStyleParamName)
    : typeResponse;
  const wrappedError = fieldsTypes
    ? $.type(fieldsTypes.symbolErrorResult).generic(typeError).generic(fieldsStyleParamName)
    : typeError;

  const sdkCallObject = isFields
    ? $.object()
        .spread('options')
        .spread('params')
        .prop('responseStyle', $.literal('fields'))
        .prop('signal', $('signal'))
        .prop('throwOnError', $.literal(false))
    : $.object()
        .spread('options')
        .spread('params')
        .prop('signal', $('signal'))
        .prop('throwOnError', $.literal(true));

  const awaitSdkFn = $.lazy((ctx) =>
    ctx
      .access(
        // TODO: contract (cross)
        plugin.referenceSymbol({
          category: 'sdk',
          resource: 'operation',
          resourceId: operation.id,
        }),
      )
      .call(sdkCallObject)
      .await(),
  );
  // TODO: contract (self)
  const symbolCreateInfiniteParams = plugin.referenceSymbol({
    artifact: plugin.name,
    category: 'utility',
    resource: 'createInfiniteParams',
  });

  const statements: Array<TsDsl<any>> = [
    $.const('page')
      .type(typePageObjectParam)
      .hint('@ts-ignore')
      .assign(
        $.ternary($('pageParam').typeofExpr().eq($.literal('object')))
          .do('pageParam')
          .otherwise(
            $.object()
              .pretty()
              .prop(pagination.in, $.object().pretty().prop(pagination.name, $('pageParam'))),
          ),
      ),
    $.const('params').assign($(symbolCreateInfiniteParams).call('queryKey', 'page')),
  ];

  if (fieldsTypes) {
    statements.push(
      ...fieldsResultStatements({
        awaitSdkFn,
        fieldsTypes,
        optionsName: 'options',
        wrappedError,
        wrappedResponse,
      }),
    );
  } else if (plugin.getPluginOrThrow('@hey-api/sdk').config.responseStyle === 'data') {
    statements.push($.return(awaitSdkFn));
  } else {
    statements.push($.const().object('data').assign(awaitSdkFn), $.return('data'));
  }

  const symbolInfiniteQueryOptionsFn = plugin.symbol(
    applyNaming(operation.id, plugin.config.infiniteQueryOptions),
  );
  const statement = $.const(symbolInfiniteQueryOptionsFn)
    .export()
    .$if(plugin.config.comments && createOperationComment(operation), (c, v) => c.doc(v))
    .assign(
      $.func()
        .$if(isFields, (f) =>
          f.generic(fieldsStyleParamName, (g) =>
            g.extends(fieldsStyleUnion()).default($.type.literal('fields')),
          ),
        )
        .param('options', (p) => {
          const optionsType = isFields
            ? $.type.and(
                typeData,
                $.type
                  .object()
                  .prop('responseStyle', (op) => op.type(fieldsStyleParamName).optional()),
              )
            : typeData;
          return p.required(isRequiredOptions).type(optionsType);
        })
        .do(
          $.const('opts').assign(
            $(plugin.imports.infiniteQueryOptions)
              .call(
                $.object()
                  .pretty()
                  .hint('@ts-ignore')
                  .prop(
                    'queryFn',
                    $.func()
                      .async()
                      .param((p) => p.object('pageParam', 'queryKey', 'signal'))
                      .do(...statements),
                  )
                  .prop('queryKey', $(symbolInfiniteQueryKey).call('options'))
                  .$if(handleMeta(plugin, operation, 'infiniteQueryOptions'), (o, v) =>
                    o.prop('meta', v),
                  ),
              )
              .generics(
                wrappedResponse,
                wrappedError,
                $.type(plugin.imports.InfiniteData).generic(wrappedResponse),
                typeQueryKey,
                $.type.or(type, typePageObjectParam),
              ),
          ),
          // The suppressed overload mismatch above makes TypeScript resolve
          // the call against the defined-initial-data overload, so the
          // inferred type carries a phantom required `initialData`. Strip it
          // so spreading the result into useInfiniteQuery() selects the
          // undefined-initial-data overload and consumers get honest result
          // types (`data` may be undefined, `isPending` is a real boolean).
          $.return(
            $('opts').as(
              $.type('Omit').generics($('opts').typeofType(), $.type.literal('initialData')),
            ),
          ),
        ),
    );
  plugin.node(statement);
}
