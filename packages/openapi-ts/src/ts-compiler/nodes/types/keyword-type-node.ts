import type { TsNodeBase } from '../base';
import { TsNodeKind } from '../kinds';
import type { SyntaxKind } from '../syntax-kind';

export interface TsKeywordTypeNode extends TsNodeBase {
  kind: TsNodeKind.KeywordType;
  syntaxKind: SyntaxKind;
}

export function createKeywordTypeNode(kind: SyntaxKind): TsKeywordTypeNode {
  return {
    kind: TsNodeKind.KeywordType,
    syntaxKind: kind,
  };
}
