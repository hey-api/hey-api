import type { TsNodeBase } from '../base';
import type { TsExpression } from '../expression';
import { TsNodeKind } from '../kinds';
import type { TsToken } from '../token';
import type { TsTypeNode } from '../type';
import type { TsBindingName } from './binding-name';

export interface TsVariableDeclaration extends TsNodeBase {
  exclamationToken?: TsToken;
  initializer?: TsExpression;
  kind: TsNodeKind.VariableDeclaration;
  name: string | TsBindingName;
  type?: TsTypeNode;
}

export function createVariableDeclaration(
  name: string | TsBindingName,
  exclamationToken?: TsToken,
  type?: TsTypeNode,
  initializer?: TsExpression,
): TsVariableDeclaration {
  return {
    exclamationToken,
    initializer,
    kind: TsNodeKind.VariableDeclaration,
    name,
    type,
  };
}
