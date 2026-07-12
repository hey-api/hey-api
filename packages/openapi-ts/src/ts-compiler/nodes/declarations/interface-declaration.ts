import type { TsNodeBase } from '../base';
import { TsNodeKind } from '../kinds';
import type { TsToken } from '../token';
import type { TsHeritageClause } from './heritage-clause';
import type { TsTypeElement } from './type-element';
import type { TsTypeParameterDeclaration } from './type-parameter-declaration';

export interface TsInterfaceDeclaration extends TsNodeBase {
  heritageClauses?: ReadonlyArray<TsHeritageClause>;
  kind: TsNodeKind.InterfaceDeclaration;
  members: ReadonlyArray<TsTypeElement>;
  modifiers?: ReadonlyArray<TsToken>;
  name: string;
  typeParameters?: ReadonlyArray<TsTypeParameterDeclaration>;
}

export function createInterfaceDeclaration(
  modifiers: ReadonlyArray<TsToken> | undefined,
  name: string,
  typeParameters: ReadonlyArray<TsTypeParameterDeclaration> | undefined,
  heritageClauses: ReadonlyArray<TsHeritageClause> | undefined,
  members: ReadonlyArray<TsTypeElement>,
): TsInterfaceDeclaration {
  return {
    heritageClauses,
    kind: TsNodeKind.InterfaceDeclaration,
    members,
    modifiers,
    name,
    typeParameters,
  };
}
