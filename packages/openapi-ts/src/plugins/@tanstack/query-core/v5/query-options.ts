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
import {
  ensureFieldsResponseTypes,
  fieldsResultStatements,
  fieldsStyleParamName,
  fieldsStyleUnion,
} from '../shared/response-types';
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

  const symbolQueryKey = plugin.symbol(applyNaming(operation.id, plugin.config.queryKeys));
  const node = queryKeyStatement({
    isInfinite: false,
    operation,
    plugin,
    symbol: symbolQueryKey,
  });
  plugin.node(node);

  const typeResponse = useTypeResponse({ operation, plugin });
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
        .spread(optionsParamName)
        .spread($('queryKey').attr(0))
        .prop('responseStyle', $.literal('fields'))
        .prop('signal', $('signal'))
        .prop('throwOnError', $.literal(false))
    : $.object()
        .spread(optionsParamName)
        .spread($('queryKey').attr(0))
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

  const statements: Array<TsDsl<any>> = [];
  if (fieldsTypes) {
    statements.push(
      ...fieldsResultStatements({
        awaitSdkFn,
        fieldsTypes,
        optionsName: optionsParamName,
        wrappedError,
        wrappedResponse,
      }),
    );
  } else if (plugin.getPluginOrThrow('@hey-api/sdk').config.responseStyle === 'data') {
    statements.push($.return(awaitSdkFn));
  } else {
    statements.push($.const().object('data').assign(awaitSdkFn), $.return('data'));
  }

  const queryOptionsObj = $.object()
    .pretty()
    .prop(
      'queryFn',
      $.func()
        .async()
        .param((p) => p.object('queryKey', 'signal'))
        .do(...statements),
    )
    .prop('queryKey', $(symbolQueryKey).call(optionsParamName))
    .$if(handleMeta(plugin, operation, 'queryOptions'), (o, v) => o.prop('meta', v));

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
        .$if(isFields, (f) =>
          f.generic(fieldsStyleParamName, (g) =>
            g.extends(fieldsStyleUnion()).default($.type.literal('fields')),
          ),
        )
        .param(optionsParamName, (p) => {
          const baseType = useTypeData({ operation, plugin });
          const optionsType = isFields
            ? $.type.and(
                baseType,
                $.type
                  .object()
                  .prop('responseStyle', (op) => op.type(fieldsStyleParamName).optional()),
              )
            : baseType;
          return p.required(isRequiredOptions).type(optionsType);
        })
        .do(
          $(plugin.imports.queryOptions)
            .call(queryOptionsObj)
            .generics(
              wrappedResponse,
              wrappedError,
              wrappedResponse,
              $(symbolQueryKey).returnType(),
            )
            .return(),
        ),
    );
  plugin.node(statement);
}
