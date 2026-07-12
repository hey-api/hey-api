import type { TsNodeBase } from '../base';
import type { TsParameterDeclaration } from '../declarations/parameter-declaration';
import type { TsTypeParameterDeclaration } from '../declarations/type-parameter-declaration';
import { TsNodeKind } from '../kinds';
import type { TsTypeNode } from '../type';

export interface TsFunctionTypeNode extends TsNodeBase {
  kind: TsNodeKind.FunctionType;
  parameters: ReadonlyArray<TsParameterDeclaration>;
  type: TsTypeNode;
  typeParameters?: ReadonlyArray<TsTypeParameterDeclaration>;
}

export function createFunctionTypeNode(
  typeParameters: ReadonlyArray<TsTypeParameterDeclaration> | undefined,
  parameters: ReadonlyArray<TsParameterDeclaration>,
  type: TsTypeNode,
): TsFunctionTypeNode {
  return {
    kind: TsNodeKind.FunctionType,
    parameters,
    type,
    typeParameters,
  };
}
