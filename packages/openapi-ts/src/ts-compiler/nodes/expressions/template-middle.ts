import type { TsNodeBase } from '../base';
import { TsNodeKind } from '../kinds';

export interface TsTemplateMiddle extends TsNodeBase {
  kind: TsNodeKind.TemplateMiddle;
  rawText?: string;
  text: string;
}

export function createTemplateMiddle(text: string, rawText?: string): TsTemplateMiddle {
  return {
    kind: TsNodeKind.TemplateMiddle,
    rawText,
    text,
  };
}
