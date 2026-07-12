import type { TsNodeBase } from '../base';
import { TsNodeKind } from '../kinds';
import type { TsStatement } from '../statement';

export interface TsBlock extends TsNodeBase {
  kind: TsNodeKind.Block;
  multiLine?: boolean;
  statements: ReadonlyArray<TsStatement>;
}

export function createBlock(statements: ReadonlyArray<TsStatement>, multiLine?: boolean): TsBlock {
  return {
    kind: TsNodeKind.Block,
    multiLine,
    statements,
  };
}
