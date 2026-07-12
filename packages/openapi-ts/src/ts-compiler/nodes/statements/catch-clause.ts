import type { TsNodeBase } from '../base';
import type { TsVariableDeclaration } from '../declarations/variable-declaration';
import { TsNodeKind } from '../kinds';
import type { TsBlock } from './block';

export interface TsCatchClause extends TsNodeBase {
  block: TsBlock;
  kind: TsNodeKind.CatchClause;
  variableDeclaration?: TsVariableDeclaration;
}

export function createCatchClause(
  variableDeclaration: TsVariableDeclaration | undefined,
  block: TsBlock,
): TsCatchClause {
  return {
    block,
    kind: TsNodeKind.CatchClause,
    variableDeclaration,
  };
}
