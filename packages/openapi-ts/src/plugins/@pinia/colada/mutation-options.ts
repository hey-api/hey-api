import type { IR } from '@hey-api/shared';
import { applyNaming } from '@hey-api/shared';

import { getTypedConfig } from '../../../config/utils';
import { $ } from '../../../ts-dsl';
import { getClientPlugin } from '../../@hey-api/client-core/utils';
import { createOperationComment } from '../../shared/utils/operation';
import { handleMeta } from './meta';
import type { PiniaColadaPlugin } from './types';
import { useTypeError, useTypeResponse } from './use-type';
import { getPublicTypeData } from './utils';

export function createMutationOptions({
  operation,
  plugin,
}: {
  operation: IR.OperationObject;
  plugin: PiniaColadaPlugin['Instance'];
}): void {
  const client = getClientPlugin(getTypedConfig(plugin));
  const isNuxtClient = client.name === '@hey-api/client-nuxt';

  const typeData = getPublicTypeData({ isNuxtClient, operation, plugin });

  const options = plugin.symbol('options');
  const fnOptions = plugin.symbol('vars');

  const awaitSdkFn = $.lazy((ctx) =>
    ctx
      .access(
        // TODO: contract (?)
        plugin.referenceSymbol({
          category: 'sdk',
          resource: 'operation',
          resourceId: operation.id,
        }),
      )
      .call(
        $.object().pretty().spread(options).spread(fnOptions).prop('throwOnError', $.literal(true)),
      )
      .await(),
  );

  const statements: Array<ReturnType<typeof $.var | typeof $.return>> = [];

  if (plugin.getPluginOrThrow('@hey-api/sdk').config.responseStyle === 'data') {
    statements.push($.return(awaitSdkFn));
  } else {
    statements.push($.const().object('data').assign(awaitSdkFn), $.return('data'));
  }

  const mutationOpts = $.object()
    .pretty()
    .prop(
      'mutation',
      $.func()
        .async()
        .param(fnOptions, (p) =>
          p.$if(isNuxtClient, (f) => f.type($.type('Partial').generic(typeData))),
        )
        .do(...statements),
    )
    .$if(handleMeta(plugin, operation, 'mutationOptions'), (o, v) => o.prop('meta', v));
  const symbolMutationOptions = plugin.symbol(
    applyNaming(operation.id, plugin.config.mutationOptions),
  );
  const statement = $.const(symbolMutationOptions)
    .export()
    .$if(plugin.config.comments && createOperationComment(operation), (c, v) =>
      c.styledDoc(v, plugin.config.commentsStyle),
    )
    .assign(
      $.func()
        .param(options, (p) => p.optional().type($.type('Partial').generic(typeData)))
        .returns(
          $.type(plugin.imports.UseMutationOptions)
            .generic(useTypeResponse({ operation, plugin }))
            .generic(typeData)
            .generic(useTypeError({ operation, plugin })),
        )
        .do($.return(mutationOpts)),
    );
  plugin.node(statement);
}
