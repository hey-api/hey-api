import type { TsNodeBase } from '../base';
import { TsNodeKind } from '../kinds';
import type { TsTemplateHead } from './template-head';
import type { TsTemplateSpan } from './template-span';

export interface TsTemplateExpression extends TsNodeBase {
  head: TsTemplateHead;
  kind: TsNodeKind.TemplateExpression;
  templateSpans: ReadonlyArray<TsTemplateSpan>;
}

export function createTemplateExpression(
  head: TsTemplateHead,
  templateSpans: ReadonlyArray<TsTemplateSpan>,
): TsTemplateExpression {
  return {
    head,
    kind: TsNodeKind.TemplateExpression,
    templateSpans,
  };
}
