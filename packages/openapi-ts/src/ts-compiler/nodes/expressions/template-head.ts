import type { TsNodeBase } from '../base';
import { TsNodeKind } from '../kinds';

export interface TsTemplateHead extends TsNodeBase {
  kind: TsNodeKind.TemplateHead;
  rawText?: string;
  text: string;
}

export function createTemplateHead(text: string, rawText?: string): TsTemplateHead {
  return {
    kind: TsNodeKind.TemplateHead,
    rawText,
    text,
  };
}
