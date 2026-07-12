import type { TsNodeBase } from '../base';
import { TsNodeKind } from '../kinds';
import type { TsModifierLike } from './modifier-like';
import type { TsVariableDeclarationList } from './variable-declaration-list';

export interface TsVariableStatement extends TsNodeBase {
  declarationList: TsVariableDeclarationList;
  kind: TsNodeKind.VariableStatement;
  modifiers?: ReadonlyArray<TsModifierLike>;
}

export function createVariableStatement(
  modifiers: ReadonlyArray<TsModifierLike> | undefined,
  declarationList: TsVariableDeclarationList,
): TsVariableStatement {
  return {
    declarationList,
    kind: TsNodeKind.VariableStatement,
    modifiers,
  };
}
