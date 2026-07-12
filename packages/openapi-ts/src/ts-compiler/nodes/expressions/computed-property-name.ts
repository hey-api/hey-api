import type { TsNodeBase } from '../base';
import type { TsExpression } from '../expression';
import { TsNodeKind } from '../kinds';

export interface TsComputedPropertyName extends TsNodeBase {
  expression: TsExpression;
  kind: TsNodeKind.ComputedPropertyName;
}

export function createComputedPropertyName(expression: TsExpression): TsComputedPropertyName {
  return {
    expression,
    kind: TsNodeKind.ComputedPropertyName,
  };
}
