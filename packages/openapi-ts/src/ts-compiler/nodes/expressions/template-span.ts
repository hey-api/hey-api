import type { TsNodeBase } from '../base';
import type { TsExpression } from '../expression';
import { TsNodeKind } from '../kinds';
import type { TsTemplateMiddle } from './template-middle';
import type { TsTemplateTail } from './template-tail';

export interface TsTemplateSpan extends TsNodeBase {
  expression: TsExpression;
  kind: TsNodeKind.TemplateSpan;
  literal: TsTemplateMiddle | TsTemplateTail;
}

export function createTemplateSpan(
  expression: TsExpression,
  literal: TsTemplateMiddle | TsTemplateTail,
): TsTemplateSpan {
  return {
    expression,
    kind: TsNodeKind.TemplateSpan,
    literal,
  };
}
