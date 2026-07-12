import type { TsNodeBase } from '../base';
import type { TsIdentifier } from '../expressions/identifier';
import { TsNodeKind } from '../kinds';

export interface TsContinueStatement extends TsNodeBase {
  kind: TsNodeKind.ContinueStatement;
  label?: TsIdentifier;
}

export function createContinueStatement(label?: TsIdentifier): TsContinueStatement {
  return {
    kind: TsNodeKind.ContinueStatement,
    label,
  };
}
