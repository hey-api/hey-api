import type { TsNodeBase } from '../base';
import { TsNodeKind } from '../kinds';

export interface TsJSDocText extends TsNodeBase {
  kind: TsNodeKind.JSDocText;
  text: string;
}

export function createJSDocText(text: string): TsJSDocText {
  return {
    kind: TsNodeKind.JSDocText,
    text,
  };
}
