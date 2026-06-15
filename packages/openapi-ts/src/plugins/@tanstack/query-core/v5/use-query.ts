import type { IR } from '@hey-api/shared';
import { applyNaming } from '@hey-api/shared';

import { $ } from '../../../../ts-dsl';
import {
  createOperationComment,
  hasOperationSse,
  isOperationOptionsRequired,
} from '../../../shared/utils/operation';
import { createUseQueryParamsType } from '../shared/use-query-params';
import type { PluginInstance } from '../types';

const optionsParamName = 'options';
const queryOptionsKey = 'queryOptions';
const sdkOptionsName = 'sdkOptions';

export function createUseQuery({
  operation,
  plugin,
}: {
  operation: IR.OperationObject;
  plugin: PluginInstance;
}): void {
  if (hasOperationSse({ operation })) return;

  if (!('useQuery' in plugin.config)) return;

  if (
    // TODO: contract (self)
    !plugin.querySymbol({
      artifact: plugin.name,
      category: 'utility',
      resource: 'UseQueryParams',
    })
  ) {
    createUseQueryParamsType({ plugin });
  }

  const symbolUseQueryFn = plugin.symbol(applyNaming(operation.id, plugin.config.useQuery));

  const isRequiredOptions = isOperationOptionsRequired({
    context: plugin.context,
    operation,
  });
  // TODO: contract (self)
  const symbolQueryOptionsFn = plugin.referenceSymbol({
    artifact: plugin.name,
    category: 'hook',
    resource: 'operation',
    resourceId: operation.id,
    role: 'queryOptions',
  });

  const symbolUseQueryParams = plugin.referenceSymbol({
    artifact: plugin.name,
    category: 'utility',
    resource: 'UseQueryParams',
  });

  const mergedParamType = $.type(symbolUseQueryParams).generic($.type.query(symbolQueryOptionsFn));

  const func = $.func().param(optionsParamName, (p) =>
    p.required(isRequiredOptions).type(mergedParamType),
  );

  func.do(
    $.const()
      .object(queryOptionsKey)
      .spread(sdkOptionsName)
      .assign(isRequiredOptions ? $(optionsParamName) : $(optionsParamName).coalesce($.object())),
    $(plugin.imports.useQuery)
      .call($.object().spread($(symbolQueryOptionsFn).call(sdkOptionsName)).spread(queryOptionsKey))
      .return(),
  );

  const statement = $.const(symbolUseQueryFn)
    .export()
    .$if(plugin.config.comments && createOperationComment(operation), (c, v) => c.doc(v))
    .assign(func);
  plugin.node(statement);
}
