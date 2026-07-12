import type { TsNodeBase } from '../base';
import { TsNodeKind } from '../kinds';
import type { TsPropertyName } from '../property-name';
import type { TsToken } from '../token';
import type { TsTypeNode } from '../type';

export interface TsPropertySignature extends TsNodeBase {
  kind: TsNodeKind.PropertySignature;
  modifiers?: ReadonlyArray<TsToken>;
  name: string | TsPropertyName;
  questionToken?: TsToken;
  type?: TsTypeNode;
}

export function createPropertySignature(
  modifiers: ReadonlyArray<TsToken> | undefined,
  name: string | TsPropertyName,
  questionToken: TsToken | undefined,
  type: TsTypeNode | undefined,
): TsPropertySignature {
  return {
    kind: TsNodeKind.PropertySignature,
    modifiers,
    name,
    questionToken,
    type,
  };
}
