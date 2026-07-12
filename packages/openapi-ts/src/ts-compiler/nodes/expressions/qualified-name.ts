import type { TsNodeBase } from '../base';
import { TsNodeKind } from '../kinds';
import { createIdentifier, type TsIdentifier } from './identifier';

export type TsEntityName = TsIdentifier | TsQualifiedName;

export interface TsQualifiedName extends TsNodeBase {
  kind: TsNodeKind.QualifiedName;
  left: TsEntityName;
  right: TsIdentifier;
}

export function createQualifiedName(
  left: TsEntityName,
  right: string | TsIdentifier,
): TsQualifiedName {
  return {
    kind: TsNodeKind.QualifiedName,
    left,
    right: typeof right === 'string' ? createIdentifier(right) : right,
  };
}
