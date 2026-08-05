import type { TsNodeBase } from '../base';
import type { TsExpression } from '../expression';
import { TsNodeKind } from '../kinds';
import type { TsTypeNode } from '../type';
import type { TsJsxAttributes } from './jsx-attributes';

export interface TsJsxOpeningElement extends TsNodeBase {
  attributes: TsJsxAttributes;
  kind: TsNodeKind.JsxOpeningElement;
  tagName: TsExpression;
  typeArguments?: ReadonlyArray<TsTypeNode>;
}

export function createJsxOpeningElement(
  tagName: TsExpression,
  typeArguments: ReadonlyArray<TsTypeNode> | undefined,
  attributes: TsJsxAttributes,
): TsJsxOpeningElement {
  return {
    attributes,
    kind: TsNodeKind.JsxOpeningElement,
    tagName,
    typeArguments,
  };
}
