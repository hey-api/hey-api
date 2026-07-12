import type { TsNodeBase } from '../base';
import { TsNodeKind } from '../kinds';
import type { TsCaseClause } from './case-clause';
import type { TsDefaultClause } from './default-clause';

export interface TsCaseBlock extends TsNodeBase {
  clauses: ReadonlyArray<TsCaseClause | TsDefaultClause>;
  kind: TsNodeKind.CaseBlock;
}

export function createCaseBlock(
  clauses: ReadonlyArray<TsCaseClause | TsDefaultClause>,
): TsCaseBlock {
  return {
    clauses,
    kind: TsNodeKind.CaseBlock,
  };
}
