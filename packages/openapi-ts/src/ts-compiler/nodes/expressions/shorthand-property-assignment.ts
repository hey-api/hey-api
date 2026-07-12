import type { TsNodeBase } from '../base';
import type { TsExpression } from '../expression';
import { TsNodeKind } from '../kinds';
import type { TsToken } from '../token';
import { createIdentifier, type TsIdentifier } from './identifier';

export interface TsShorthandPropertyAssignment extends TsNodeBase {
  equalsToken?: TsToken;
  kind: TsNodeKind.ShorthandPropertyAssignment;
  name: TsIdentifier;
  objectAssignmentInitializer?: TsExpression;
}

export function createShorthandPropertyAssignment(
  name: string | TsIdentifier,
  objectAssignmentInitializer?: TsExpression,
): TsShorthandPropertyAssignment {
  return {
    kind: TsNodeKind.ShorthandPropertyAssignment,
    name: typeof name === 'string' ? createIdentifier(name) : name,
    objectAssignmentInitializer,
  };
}
