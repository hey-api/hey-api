import type { TsNodeBase } from '../base';
import type { TsExpression } from '../expression';
import { TsNodeKind } from '../kinds';

export interface TsExternalModuleReference extends TsNodeBase {
  expression: TsExpression;
  kind: TsNodeKind.ExternalModuleReference;
}

export function createExternalModuleReference(expression: TsExpression): TsExternalModuleReference {
  return {
    expression,
    kind: TsNodeKind.ExternalModuleReference,
  };
}
