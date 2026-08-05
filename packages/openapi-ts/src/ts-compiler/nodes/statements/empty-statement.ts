import type { TsNodeBase } from '../base';
import { TsNodeKind } from '../kinds';

export interface TsEmptyStatement extends TsNodeBase {
  kind: TsNodeKind.EmptyStatement;
}

export function createEmptyStatement(): TsEmptyStatement {
  return {
    kind: TsNodeKind.EmptyStatement,
  };
}
