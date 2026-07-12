import type { TsNodeBase } from '../base';
import type { TsExpression } from '../expression';
import { TsNodeKind } from '../kinds';

export interface TsDecorator extends TsNodeBase {
  expression: TsExpression;
  kind: TsNodeKind.Decorator;
}

export function createDecorator(expression: TsExpression): TsDecorator {
  return {
    expression,
    kind: TsNodeKind.Decorator,
  };
}
