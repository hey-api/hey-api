import type { TsNodeBase } from '../base';
import { createIdentifier, type TsIdentifier } from '../expressions/identifier';
import { TsNodeKind } from '../kinds';
import type { TsStatement } from '../statement';
import type { TsToken } from '../token';
import type { TsTypeNode } from '../type';
import type { TsModifierLike } from './modifier-like';
import type { TsParameterDeclaration } from './parameter-declaration';
import type { TsTypeParameterDeclaration } from './type-parameter-declaration';

export interface TsFunctionDeclaration extends TsNodeBase {
  asteriskToken?: TsToken;
  body?: TsStatement;
  kind: TsNodeKind.FunctionDeclaration;
  modifiers?: ReadonlyArray<TsModifierLike>;
  name?: TsIdentifier;
  parameters: ReadonlyArray<TsParameterDeclaration>;
  type?: TsTypeNode;
  typeParameters?: ReadonlyArray<TsTypeParameterDeclaration>;
}

export function createFunctionDeclaration(
  modifiers: ReadonlyArray<TsModifierLike> | undefined,
  asteriskToken: TsToken | undefined,
  name: string | TsIdentifier | undefined,
  typeParameters: ReadonlyArray<TsTypeParameterDeclaration> | undefined,
  parameters: ReadonlyArray<TsParameterDeclaration>,
  type: TsTypeNode | undefined,
  body: TsStatement | undefined,
): TsFunctionDeclaration {
  return {
    asteriskToken,
    body,
    kind: TsNodeKind.FunctionDeclaration,
    modifiers,
    name: typeof name === 'string' ? createIdentifier(name) : name,
    parameters,
    type,
    typeParameters,
  };
}
