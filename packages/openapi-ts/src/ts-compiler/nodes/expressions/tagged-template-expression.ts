import type { TsNodeBase } from '../base';
import type { TsExpression } from '../expression';
import { TsNodeKind } from '../kinds';
import type { TsTypeNode } from '../type';
import type { TsTemplateExpression } from './template-expression';

export interface TsTaggedTemplateExpression extends TsNodeBase {
  kind: TsNodeKind.TaggedTemplateExpression;
  tag: TsExpression;
  template: TsTemplateExpression;
  typeArguments?: ReadonlyArray<TsTypeNode>;
}

export function createTaggedTemplateExpression(
  tag: TsExpression,
  typeArguments: ReadonlyArray<TsTypeNode> | undefined,
  template: TsTemplateExpression,
): TsTaggedTemplateExpression {
  return {
    kind: TsNodeKind.TaggedTemplateExpression,
    tag,
    template,
    typeArguments,
  };
}
