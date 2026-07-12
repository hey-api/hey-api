import type { TsNodeBase } from '../base';
import type { TsExpression } from '../expression';
import { TsNodeKind } from '../kinds';
import type { TsTypeNode } from '../type';

export interface TsNewExpression extends TsNodeBase {
  arguments?: ReadonlyArray<TsExpression>;
  expression: TsExpression;
  kind: TsNodeKind.NewExpression;
  typeArguments?: ReadonlyArray<TsTypeNode>;
}

export function createNewExpression(
  expression: TsExpression,
  typeArguments: ReadonlyArray<TsTypeNode> | undefined,
  argumentsArray: ReadonlyArray<TsExpression> | undefined,
): TsNewExpression {
  return {
    arguments: argumentsArray,
    expression,
    kind: TsNodeKind.NewExpression,
    typeArguments,
  };
}
