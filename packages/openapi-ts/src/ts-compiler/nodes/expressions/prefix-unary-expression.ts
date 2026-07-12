import type { TsNodeBase } from '../base';
import type { TsExpression } from '../expression';
import { TsNodeKind } from '../kinds';
import type { SyntaxKind } from '../syntax-kind';

export interface TsPrefixUnaryExpression extends TsNodeBase {
  kind: TsNodeKind.PrefixUnaryExpression;
  operand: TsExpression;
  operator: SyntaxKind;
}

export function createPrefixUnaryExpression(
  operator: SyntaxKind,
  operand: TsExpression,
): TsPrefixUnaryExpression {
  return {
    kind: TsNodeKind.PrefixUnaryExpression,
    operand,
    operator,
  };
}
