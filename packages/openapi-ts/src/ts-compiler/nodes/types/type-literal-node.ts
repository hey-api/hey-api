import type { TsNodeBase } from '../base';
import type { TsTypeElement } from '../declarations/type-element';
import { TsNodeKind } from '../kinds';

export interface TsTypeLiteralNode extends TsNodeBase {
  kind: TsNodeKind.TypeLiteral;
  members: ReadonlyArray<TsTypeElement>;
}

export function createTypeLiteralNode(
  members: ReadonlyArray<TsTypeElement> | undefined,
): TsTypeLiteralNode {
  return {
    kind: TsNodeKind.TypeLiteral,
    members: members ?? [],
  };
}
