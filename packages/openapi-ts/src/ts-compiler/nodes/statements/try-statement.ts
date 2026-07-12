import type { TsNodeBase } from '../base';
import { TsNodeKind } from '../kinds';
import type { TsBlock } from './block';
import type { TsCatchClause } from './catch-clause';

export interface TsTryStatement extends TsNodeBase {
  catchClause?: TsCatchClause;
  finallyBlock?: TsBlock;
  kind: TsNodeKind.TryStatement;
  tryBlock: TsBlock;
}

export function createTryStatement(
  tryBlock: TsBlock,
  catchClause: TsCatchClause | undefined,
  finallyBlock: TsBlock | undefined,
): TsTryStatement {
  return {
    catchClause,
    finallyBlock,
    kind: TsNodeKind.TryStatement,
    tryBlock,
  };
}
