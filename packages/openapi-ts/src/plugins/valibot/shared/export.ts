import type { Symbol } from '@hey-api/codegen-core';
import { buildSymbolIn, pathToName } from '@hey-api/shared';

import { $ } from '../../../ts-dsl';
import { createSchemaComment } from '../../shared/utils/schema';
import { pipesToNode } from './pipes';
import type { ProcessorContext } from './processor';
import type { ValibotFinal } from './types';

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
  final: ValibotFinal;
}): Symbol {
  const name = pathToName(path, { anchor: namingAnchor });

  const symbol = plugin.symbol(
    buildSymbolIn({
      meta: {
        category: 'schema',
        path,
        tags,
        ...meta,
      },
      name,
      naming,
      path,
      plugin,
      schema,
    }),
  );
  const statement = $.const(symbol)
    .export()
    .$if(plugin.config.comments && createSchemaComment(schema), (c, v) =>
      c.styledDoc(v, plugin.config.commentsStyle),
    )
    .$if(final.typeName, (c) => c.type($.type(plugin.imports.v).attr(final.typeName!)))
    .assign(pipesToNode(final.pipes, plugin));
  plugin.node(statement);

  return symbol;
}
