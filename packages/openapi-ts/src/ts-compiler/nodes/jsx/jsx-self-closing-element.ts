import type { TsNodeBase } from '../base';
import type { TsExpression } from '../expression';
import { TsNodeKind } from '../kinds';
import type { TsTypeNode } from '../type';
import type { TsJsxAttributes } from './jsx-attributes';

export interface TsJsxSelfClosingElement extends TsNodeBase {
  attributes: TsJsxAttributes;
  kind: TsNodeKind.JsxSelfClosingElement;
  tagName: TsExpression;
  typeArguments?: ReadonlyArray<TsTypeNode>;
}

export function createJsxSelfClosingElement(
  tagName: TsExpression,
  typeArguments: ReadonlyArray<TsTypeNode> | undefined,
  attributes: TsJsxAttributes,
): TsJsxSelfClosingElement {
  return {
    attributes,
    kind: TsNodeKind.JsxSelfClosingElement,
    tagName,
    typeArguments,
  };
}
