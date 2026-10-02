import type { Symbol } from '@hey-api/codegen-core';
import { buildSymbolIn, pathToName } from '@hey-api/shared';

import { $ } from '../../../ts-dsl';
import { createSchemaComment } from '../../shared/utils/schema';
import { identifiers } from '../constants';
import type { ProcessorContext } from './processor';
import type { ZodFinal } from './types';

export function exportAst({
  final,
  meta,
  naming,
  namingAnchor,
  path,
  plugin,
  schema,
  tags,
}: Pick<ProcessorContext, 'naming' | 'namingAnchor' | 'path' | 'plugin' | 'schema' | 'tags'> & {
  final: ZodFinal;
  meta?: Record<string, unknown>;
}): Symbol {
  const z = plugin.imports.z;

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
    .$if(final.typeName, (c) => c.type($.type(z).attr(final.typeName!)))
    .assign(final.chain);
  plugin.node(statement);

  if (naming.types.infer.enabled) {
    const typeInferSymbol = plugin.symbol(
      buildSymbolIn({
        meta: {
          category: 'type',
          path,
          tags,
          variant: 'infer',
          ...meta,
        },
        name,
        naming: naming.types.infer,
        path,
        plugin,
        schema,
      }),
    );
    const inferType = $.type
      .alias(typeInferSymbol)
      .export()
      .type($.type(z).attr(identifiers.infer).generic($(symbol).typeofType()));
    plugin.node(inferType);
  }

  if (naming.types.input.enabled) {
    const typeInputSymbol = plugin.symbol(
      buildSymbolIn({
        meta: {
          category: 'type',
          path,
          tags,
          variant: 'input',
          ...meta,
        },
        name,
        naming: naming.types.input,
        path,
        plugin,
        schema,
      }),
    );
    const inputType = $.type
      .alias(typeInputSymbol)
      .export()
      .type($.type(z).attr(identifiers.input).generic($(symbol).typeofType()));
    plugin.node(inputType);
  }

  if (naming.types.output.enabled) {
    const typeOutputSymbol = plugin.symbol(
      buildSymbolIn({
        meta: {
          category: 'type',
          path,
          tags,
          variant: 'output',
          ...meta,
        },
        name,
        naming: naming.types.output,
        path,
        plugin,
        schema,
      }),
    );
    const outputType = $.type
      .alias(typeOutputSymbol)
      .export()
      .type($.type(z).attr(identifiers.output).generic($(symbol).typeofType()));
    plugin.node(outputType);
  }

  return symbol;
}
