import type { TsNodeBase } from '../base';
import { TsNodeKind } from '../kinds';

export interface TsNoSubstitutionTemplateLiteral extends TsNodeBase {
  kind: TsNodeKind.NoSubstitutionTemplateLiteral;
  rawText?: string;
  text: string;
}

export function createNoSubstitutionTemplateLiteral(
  text: string,
  rawText?: string,
): TsNoSubstitutionTemplateLiteral {
  return {
    kind: TsNodeKind.NoSubstitutionTemplateLiteral,
    rawText,
    text,
  };
}
