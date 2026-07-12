import type { TsNodeBase } from '../base';
import type { TsExpression } from '../expression';
import { TsNodeKind } from '../kinds';
import type { SyntaxKind } from '../syntax-kind';

export interface TsPostfixUnaryExpression extends TsNodeBase {
  kind: TsNodeKind.PostfixUnaryExpression;
  operand: TsExpression;
  operator: SyntaxKind;
}

export function createPostfixUnaryExpression(
  operand: TsExpression,
  operator: SyntaxKind,
): TsPostfixUnaryExpression {
  return {
    kind: TsNodeKind.PostfixUnaryExpression,
    operand,
    operator,
  };
}
