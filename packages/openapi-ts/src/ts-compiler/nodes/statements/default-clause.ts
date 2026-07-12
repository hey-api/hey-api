import type { TsNodeBase } from '../base';
import { TsNodeKind } from '../kinds';
import type { TsStatement } from '../statement';

export interface TsDefaultClause extends TsNodeBase {
  kind: TsNodeKind.DefaultClause;
  statements: ReadonlyArray<TsStatement>;
}

export function createDefaultClause(statements: ReadonlyArray<TsStatement>): TsDefaultClause {
  return {
    kind: TsNodeKind.DefaultClause,
    statements,
  };
}
