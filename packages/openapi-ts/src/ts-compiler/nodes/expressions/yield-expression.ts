import type { TsNodeBase } from '../base';
import type { TsExpression } from '../expression';
import { TsNodeKind } from '../kinds';
import type { TsToken } from '../token';

export interface TsYieldExpression extends TsNodeBase {
  asteriskToken?: TsToken;
  expression?: TsExpression;
  kind: TsNodeKind.YieldExpression;
}

export function createYieldExpression(
  asteriskToken: TsToken | undefined,
  expression: TsExpression | undefined,
): TsYieldExpression {
  return {
    asteriskToken,
    expression,
    kind: TsNodeKind.YieldExpression,
  };
}
