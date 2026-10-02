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

export function createUseGetQueryData({
  operation,
  plugin,
}: {
  operation: IR.OperationObject;
  plugin: PluginInstance;
}): void {
  if (hasOperationSse({ operation })) return;

  if (!('useGetQueryData' in plugin.config)) return;

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

  const symbolUseGetQueryData = plugin.symbol(
    applyNaming(operation.id, plugin.config.useGetQueryData),
    {
      meta: {
        category: 'hook',
        resource: 'operation',
        resourceId: operation.id,
        role: 'useGetQueryData',
      },
    },
  );

  const queryClientVar = 'queryClient';
  const optionsParam = 'options';

  const optionsType = isRequiredOptions ? typeData : $.type.or(typeData, $.type('undefined'));

  const statement = $.const(symbolUseGetQueryData)
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
            .do(
              $(queryClientVar)
                .attr('getQueryData')
                .call($(symbolQueryOptionsFn).call(optionsParam).attr('queryKey'))
                .generic(typeResponse)
                .return(),
            ),
        ),
      ),
    );
  plugin.node(statement);
}
