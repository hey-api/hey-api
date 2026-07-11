import type { Symbol } from '@hey-api/codegen-core';
import type { IR } from '@hey-api/shared';
import { applyNaming } from '@hey-api/shared';

import type { TsDsl } from '../../../../ts-dsl';
import { $ } from '../../../../ts-dsl';
import { createOperationComment, hasOperationSse } from '../../../shared/utils/operation';
import {
  createMutationKeyFunction,
  createMutationKeyType,
  mutationKeyStatement,
} from '../mutation-key';
import { handleMeta } from '../shared/meta';
import { useTypeData, useTypeError, useTypeResponse } from '../shared/use-type';
import type { PluginInstance } from '../types';

export function createMutationOptions({
  operation,
  plugin,
}: {
  operation: IR.OperationObject;
  plugin: PluginInstance;
}): void {
  if (hasOperationSse({ operation })) return;

  if (
    plugin.config.mutationKeys.enabled &&
    // TODO: contract (self)
    !plugin.querySymbol({
      artifact: plugin.name,
      category: 'utility',
      resource: 'createMutationKey',
    })
  ) {
    createMutationKeyType({ plugin });
    createMutationKeyFunction({ plugin });
  }

  const symbolMutationOptionsType = plugin.imports.MutationOptions;

  const typeData = useTypeData({ operation, plugin });
  const mutationType = $.type(symbolMutationOptionsType)
    .generic(useTypeResponse({ operation, plugin }))
    .generic(useTypeError({ operation, plugin }))
    .generic(typeData);

  const fnOptions = 'fnOptions';

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
      .call($.object().spread('options').spread(fnOptions).prop('throwOnError', $.literal(true)))
      .await(),
  );

  const statements: Array<TsDsl<any>> = [];
  if (plugin.getPluginOrThrow('@hey-api/sdk').config.responseStyle === 'data') {
    statements.push($.return(awaitSdkFn));
  } else {
    statements.push($.const().object('data').assign(awaitSdkFn), $.return('data'));
  }

  let symbolMutationKey: Symbol | undefined;
  if (plugin.config.mutationKeys.enabled) {
    symbolMutationKey = plugin.symbol(applyNaming(operation.id, plugin.config.mutationKeys));
    const node = mutationKeyStatement({
      operation,
      plugin,
      symbol: symbolMutationKey,
    });
    plugin.node(node);
  }

  const mutationOptionsFn = 'mutationOptions';
  const symbolMutationOptions = plugin.symbol(
    applyNaming(operation.id, plugin.config.mutationOptions),
    {
      meta: {
        category: 'hook',
        resource: 'operation',
        resourceId: operation.id,
        role: 'mutationOptions',
      },
    },
  );
  const statement = $.const(symbolMutationOptions)
    .export(plugin.config.mutationOptions.exported)
    .$if(plugin.config.comments && createOperationComment(operation), (c, v) =>
      c.styledDoc(v, plugin.config.commentsStyle),
    )
    .assign(
      $.func()
        .param('options', (p) => p.optional().type($.type('Partial').generic(typeData)))
        .returns(mutationType)
        .do(
          $.const(mutationOptionsFn)
            .type(mutationType)
            .assign(
              $.object()
                .pretty()
                .prop(
                  'mutationFn',
                  $.func()
                    .async()
                    .param(fnOptions)
                    .do(...statements),
                )
                .$if(symbolMutationKey, (c, v) => c.prop('mutationKey', $(v).call('options')))
                .$if(handleMeta(plugin, operation, 'mutationOptions'), (c, v) => c.prop('meta', v)),
            ),
          $(mutationOptionsFn).return(),
        ),
    );
  plugin.node(statement);
}
