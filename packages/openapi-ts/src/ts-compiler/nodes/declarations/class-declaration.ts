import type { TsNodeBase } from '../base';
import type { TsIdentifier } from '../expressions/identifier';
import { TsNodeKind } from '../kinds';
import type { TsClassStaticBlockDeclaration } from './class-static-block-declaration';
import type { TsConstructorDeclaration } from './constructor-declaration';
import type { TsGetAccessorDeclaration } from './get-accessor-declaration';
import type { TsHeritageClause } from './heritage-clause';
import type { TsMethodDeclaration } from './method-declaration';
import type { TsModifierLike } from './modifier-like';
import type { TsPropertyDeclaration } from './property-declaration';
import type { TsSetAccessorDeclaration } from './set-accessor-declaration';
import type { TsTypeParameterDeclaration } from './type-parameter-declaration';

export type TsClassElement =
  | TsClassStaticBlockDeclaration
  | TsConstructorDeclaration
  | TsGetAccessorDeclaration
  | TsMethodDeclaration
  | TsPropertyDeclaration
  | TsSetAccessorDeclaration;

export interface TsClassDeclaration extends TsNodeBase {
  heritageClauses?: ReadonlyArray<TsHeritageClause>;
  kind: TsNodeKind.ClassDeclaration;
  members: ReadonlyArray<TsClassElement>;
  modifiers?: ReadonlyArray<TsModifierLike>;
  name?: string | TsIdentifier;
  typeParameters?: ReadonlyArray<TsTypeParameterDeclaration>;
}

export function createClassDeclaration(
  modifiers: ReadonlyArray<TsModifierLike> | undefined,
  name: string | TsIdentifier | undefined,
  typeParameters: ReadonlyArray<TsTypeParameterDeclaration> | undefined,
  heritageClauses: ReadonlyArray<TsHeritageClause> | undefined,
  members: ReadonlyArray<TsClassElement>,
): TsClassDeclaration {
  return {
    heritageClauses,
    kind: TsNodeKind.ClassDeclaration,
    members,
    modifiers,
    name,
    typeParameters,
  };
}
