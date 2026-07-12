import type { TsNodeBase } from '../base';
import type { TsParameterDeclaration } from '../declarations/parameter-declaration';
import type { TsTypeParameterDeclaration } from '../declarations/type-parameter-declaration';
import { TsNodeKind } from '../kinds';
import type { TsBlock } from '../statements/block';
import type { TsToken } from '../token';
import type { TsTypeNode } from '../type';
import { createIdentifier, type TsIdentifier } from './identifier';

export interface TsFunctionExpression extends TsNodeBase {
  asteriskToken?: TsToken;
  body: TsBlock;
  kind: TsNodeKind.FunctionExpression;
  modifiers?: ReadonlyArray<TsToken>;
  name?: TsIdentifier;
  parameters: ReadonlyArray<TsParameterDeclaration>;
  type?: TsTypeNode;
  typeParameters?: ReadonlyArray<TsTypeParameterDeclaration>;
}

export function createFunctionExpression(
  modifiers: ReadonlyArray<TsToken> | undefined,
  asteriskToken: TsToken | undefined,
  name: string | TsIdentifier | undefined,
  typeParameters: ReadonlyArray<TsTypeParameterDeclaration> | undefined,
  parameters: ReadonlyArray<TsParameterDeclaration> | undefined,
  type: TsTypeNode | undefined,
  body: TsBlock,
): TsFunctionExpression {
  return {
    asteriskToken,
    body,
    kind: TsNodeKind.FunctionExpression,
    modifiers,
    name: typeof name === 'string' ? createIdentifier(name) : name,
    parameters: parameters ?? [],
    type,
    typeParameters,
  };
}
