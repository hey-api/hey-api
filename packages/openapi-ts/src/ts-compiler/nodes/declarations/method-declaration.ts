import type { TsNodeBase } from '../base';
import { TsNodeKind } from '../kinds';
import type { TsPropertyName } from '../property-name';
import type { TsStatement } from '../statement';
import type { TsToken } from '../token';
import type { TsTypeNode } from '../type';
import type { TsModifierLike } from './modifier-like';
import type { TsParameterDeclaration } from './parameter-declaration';
import type { TsTypeParameterDeclaration } from './type-parameter-declaration';

export interface TsMethodDeclaration extends TsNodeBase {
  asteriskToken?: TsToken;
  body?: TsStatement;
  kind: TsNodeKind.MethodDeclaration;
  modifiers?: ReadonlyArray<TsModifierLike>;
  name: string | TsPropertyName;
  parameters: ReadonlyArray<TsParameterDeclaration>;
  questionToken?: TsToken;
  type?: TsTypeNode;
  typeParameters?: ReadonlyArray<TsTypeParameterDeclaration>;
}

export function createMethodDeclaration(
  modifiers: ReadonlyArray<TsModifierLike> | undefined,
  asteriskToken: TsToken | undefined,
  name: string | TsPropertyName,
  questionToken: TsToken | undefined,
  typeParameters: ReadonlyArray<TsTypeParameterDeclaration> | undefined,
  parameters: ReadonlyArray<TsParameterDeclaration>,
  type: TsTypeNode | undefined,
  body: TsStatement | undefined,
): TsMethodDeclaration {
  return {
    asteriskToken,
    body,
    kind: TsNodeKind.MethodDeclaration,
    modifiers,
    name,
    parameters,
    questionToken,
    type,
    typeParameters,
  };
}
