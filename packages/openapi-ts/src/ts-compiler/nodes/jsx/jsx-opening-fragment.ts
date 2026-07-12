import type { TsNodeBase } from '../base';
import { TsNodeKind } from '../kinds';

export interface TsJsxOpeningFragment extends TsNodeBase {
  kind: TsNodeKind.JsxOpeningFragment;
}

export function createJsxOpeningFragment(): TsJsxOpeningFragment {
  return {
    kind: TsNodeKind.JsxOpeningFragment,
  };
}
