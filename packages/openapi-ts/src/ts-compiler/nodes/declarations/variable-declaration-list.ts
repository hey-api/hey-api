import type { TsNodeBase } from '../base';
import { TsNodeKind } from '../kinds';
import { TsNodeFlags } from '../node-flags';
import type { TsVariableDeclaration } from './variable-declaration';

export interface TsVariableDeclarationList extends TsNodeBase {
  declarations: ReadonlyArray<TsVariableDeclaration>;
  flags: TsNodeFlags;
  kind: TsNodeKind.VariableDeclarationList;
}

export function createVariableDeclarationList(
  declarations: ReadonlyArray<TsVariableDeclaration>,
  flags: TsNodeFlags = TsNodeFlags.None,
): TsVariableDeclarationList {
  return {
    declarations,
    flags,
    kind: TsNodeKind.VariableDeclarationList,
  };
}
