import type { TsNodeBase } from '../base';
import type { TsIdentifier } from '../expressions/identifier';
import { TsNodeKind } from '../kinds';
import type { TsToken } from '../token';
import type { TsEnumMember } from './enum-member';

export interface TsEnumDeclaration extends TsNodeBase {
  kind: TsNodeKind.EnumDeclaration;
  members: ReadonlyArray<TsEnumMember>;
  modifiers?: ReadonlyArray<TsToken>;
  name: string | TsIdentifier;
}

export function createEnumDeclaration(
  modifiers: ReadonlyArray<TsToken> | undefined,
  name: string | TsIdentifier,
  members: ReadonlyArray<TsEnumMember>,
): TsEnumDeclaration {
  return {
    kind: TsNodeKind.EnumDeclaration,
    members,
    modifiers,
    name,
  };
}
