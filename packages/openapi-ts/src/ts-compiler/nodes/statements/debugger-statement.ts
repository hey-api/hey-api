import type { TsNodeBase } from '../base';
import { TsNodeKind } from '../kinds';

export interface TsDebuggerStatement extends TsNodeBase {
  kind: TsNodeKind.DebuggerStatement;
}

export function createDebuggerStatement(): TsDebuggerStatement {
  return {
    kind: TsNodeKind.DebuggerStatement,
  };
}
