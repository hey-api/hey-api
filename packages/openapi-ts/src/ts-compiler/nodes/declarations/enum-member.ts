import type { TsNodeBase } from '../base';
import type { TsExpression } from '../expression';
import { TsNodeKind } from '../kinds';
import type { TsPropertyName } from '../property-name';

export interface TsEnumMember extends TsNodeBase {
  initializer?: TsExpression;
  kind: TsNodeKind.EnumMember;
  name: string | TsPropertyName;
}

export function createEnumMember(
  name: string | TsPropertyName,
  initializer?: TsExpression,
): TsEnumMember {
  return {
    initializer,
    kind: TsNodeKind.EnumMember,
    name,
  };
}
