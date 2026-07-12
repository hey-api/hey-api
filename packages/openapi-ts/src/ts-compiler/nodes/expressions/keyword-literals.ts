import { SyntaxKind } from '../syntax-kind';
import { createToken, type TsToken } from '../token';

export function createFalse(): TsToken {
  return createToken(SyntaxKind.FalseKeyword);
}

export function createNull(): TsToken {
  return createToken(SyntaxKind.NullKeyword);
}

export function createTrue(): TsToken {
  return createToken(SyntaxKind.TrueKeyword);
}
