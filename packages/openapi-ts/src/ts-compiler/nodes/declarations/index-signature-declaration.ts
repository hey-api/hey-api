import type { TsNodeBase } from '../base';
import { TsNodeKind } from '../kinds';
import type { TsToken } from '../token';
import type { TsTypeNode } from '../type';
import type { TsParameterDeclaration } from './parameter-declaration';

export interface TsIndexSignatureDeclaration extends TsNodeBase {
  kind: TsNodeKind.IndexSignature;
  modifiers?: ReadonlyArray<TsToken>;
  parameters: ReadonlyArray<TsParameterDeclaration>;
  type: TsTypeNode;
}

export function createIndexSignature(
  modifiers: ReadonlyArray<TsToken> | undefined,
  parameters: ReadonlyArray<TsParameterDeclaration>,
  type: TsTypeNode,
): TsIndexSignatureDeclaration {
  return {
    kind: TsNodeKind.IndexSignature,
    modifiers,
    parameters,
    type,
  };
}
