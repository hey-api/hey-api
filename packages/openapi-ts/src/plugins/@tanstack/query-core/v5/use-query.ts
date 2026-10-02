import type { IR } from '@hey-api/shared';
import { applyNaming } from '@hey-api/shared';

import { $ } from '../../../../ts-dsl';
import {
  createOperationComment,
  hasOperationSse,
  isOperationOptionsRequired,
} from '../../../shared/utils/operation';
import { useTypeData } from '../shared/use-type';
import type { PluginInstance } from '../types';

const optionsParamName = 'options';

export function createUseQuery({
  operation,
  plugin,
}: {
  operation: IR.OperationObject;
  plugin: PluginInstance;
}): void {
  if (hasOperationSse({ operation })) return;

  if (!('useQuery' in plugin.config)) return;

  const symbolUseQueryFn = plugin.symbol(applyNaming(operation.id, plugin.config.useQuery));

  const symbolSkipToken = $(plugin.imports.skipToken);

  const isRequiredOptions = isOperationOptionsRequired({
    context: plugin.context,
    operation,
  });
  const typeData = useTypeData({ operation, plugin });
  const sdkParamType = $.type.or(typeData, $.type.query(symbolSkipToken));
  // TODO: contract (self)
  const symbolQueryOptionsFn = plugin.referenceSymbol({
    artifact: plugin.name,
    category: 'hook',
    resource: 'operation',
    resourceId: operation.id,
    role: 'queryOptions',
  });
  const statement = $.const(symbolUseQueryFn)
    .export()
    .$if(plugin.config.comments && createOperationComment(operation), (c, v) => c.doc(v))
    .assign(
      $.func()
        .param(optionsParamName, (p) => p.required(isRequiredOptions).type(sdkParamType))
        .do(
          $(plugin.imports.useQuery).call($(symbolQueryOptionsFn).call(optionsParamName)).return(),
        ),
    );
  plugin.node(statement);
}
