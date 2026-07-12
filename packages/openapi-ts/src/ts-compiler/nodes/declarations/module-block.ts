import type { TsNodeBase } from '../base';
import { TsNodeKind } from '../kinds';
import type { TsStatement } from '../statement';

export interface TsModuleBlock extends TsNodeBase {
  kind: TsNodeKind.ModuleBlock;
  statements: ReadonlyArray<TsStatement>;
}

export function createModuleBlock(statements: ReadonlyArray<TsStatement>): TsModuleBlock {
  return {
    kind: TsNodeKind.ModuleBlock,
    statements,
  };
}
