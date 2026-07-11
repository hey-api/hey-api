import type { IR } from '@hey-api/shared';
import { applyNaming } from '@hey-api/shared';

import { $ } from '../../../../ts-dsl';
import { createOperationComment } from '../../../shared/utils/operation';
import { useTypeData, useTypeError, useTypeResponse } from '../shared/use-type';
import type { PluginInstance } from '../types';

const mutationOptionsParamName = 'mutationOptions';

export function createUseMutation({
  operation,
  plugin,
}: {
  operation: IR.OperationObject;
  plugin: PluginInstance;
}): void {
  if (!('useMutation' in plugin.config)) return;

  const symbolUseMutationFn = plugin.symbol(applyNaming(operation.id, plugin.config.useMutation));

  const typeData = useTypeData({ operation, plugin });

  const mutationType = $.type(plugin.imports.MutationOptions)
    .generic(useTypeResponse({ operation, plugin }))
    .generic(useTypeError({ operation, plugin }))
    .generic(typeData);
  // TODO: contract (self)
  const symbolMutationOptionsFn = plugin.referenceSymbol({
    artifact: plugin.name,
    category: 'hook',
    resource: 'operation',
    resourceId: operation.id,
    role: 'mutationOptions',
  });

  const func = $.func().param(mutationOptionsParamName, (p) =>
    p
      .optional()
      .type(
        $.type('Partial').generic(
          $.type('Omit', (t) => t.generics(mutationType, $.type.literal('mutationFn'))),
        ),
      ),
  );

  func.do(
    $(plugin.imports.useMutation)
      .call($.object().spread($(symbolMutationOptionsFn).call()).spread(mutationOptionsParamName))
      .return(),
  );

  const statement = $.const(symbolUseMutationFn)
    .export()
    .$if(plugin.config.comments && createOperationComment(operation), (c, v) =>
      c.styledDoc(v, plugin.config.commentsStyle),
    )
    .assign(func);
  plugin.node(statement);
}
