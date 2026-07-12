import type { TsNodeBase } from '../base';
import type { TsParameterDeclaration } from '../declarations/parameter-declaration';
import type { TsTypeParameterDeclaration } from '../declarations/type-parameter-declaration';
import { TsNodeKind } from '../kinds';
import type { TsToken } from '../token';
import type { TsTypeNode } from '../type';

export interface TsConstructorTypeNode extends TsNodeBase {
  kind: TsNodeKind.ConstructorType;
  modifiers?: ReadonlyArray<TsToken>;
  parameters: ReadonlyArray<TsParameterDeclaration>;
  type: TsTypeNode;
  typeParameters?: ReadonlyArray<TsTypeParameterDeclaration>;
}

export function createConstructorTypeNode(
  modifiers: ReadonlyArray<TsToken> | undefined,
  typeParameters: ReadonlyArray<TsTypeParameterDeclaration> | undefined,
  parameters: ReadonlyArray<TsParameterDeclaration>,
  type: TsTypeNode,
): TsConstructorTypeNode {
  return {
    kind: TsNodeKind.ConstructorType,
    modifiers,
    parameters,
    type,
    typeParameters,
  };
}
