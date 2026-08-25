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

export function createSetQueryData({
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

  // setQueryData reuses the queryOptions function to get the queryKey,
  // mirroring how useQuery wraps queryOptions. This requires queryOptions
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

  // updater: TResponse | undefined | ((old: TResponse | undefined) => TResponse | undefined)
  const responseOrUndefined = $.type.or(typeResponse, $.type('undefined'));
  const updaterType = $.type.or(
    typeResponse,
    $.type('undefined'),
    $.type
      .func()
      .param('old', (p) => p.type(responseOrUndefined))
      .returns(responseOrUndefined),
  );

  const symbolSetQueryData = plugin.symbol(applyNaming(operation.id, plugin.config.setQueryData), {
    meta: {
      category: 'hook',
      resource: 'operation',
      resourceId: operation.id,
      role: 'setQueryData',
    },
  });

  const queryClientParam = 'queryClient';
  const optionsParam = 'options';
  const updaterParam = 'updater';

  const optionsType = isRequiredOptions ? typeData : $.type.or(typeData, $.type('undefined'));

  const statement = $.const(symbolSetQueryData)
    .export()
    .$if(plugin.config.comments && createOperationComment(operation), (c, v) =>
      c.styledDoc(v, plugin.config.commentsStyle),
    )
    .assign(
      $.func()
        .param(queryClientParam, (p) => p.type($.type(symbolQueryClient)))
        .param(optionsParam, (p) => p.type(optionsType))
        .param(updaterParam, (p) => p.type(updaterType))
        .do(
          $(queryClientParam)
            .attr('setQueryData')
            .call($(symbolQueryOptionsFn).call(optionsParam).attr('queryKey'), $(updaterParam))
            .return(),
        ),
    );
  plugin.node(statement);
}
