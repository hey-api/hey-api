import type { TsNodeBase } from '../base';
import type { TsExpression } from '../expression';
import { TsNodeKind } from '../kinds';

export interface TsJsxClosingElement extends TsNodeBase {
  kind: TsNodeKind.JsxClosingElement;
  tagName: TsExpression;
}

export function createJsxClosingElement(tagName: TsExpression): TsJsxClosingElement {
  return {
    kind: TsNodeKind.JsxClosingElement,
    tagName,
  };
}
