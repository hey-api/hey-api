import type { TsNodeBase } from '../base';
import type { TsExpression } from '../expression';
import { TsNodeKind } from '../kinds';
import { SyntaxKind } from '../syntax-kind';
import { createToken, type TsToken } from '../token';

export interface TsConditionalExpression extends TsNodeBase {
  colonToken: TsToken;
  condition: TsExpression;
  kind: TsNodeKind.ConditionalExpression;
  questionToken: TsToken;
  whenFalse: TsExpression;
  whenTrue: TsExpression;
}

export function createConditionalExpression(
  condition: TsExpression,
  questionToken: TsToken | undefined,
  whenTrue: TsExpression,
  colonToken: TsToken | undefined,
  whenFalse: TsExpression,
): TsConditionalExpression {
  return {
    colonToken: colonToken ?? createToken(SyntaxKind.ColonToken),
    condition,
    kind: TsNodeKind.ConditionalExpression,
    questionToken: questionToken ?? createToken(SyntaxKind.QuestionToken),
    whenFalse,
    whenTrue,
  };
}
