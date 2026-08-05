import type { TsNodeBase } from '../base';
import type { TsIdentifier } from '../expressions/identifier';
import { TsNodeKind } from '../kinds';

export interface TsBreakStatement extends TsNodeBase {
  kind: TsNodeKind.BreakStatement;
  label?: TsIdentifier;
}

export function createBreakStatement(label?: TsIdentifier): TsBreakStatement {
  return {
    kind: TsNodeKind.BreakStatement,
    label,
  };
}
