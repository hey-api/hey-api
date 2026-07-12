import type { TsNodeBase } from '../base';
import { TsNodeKind } from '../kinds';

export interface TsJsxText extends TsNodeBase {
  containsOnlyTriviaWhiteSpaces: boolean;
  kind: TsNodeKind.JsxText;
  text: string;
}

export function createJsxText(text: string, containsOnlyTriviaWhiteSpaces?: boolean): TsJsxText {
  return {
    containsOnlyTriviaWhiteSpaces: containsOnlyTriviaWhiteSpaces ?? false,
    kind: TsNodeKind.JsxText,
    text,
  };
}
