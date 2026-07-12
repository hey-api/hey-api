import type { TsNodeBase } from '../base';
import type { TsExpression } from '../expression';
import { TsNodeKind } from '../kinds';
import type { TsTypeNode } from '../type';

export interface TsCallExpression extends TsNodeBase {
  arguments: ReadonlyArray<TsExpression>;
  expression: TsExpression;
  kind: TsNodeKind.CallExpression;
  typeArguments?: ReadonlyArray<TsTypeNode>;
}

export function createCallExpression(
  expression: TsExpression,
  typeArguments: ReadonlyArray<TsTypeNode> | undefined,
  argumentsArray: ReadonlyArray<TsExpression> | undefined,
): TsCallExpression {
  return {
    arguments: argumentsArray ?? [],
    expression,
    kind: TsNodeKind.CallExpression,
    typeArguments,
  };
}
