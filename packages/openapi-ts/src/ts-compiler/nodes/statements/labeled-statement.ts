import type { TsNodeBase } from '../base';
import type { TsIdentifier } from '../expressions/identifier';
import { TsNodeKind } from '../kinds';
import type { TsStatement } from '../statement';

export interface TsLabeledStatement extends TsNodeBase {
  kind: TsNodeKind.LabeledStatement;
  label: TsIdentifier;
  statement: TsStatement;
}

export function createLabeledStatement(
  label: TsIdentifier,
  statement: TsStatement,
): TsLabeledStatement {
  return {
    kind: TsNodeKind.LabeledStatement,
    label,
    statement,
  };
}
