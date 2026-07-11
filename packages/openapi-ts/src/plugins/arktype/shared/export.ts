import type { Symbol } from '@hey-api/codegen-core';
import type { IR } from '@hey-api/shared';

import { $ } from '../../../ts-dsl';
import { createSchemaComment } from '../../shared/utils/schema';
import { identifiers } from '../constants';
import type { ArktypePlugin } from '../types';
import type { Ast } from './types';

export function exportAst({
  ast,
  plugin,
  schema,
  symbol,
  typeInferSymbol,
}: {
  ast: Ast;
  plugin: ArktypePlugin['Instance'];
  schema: IR.SchemaObject;
  symbol: Symbol;
  typeInferSymbol: Symbol | undefined;
}): void {
  const statement = $.const(symbol)
    .export()
    .$if(plugin.config.comments && createSchemaComment(schema), (c, v) =>
      c.styledDoc(v, plugin.config.commentsStyle),
    )
    // .type(
    //   ast.typeName
    //     ? (tsc.propertyAccessExpression({
    //         expression: z,
    //         name: ast.typeName,
    //       }) as unknown as ts.TypeNode)
    //     : undefined,
    // )
    .assign($(plugin.imports.type).call(ast.def ? $.literal(ast.def) : ast.expression));
  plugin.node(statement);

  if (typeInferSymbol) {
    const inferType = $.type
      .alias(typeInferSymbol)
      .export()
      .type($.type(symbol).attr(identifiers.type.infer).typeofType());
    plugin.node(inferType);
  }
}
