import type { TsNodeBase } from '../base';
import type { TsIdentifier } from '../expressions/identifier';
import { TsNodeKind } from '../kinds';
import type { TsToken } from '../token';
import type { TsTypeNode } from '../type';

export interface TsNamedTupleMember extends TsNodeBase {
  dotDotDotToken?: TsToken;
  kind: TsNodeKind.NamedTupleMember;
  name: string | TsIdentifier;
  questionToken?: TsToken;
  type: TsTypeNode;
}

export function createNamedTupleMember(
  dotDotDotToken: TsToken | undefined,
  name: string | TsIdentifier,
  questionToken: TsToken | undefined,
  type: TsTypeNode,
): TsNamedTupleMember {
  return {
    dotDotDotToken,
    kind: TsNodeKind.NamedTupleMember,
    name,
    questionToken,
    type,
  };
}
