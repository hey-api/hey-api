import type { TsNodeBase } from '../base';
import type { TsTypeParameterDeclaration } from '../declarations/type-parameter-declaration';
import { TsNodeKind } from '../kinds';

export interface TsInferTypeNode extends TsNodeBase {
  kind: TsNodeKind.InferType;
  typeParameter: TsTypeParameterDeclaration;
}

export function createInferTypeNode(typeParameter: TsTypeParameterDeclaration): TsInferTypeNode {
  return {
    kind: TsNodeKind.InferType,
    typeParameter,
  };
}
