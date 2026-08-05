import type { TsNode, TsNodeBase } from '../base';
import type { TsClassElement } from '../declarations/class-declaration';
import { TsNodeKind } from '../kinds';
import type { TsIdentifier } from './identifier';

export interface TsClassExpression extends TsNodeBase {
  heritageClauses?: ReadonlyArray<TsNode>;
  kind: TsNodeKind.ClassExpression;
  members: ReadonlyArray<TsClassElement>;
  modifiers?: ReadonlyArray<TsNode>;
  name?: TsIdentifier;
  typeParameters?: ReadonlyArray<TsNode>;
}

export function createClassExpression(
  modifiers: ReadonlyArray<TsNode> | undefined,
  name: TsIdentifier | undefined,
  typeParameters: ReadonlyArray<TsNode> | undefined,
  heritageClauses: ReadonlyArray<TsNode> | undefined,
  members: ReadonlyArray<TsClassElement>,
): TsClassExpression {
  return {
    heritageClauses,
    kind: TsNodeKind.ClassExpression,
    members,
    modifiers,
    name,
    typeParameters,
  };
}
