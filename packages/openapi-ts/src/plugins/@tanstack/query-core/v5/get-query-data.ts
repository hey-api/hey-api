import type { IR } from '@hey-api/shared';
import { applyNaming } from '@hey-api/shared';

import { $ } from '../../../../ts-dsl';
import {
  createOperationComment,
  hasOperationSse,
  isOperationOptionsRequired,
} from '../../../shared/utils/operation';
import { useTypeData, useTypeResponse } from '../shared/use-type';
import type { PluginInstance } from '../types';

export function createGetQueryData({
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

  // getQueryData reuses the queryOptions function to get the queryKey,
  // mirroring how setQueryData wraps queryOptions. This requires queryOptions
  // to also be enabled (referenceSymbol throws if it isn't).
  // TODO: contract (self)
  const symbolQueryOptionsFn = plugin.referenceSymbol({
    artifact: plugin.name,
    category: 'hook',
    resource: 'operation',
    resourceId: operation.id,
    role: 'queryOptions',
  });
  // TODO: contract (self)
  const symbolQueryClient = plugin.referenceSymbol({
    resource: `${plugin.name}.QueryClient`,
  });
  const typeData = useTypeData({ operation, plugin });
  const typeResponse = useTypeResponse({ operation, plugin });

  const symbolGetQueryData = plugin.symbol(applyNaming(operation.id, plugin.config.getQueryData), {
    meta: {
      category: 'hook',
      resource: 'operation',
      resourceId: operation.id,
      role: 'getQueryData',
    },
  });

  const queryClientParam = 'queryClient';
  const optionsParam = 'options';

  const optionsType = isRequiredOptions ? typeData : $.type.or(typeData, $.type('undefined'));

  const statement = $.const(symbolGetQueryData)
    .export()
    .$if(plugin.config.comments && createOperationComment(operation), (c, v) =>
      c.styledDoc(v, plugin.config.commentsStyle),
    )
    .assign(
      $.func()
        .param(queryClientParam, (p) => p.type($.type(symbolQueryClient)))
        .param(optionsParam, (p) => p.type(optionsType))
        .do(
          $(queryClientParam)
            .attr('getQueryData')
            .call($(symbolQueryOptionsFn).call(optionsParam).attr('queryKey'))
            .generic(typeResponse)
            .return(),
        ),
    );
  plugin.node(statement);
}
