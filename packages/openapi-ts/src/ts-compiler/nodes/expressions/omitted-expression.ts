import type { TsNodeBase } from '../base';
import { TsNodeKind } from '../kinds';

export interface TsOmittedExpression extends TsNodeBase {
  kind: TsNodeKind.OmittedExpression;
}

export function createOmittedExpression(): TsOmittedExpression {
  return {
    kind: TsNodeKind.OmittedExpression,
  };
}
