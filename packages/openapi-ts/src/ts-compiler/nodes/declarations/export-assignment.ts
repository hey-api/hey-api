import type { TsNode, TsNodeBase } from '../base';
import type { TsExpression } from '../expression';
import { TsNodeKind } from '../kinds';

export interface TsExportAssignment extends TsNodeBase {
  expression: TsExpression;
  isExportEquals: boolean;
  kind: TsNodeKind.ExportAssignment;
  modifiers?: ReadonlyArray<TsNode>;
}

export function createExportAssignment(
  modifiers: ReadonlyArray<TsNode> | undefined,
  isExportEquals: boolean,
  expression: TsExpression,
): TsExportAssignment {
  return {
    expression,
    isExportEquals,
    kind: TsNodeKind.ExportAssignment,
    modifiers,
  };
}
