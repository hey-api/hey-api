import type { TsNodeBase } from '../base';
import type { TsExpression } from '../expression';
import { TsNodeKind } from '../kinds';
import type { TsCaseBlock } from './case-block';

export interface TsSwitchStatement extends TsNodeBase {
  caseBlock: TsCaseBlock;
  expression: TsExpression;
  kind: TsNodeKind.SwitchStatement;
}

export function createSwitchStatement(
  expression: TsExpression,
  caseBlock: TsCaseBlock,
): TsSwitchStatement {
  return {
    caseBlock,
    expression,
    kind: TsNodeKind.SwitchStatement,
  };
}
