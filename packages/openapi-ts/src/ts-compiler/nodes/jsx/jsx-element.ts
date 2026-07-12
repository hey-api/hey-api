import type { TsNodeBase } from '../base';
import { TsNodeKind } from '../kinds';
import type { TsJsxClosingElement } from './jsx-closing-element';
import type { TsJsxExpression } from './jsx-expression';
import type { TsJsxFragment } from './jsx-fragment';
import type { TsJsxOpeningElement } from './jsx-opening-element';
import type { TsJsxSelfClosingElement } from './jsx-self-closing-element';
import type { TsJsxText } from './jsx-text';

export type TsJsxChild =
  | TsJsxElement
  | TsJsxExpression
  | TsJsxFragment
  | TsJsxSelfClosingElement
  | TsJsxText;

export interface TsJsxElement extends TsNodeBase {
  children: ReadonlyArray<TsJsxChild>;
  closingElement: TsJsxClosingElement;
  kind: TsNodeKind.JsxElement;
  openingElement: TsJsxOpeningElement;
}

export function createJsxElement(
  openingElement: TsJsxOpeningElement,
  children: ReadonlyArray<TsJsxChild>,
  closingElement: TsJsxClosingElement,
): TsJsxElement {
  return {
    children,
    closingElement,
    kind: TsNodeKind.JsxElement,
    openingElement,
  };
}
