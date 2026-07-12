import type { TsNodeBase } from '../base';
import type { TsExpression } from '../expression';
import { TsNodeKind } from '../kinds';
import type { TsPropertyName } from '../property-name';
import { createIdentifier } from './identifier';

export interface TsPropertyAssignment extends TsNodeBase {
  initializer: TsExpression;
  kind: TsNodeKind.PropertyAssignment;
  name: TsPropertyName;
}

export function createPropertyAssignment(
  name: string | TsPropertyName,
  initializer: TsExpression,
): TsPropertyAssignment {
  return {
    initializer,
    kind: TsNodeKind.PropertyAssignment,
    name: typeof name === 'string' ? createIdentifier(name) : name,
  };
}
