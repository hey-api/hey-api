import type { TsNodeBase } from '../base';
import type { TsExpression } from '../expression';
import { TsNodeKind } from '../kinds';
import type { TsToken } from '../token';

export interface TsJsxExpression extends TsNodeBase {
  dotDotDotToken?: TsToken;
  expression?: TsExpression;
  kind: TsNodeKind.JsxExpression;
}

export function createJsxExpression(
  dotDotDotToken: TsToken | undefined,
  expression: TsExpression | undefined,
): TsJsxExpression {
  return {
    dotDotDotToken,
    expression,
    kind: TsNodeKind.JsxExpression,
  };
}
