import type { IR } from '@hey-api/shared';
import { applyNaming } from '@hey-api/shared';

import type { TsDsl } from '../../../../ts-dsl';
import { $ } from '../../../../ts-dsl';
import {
  createOperationComment,
  hasOperationSse,
  isOperationOptionsRequired,
} from '../../../shared/utils/operation';
import { createQueryKeyFunction, createQueryKeyType, queryKeyStatement } from '../query-key';
import { handleMeta } from '../shared/meta';
import { createUnwrapSkipTokenFunction } from '../shared/unwrap-skip-token';
import { useTypeData, useTypeError, useTypeResponse } from '../shared/use-type';
import type { PluginInstance } from '../types';

const optionsParamName = 'options';

export function createQueryOptions({
  operation,
  plugin,
}: {
  operation: IR.OperationObject;
  plugin: PluginInstance;
}): void {
  if (hasOperationSse({ operation })) return;

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
      resource: 'unwrapSkipToken',
    })
  ) {
    createUnwrapSkipTokenFunction({ plugin });
  }

  const symbolQueryKey = plugin.symbol(applyNaming(operation.id, plugin.config.queryKeys));
  const node = queryKeyStatement({
    isInfinite: false,
    operation,
    plugin,
    symbol: symbolQueryKey,
  });
  plugin.node(node);

  const typeResponse = useTypeResponse({ operation, plugin });

  const symbolSkipToken = $(plugin.imports.skipToken);
  const symbolUnwrapSkipToken = plugin.referenceSymbol({
    artifact: plugin.name,
    category: 'utility',
    resource: 'unwrapSkipToken',
  });
  const unwrappedName = 'unwrapped';
  const unwrappedRef = $(unwrappedName);
  const unwrappedCall = $(symbolUnwrapSkipToken).call(optionsParamName);

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
      .call(
        $.object()
          .spread(unwrappedRef)
          .spread($('queryKey').attr(0))
          .prop('signal', $('signal'))
          .prop('throwOnError', $.literal(true)),
      )
      .await(),
  );

  const statements: Array<TsDsl<any>> = [];
  if (plugin.getPluginOrThrow('@hey-api/sdk').config.responseStyle === 'data') {
    statements.push($.return(awaitSdkFn));
  } else {
    statements.push($.const().object('data').assign(awaitSdkFn), $.return('data'));
  }

  const asyncQueryFn = $.func()
    .async()
    .param((p) => p.object('queryKey', 'signal'))
    .do(...statements);

  const typeData = useTypeData({ operation, plugin });

  const queryOptionsObj = $.object()
    .pretty()
    .prop(
      'queryFn',
      $.ternary($(optionsParamName).eq(symbolSkipToken))
        .do(symbolSkipToken)
        .otherwise(asyncQueryFn),
    )
    .prop('queryKey', $(symbolQueryKey).call(optionsParamName))
    .$if(handleMeta(plugin, operation, 'queryOptions'), (o, v) => o.prop('meta', v));
  const paramType = $.type.or(typeData, $.type.query(symbolSkipToken));

  const symbolQueryOptionsFn = plugin.symbol(
    applyNaming(operation.id, plugin.config.queryOptions),
    {
      meta: {
        category: 'hook',
        resource: 'operation',
        resourceId: operation.id,
        role: 'queryOptions',
      },
    },
  );
  // TODO: add type error
  // TODO: AxiosError<PutSubmissionMetaError>
  const statement = $.const(symbolQueryOptionsFn)
    .export(plugin.config.queryOptions.exported)
    .$if(plugin.config.comments && createOperationComment(operation), (c, v) => c.doc(v))
    .assign(
      $.func()
        .param(optionsParamName, (p) => p.required(isRequiredOptions).type(paramType))
        .do(
          $.const(unwrappedName).assign(unwrappedCall),
          $(plugin.imports.queryOptions)
            .call(queryOptionsObj)
            .generics(
              typeResponse,
              useTypeError({ operation, plugin }),
              typeResponse,
              $(symbolQueryKey).returnType(),
            )
            .return(),
        ),
    );
  plugin.node(statement);
}
