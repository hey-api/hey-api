import type { TsNodeBase } from './base';
import { TsNodeKind } from './kinds';
import type { SyntaxKind } from './syntax-kind';

export interface TsToken extends TsNodeBase {
  kind: TsNodeKind.Token;
  syntaxKind: SyntaxKind;
}

export function createToken(syntaxKind: SyntaxKind): TsToken {
  return {
    kind: TsNodeKind.Token,
    syntaxKind,
  };
}

export function createModifier(syntaxKind: SyntaxKind): TsToken {
  return createToken(syntaxKind);
}
