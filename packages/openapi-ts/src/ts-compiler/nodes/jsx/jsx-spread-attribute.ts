import type { TsNodeBase } from '../base';
import type { TsExpression } from '../expression';
import { TsNodeKind } from '../kinds';

export interface TsJsxSpreadAttribute extends TsNodeBase {
  expression: TsExpression;
  kind: TsNodeKind.JsxSpreadAttribute;
}

export function createJsxSpreadAttribute(expression: TsExpression): TsJsxSpreadAttribute {
  return {
    expression,
    kind: TsNodeKind.JsxSpreadAttribute,
  };
}
