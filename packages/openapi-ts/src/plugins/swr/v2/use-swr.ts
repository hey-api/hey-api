import type { IR } from '@hey-api/shared';
import { applyNaming } from '@hey-api/shared';

import type { TsDsl } from '../../../ts-dsl';
import { $ } from '../../../ts-dsl';
import { createOperationComment, hasOperationSse } from '../../shared/utils/operation';
import type { SwrPlugin } from '../types';

export function createUseSwr({
  operation,
  plugin,
}: {
  operation: IR.OperationObject;
  plugin: SwrPlugin['Instance'];
}): void {
  if (hasOperationSse({ operation })) {
    return;
  }

  const symbolUseQueryFn = plugin.symbol(applyNaming(operation.id, plugin.config.useSwr));

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
      .call($.object().prop('throwOnError', $.literal(true)))
      .await(),
  );

  const statements: Array<TsDsl<any>> = [];
  if (plugin.getPluginOrThrow('@hey-api/sdk').config.responseStyle === 'data') {
    statements.push($.return(awaitSdkFn));
  } else {
    statements.push($.const().object('data').assign(awaitSdkFn), $.return('data'));
  }

  const statement = $.const(symbolUseQueryFn)
    .export()
    .$if(plugin.config.comments && createOperationComment(operation), (c, v) =>
      c.styledDoc(v, plugin.config.commentsStyle),
    )
    .assign(
      $.func().do(
        $(plugin.imports.useSWR)
          .call(
            $.literal(operation.path),
            $.func()
              .async()
              .do(...statements),
          )
          .return(),
      ),
    );
  plugin.node(statement);
}
