import type { TsNodeBase } from '../base';
import type { TsExpression } from '../expression';
import { TsNodeKind } from '../kinds';
import type { TsTypeNode } from '../type';

export interface TsExpressionWithTypeArguments extends TsNodeBase {
  expression: TsExpression;
  kind: TsNodeKind.ExpressionWithTypeArguments;
  typeArguments?: ReadonlyArray<TsTypeNode>;
}

export function createExpressionWithTypeArguments(
  expression: TsExpression,
  typeArguments: ReadonlyArray<TsTypeNode> | undefined,
): TsExpressionWithTypeArguments {
  return {
    expression,
    kind: TsNodeKind.ExpressionWithTypeArguments,
    typeArguments,
  };
}
