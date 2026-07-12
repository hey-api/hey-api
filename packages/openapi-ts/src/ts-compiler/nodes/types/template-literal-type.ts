import type { TsNodeBase } from '../base';
import type { TsTemplateHead } from '../expressions/template-head';
import { TsNodeKind } from '../kinds';
import type { TsTemplateLiteralTypeSpan } from './template-literal-type-span';

export interface TsTemplateLiteralType extends TsNodeBase {
  head: TsTemplateHead;
  kind: TsNodeKind.TemplateLiteralType;
  templateSpans: ReadonlyArray<TsTemplateLiteralTypeSpan>;
}

export function createTemplateLiteralType(
  head: TsTemplateHead,
  templateSpans: ReadonlyArray<TsTemplateLiteralTypeSpan>,
): TsTemplateLiteralType {
  return {
    head,
    kind: TsNodeKind.TemplateLiteralType,
    templateSpans,
  };
}
