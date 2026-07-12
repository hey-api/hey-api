import type { TsNodeBase } from '../base';
import type { TsTemplateMiddle } from '../expressions/template-middle';
import type { TsTemplateTail } from '../expressions/template-tail';
import { TsNodeKind } from '../kinds';
import type { TsTypeNode } from '../type';

export interface TsTemplateLiteralTypeSpan extends TsNodeBase {
  kind: TsNodeKind.TemplateLiteralTypeSpan;
  literal: TsTemplateMiddle | TsTemplateTail;
  type: TsTypeNode;
}

export function createTemplateLiteralTypeSpan(
  type: TsTypeNode,
  literal: TsTemplateMiddle | TsTemplateTail,
): TsTemplateLiteralTypeSpan {
  return {
    kind: TsNodeKind.TemplateLiteralTypeSpan,
    literal,
    type,
  };
}
