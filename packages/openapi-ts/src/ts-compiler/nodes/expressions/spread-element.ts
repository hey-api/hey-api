import type { TsNodeBase } from '../base';
import type { TsExpression } from '../expression';
import { TsNodeKind } from '../kinds';

export interface TsSpreadElement extends TsNodeBase {
  expression: TsExpression;
  kind: TsNodeKind.SpreadElement;
}

export function createSpreadElement(expression: TsExpression): TsSpreadElement {
  return {
    expression,
    kind: TsNodeKind.SpreadElement,
  };
}
