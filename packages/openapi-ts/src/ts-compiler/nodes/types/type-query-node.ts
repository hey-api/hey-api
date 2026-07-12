import type { TsNodeBase } from '../base';
import type { TsEntityName } from '../expressions/qualified-name';
import { TsNodeKind } from '../kinds';
import type { TsTypeNode } from '../type';

export interface TsTypeQueryNode extends TsNodeBase {
  exprName: TsEntityName;
  kind: TsNodeKind.TypeQuery;
  typeArguments?: ReadonlyArray<TsTypeNode>;
}

export function createTypeQueryNode(
  exprName: TsEntityName,
  typeArguments?: ReadonlyArray<TsTypeNode>,
): TsTypeQueryNode {
  return {
    exprName,
    kind: TsNodeKind.TypeQuery,
    typeArguments,
  };
}
