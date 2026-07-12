import type { TsNodeBase } from '../base';
import { TsNodeKind } from '../kinds';
import type { TsJsxClosingFragment } from './jsx-closing-fragment';
import type { TsJsxChild } from './jsx-element';
import type { TsJsxOpeningFragment } from './jsx-opening-fragment';

export interface TsJsxFragment extends TsNodeBase {
  children: ReadonlyArray<TsJsxChild>;
  closingFragment: TsJsxClosingFragment;
  kind: TsNodeKind.JsxFragment;
  openingFragment: TsJsxOpeningFragment;
}

export function createJsxFragment(
  openingFragment: TsJsxOpeningFragment,
  children: ReadonlyArray<TsJsxChild>,
  closingFragment: TsJsxClosingFragment,
): TsJsxFragment {
  return {
    children,
    closingFragment,
    kind: TsNodeKind.JsxFragment,
    openingFragment,
  };
}
