import type { TsNodeBase } from '../base';
import type { TsExpression } from '../expression';
import { TsNodeKind } from '../kinds';
import type { SyntaxKind } from '../syntax-kind';
import { createToken, type TsToken } from '../token';

export interface TsBinaryExpression extends TsNodeBase {
  kind: TsNodeKind.BinaryExpression;
  left: TsExpression;
  operatorToken: TsToken;
  right: TsExpression;
}

export function createBinaryExpression(
  left: TsExpression,
  operator: SyntaxKind | TsToken,
  right: TsExpression,
): TsBinaryExpression {
  return {
    kind: TsNodeKind.BinaryExpression,
    left,
    operatorToken: typeof operator === 'object' ? operator : createToken(operator),
    right,
  };
}
