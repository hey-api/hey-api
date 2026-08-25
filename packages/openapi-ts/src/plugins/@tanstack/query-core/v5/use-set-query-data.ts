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

export function createUseSetQueryData({
  operation,
  plugin,
}: {
  operation: IR.OperationObject;
  plugin: PluginInstance;
}): void {
  if (hasOperationSse({ operation })) return;

  if (!('useSetQueryData' in plugin.config)) return;

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

  const symbolUseSetQueryData = plugin.symbol(
    applyNaming(operation.id, plugin.config.useSetQueryData),
    {
      meta: {
        category: 'hook',
        resource: 'operation',
        resourceId: operation.id,
        role: 'useSetQueryData',
      },
    },
  );

  const queryClientVar = 'queryClient';
  const optionsParam = 'options';
  const updaterParam = 'updater';

  const optionsType = isRequiredOptions ? typeData : $.type.or(typeData, $.type('undefined'));

  const statement = $.const(symbolUseSetQueryData)
    .export()
    .$if(plugin.config.comments && createOperationComment(operation), (c, v) =>
      c.styledDoc(v, plugin.config.commentsStyle),
    )
    .assign(
      $.func().do(
        $.const(queryClientVar).assign($(plugin.imports.useQueryClient).call()),
        $.return(
          $.func()
            .param(optionsParam, (p) => p.type(optionsType))
            .param(updaterParam, (p) => p.type(updaterType))
            .do(
              $(queryClientVar)
                .attr('setQueryData')
                .call($(symbolQueryOptionsFn).call(optionsParam).attr('queryKey'), $(updaterParam))
                .return(),
            ),
        ),
      ),
    );
  plugin.node(statement);
}
