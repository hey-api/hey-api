import type { TsNodeBase } from '../base';
import type { TsExpression } from '../expression';
import { TsNodeKind } from '../kinds';
import type { TsStatement } from '../statement';

export interface TsCaseClause extends TsNodeBase {
  expression: TsExpression;
  kind: TsNodeKind.CaseClause;
  statements: ReadonlyArray<TsStatement>;
}

export function createCaseClause(
  expression: TsExpression,
  statements: ReadonlyArray<TsStatement>,
): TsCaseClause {
  return {
    expression,
    kind: TsNodeKind.CaseClause,
    statements,
  };
}
