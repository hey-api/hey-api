import { buildSymbolIn, pathToName } from '@hey-api/shared';
import { pathToJsonPointer } from '@hey-api/shared';

import { $ } from '../../../../ts-dsl';
import { createSchemaComment } from '../../../shared/utils/schema';
import { exportEnumAst } from './enum';
import type { ProcessorContext } from './processor';
import type { TypeScriptFinal } from './types';

export function exportAst({
  final,
  meta,
  naming,
  namingAnchor,
  path,
  plugin,
  schema,
  tags,
}: Pick<
  ProcessorContext,
  'meta' | 'naming' | 'namingAnchor' | 'path' | 'plugin' | 'schema' | 'tags'
> & {
  final: TypeScriptFinal;
}): void {
  const $ref = meta.resourceId || pathToJsonPointer(path);
  const name = pathToName(path, { anchor: namingAnchor });

  if (
    exportEnumAst({
      enumData: final.enumData,
      name,
      plugin,
      resourceId: $ref,
      schema,
    })
  ) {
    return;
  }

  const symbol = plugin.symbol(
    buildSymbolIn({
      meta: {
        category: 'type',
        path,
        resource: 'definition',
        resourceId: $ref,
        tags,
      },
      name,
      naming,
      path,
      plugin,
      schema,
    }),
  );

  const node = $.type
    .alias(symbol)
    .export()
    .$if(plugin.config.comments && createSchemaComment(schema), (t, v) =>
      t.styledDoc(v, plugin.config.commentsStyle),
    )
    .type(final.type);
  plugin.node(node);
}
