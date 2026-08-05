import type { TsNodeBase } from '../base';
import { TsNodeKind } from '../kinds';

export interface TsJsxClosingFragment extends TsNodeBase {
  kind: TsNodeKind.JsxClosingFragment;
}

export function createJsxClosingFragment(): TsJsxClosingFragment {
  return {
    kind: TsNodeKind.JsxClosingFragment,
  };
}
