import type { TsNodeBase } from '../base';
import type { TsIdentifier } from '../expressions/identifier';
import { TsNodeKind } from '../kinds';
import type { TsToken } from '../token';
import type { TsTypeNode } from '../type';

export interface TsTypeParameterDeclaration extends TsNodeBase {
  constraint?: TsTypeNode;
  default?: TsTypeNode;
  kind: TsNodeKind.TypeParameter;
  modifiers?: ReadonlyArray<TsToken>;
  name: string | TsIdentifier;
}

export function createTypeParameterDeclaration(
  modifiers: ReadonlyArray<TsToken> | undefined,
  name: string | TsIdentifier,
  constraint?: TsTypeNode,
  defaultType?: TsTypeNode,
): TsTypeParameterDeclaration {
  return {
    constraint,
    default: defaultType,
    kind: TsNodeKind.TypeParameter,
    modifiers,
    name,
  };
}
