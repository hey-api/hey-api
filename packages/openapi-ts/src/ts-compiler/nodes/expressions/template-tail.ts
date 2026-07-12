import type { TsNodeBase } from '../base';
import { TsNodeKind } from '../kinds';

export interface TsTemplateTail extends TsNodeBase {
  kind: TsNodeKind.TemplateTail;
  rawText?: string;
  text: string;
}

export function createTemplateTail(text: string, rawText?: string): TsTemplateTail {
  return {
    kind: TsNodeKind.TemplateTail,
    rawText,
    text,
  };
}
