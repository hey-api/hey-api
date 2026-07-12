import type { TsNodeBase } from '../base';
import type { TsExpression } from '../expression';
import { TsNodeKind } from '../kinds';

export interface TsArrayLiteralExpression extends TsNodeBase {
  elements: ReadonlyArray<TsExpression>;
  kind: TsNodeKind.ArrayLiteralExpression;
  multiLine?: boolean;
}

export function createArrayLiteralExpression(
  elements?: ReadonlyArray<TsExpression>,
  multiLine?: boolean,
): TsArrayLiteralExpression {
  return {
    elements: elements ?? [],
    kind: TsNodeKind.ArrayLiteralExpression,
    multiLine,
  };
}
