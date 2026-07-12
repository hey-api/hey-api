import type { TsNodeBase } from '../base';
import type { TsParameterDeclaration } from '../declarations/parameter-declaration';
import type { TsTypeParameterDeclaration } from '../declarations/type-parameter-declaration';
import type { TsExpression } from '../expression';
import { TsNodeKind } from '../kinds';
import type { TsBlock } from '../statements/block';
import { SyntaxKind } from '../syntax-kind';
import { createToken, type TsToken } from '../token';
import type { TsTypeNode } from '../type';

export type TsConciseBody = TsBlock | TsExpression;

export interface TsArrowFunction extends TsNodeBase {
  body: TsConciseBody;
  equalsGreaterThanToken: TsToken;
  kind: TsNodeKind.ArrowFunction;
  modifiers?: ReadonlyArray<TsToken>;
  parameters: ReadonlyArray<TsParameterDeclaration>;
  type?: TsTypeNode;
  typeParameters?: ReadonlyArray<TsTypeParameterDeclaration>;
}

export function createArrowFunction(
  modifiers: ReadonlyArray<TsToken> | undefined,
  typeParameters: ReadonlyArray<TsTypeParameterDeclaration> | undefined,
  parameters: ReadonlyArray<TsParameterDeclaration>,
  type: TsTypeNode | undefined,
  equalsGreaterThanToken: TsToken | undefined,
  body: TsConciseBody,
): TsArrowFunction {
  return {
    body,
    equalsGreaterThanToken:
      equalsGreaterThanToken ?? createToken(SyntaxKind.EqualsGreaterThanToken),
    kind: TsNodeKind.ArrowFunction,
    modifiers,
    parameters,
    type,
    typeParameters,
  };
}
