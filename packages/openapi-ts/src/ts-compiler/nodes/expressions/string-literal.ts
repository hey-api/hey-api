import type { TsNodeBase } from '../base';
import { TsNodeKind } from '../kinds';

export interface TsStringLiteral extends TsNodeBase {
  isSingleQuote?: boolean;
  kind: TsNodeKind.StringLiteral;
  text: string;
}

export function createStringLiteral(text: string, isSingleQuote?: boolean): TsStringLiteral {
  return {
    isSingleQuote,
    kind: TsNodeKind.StringLiteral,
    text,
  };
}
