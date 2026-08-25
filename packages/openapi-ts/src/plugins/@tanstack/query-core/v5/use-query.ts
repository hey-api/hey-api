import type { IR } from '@hey-api/shared';
import { applyNaming } from '@hey-api/shared';

import { $ } from '../../../../ts-dsl';
import {
  createOperationComment,
  hasOperationSse,
  isOperationOptionsRequired,
} from '../../../shared/utils/operation';
import { useTypeData, useTypeError, useTypeResponse } from '../shared/use-type';
import type { PluginInstance } from '../types';

const optionsParamName = 'options';
const queryOptionsParamName = 'queryOptions';

export function createUseQuery({
  operation,
  plugin,
}: {
  operation: IR.OperationObject;
  plugin: PluginInstance;
}): void {
  if (hasOperationSse({ operation })) return;

  // 'useQuery' currently only exists on react-query/preact-query config; vue
  // needs computed()-wrapping for reactivity and svelte/solid/angular use
  // differently named hooks (createQuery/injectQuery), so this wrapper hook
  // isn't generated for them yet.
  if (!('useQuery' in plugin.config)) return;

  const symbolUseQueryFn = plugin.symbol(applyNaming(operation.id, plugin.config.useQuery));

  const isRequiredOptions = isOperationOptionsRequired({
    context: plugin.context,
    operation,
  });
  const typeData = useTypeData({ operation, plugin });
  const typeResponse = useTypeResponse({ operation, plugin });
  // TODO: contract (self)
  const symbolQueryOptionsFn = plugin.referenceSymbol({
    artifact: plugin.name,
    category: 'hook',
    resource: 'operation',
    resourceId: operation.id,
    role: 'queryOptions',
  });
  // queryOptions is force-enabled whenever useQuery is enabled, so the query
  // key symbol it creates is already registered under this name.
  const symbolQueryKey = plugin.symbol(applyNaming(operation.id, plugin.config.queryKeys));

  const queryType = $.type(plugin.imports.UseQueryOptions)
    .generic(typeResponse)
    .generic(useTypeError({ operation, plugin }))
    .generic(typeResponse)
    .generic($(symbolQueryKey).returnType());

  const func = $.func()
    .param(optionsParamName, (p) => p.required(isRequiredOptions).type(typeData))
    .param(queryOptionsParamName, (p) =>
      p
        .optional()
        .type(
          $.type('Partial').generic(
            $.type('Omit', (t) =>
              t.generics(
                queryType,
                $.type.or($.type.literal('queryKey'), $.type.literal('queryFn')),
              ),
            ),
          ),
        ),
    );

  func.do(
    $(plugin.imports.useQuery)
      .call(
        $.object()
          .spread($(symbolQueryOptionsFn).call(optionsParamName))
          .spread(queryOptionsParamName),
      )
      .return(),
  );

  const statement = $.const(symbolUseQueryFn)
    .export()
    .$if(plugin.config.comments && createOperationComment(operation), (c, v) => c.doc(v))
    .assign(func);
  plugin.node(statement);
}
