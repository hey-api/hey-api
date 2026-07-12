import type { TsNodeBase } from '../base';
import { TsNodeKind } from '../kinds';

export interface TsNumericLiteral extends TsNodeBase {
  kind: TsNodeKind.NumericLiteral;
  text: string;
}

export function createNumericLiteral(value: number | string): TsNumericLiteral {
  return {
    kind: TsNodeKind.NumericLiteral,
    text: typeof value === 'number' ? String(value) : value,
  };
}
