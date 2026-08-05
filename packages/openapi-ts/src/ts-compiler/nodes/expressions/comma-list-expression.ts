import type { TsNodeBase } from '../base';
import type { TsExpression } from '../expression';
import { TsNodeKind } from '../kinds';

export interface TsCommaListExpression extends TsNodeBase {
  elements: ReadonlyArray<TsExpression>;
  kind: TsNodeKind.CommaListExpression;
}

export function createCommaListExpression(
  elements: ReadonlyArray<TsExpression>,
): TsCommaListExpression {
  return {
    elements,
    kind: TsNodeKind.CommaListExpression,
  };
}
