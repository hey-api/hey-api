import type { TsNode, TsNodeBase } from '../base';
import { TsNodeKind } from '../kinds';
import type { TsJSDocText } from './jsdoc-text';

export type TsJSDocComment = TsJSDocText;

export interface TsJSDoc extends TsNodeBase {
  comment?: ReadonlyArray<TsJSDocComment> | string;
  kind: TsNodeKind.JSDoc;
  tags?: ReadonlyArray<TsNode>;
}

export function createJSDocComment(
  comment?: ReadonlyArray<TsJSDocComment> | string,
  tags?: ReadonlyArray<TsNode>,
): TsJSDoc {
  return {
    comment,
    kind: TsNodeKind.JSDoc,
    tags,
  };
}
