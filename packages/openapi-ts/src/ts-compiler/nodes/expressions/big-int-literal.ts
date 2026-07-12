import type { TsNodeBase } from '../base';
import { TsNodeKind } from '../kinds';

export interface PseudoBigInt {
  base10Value: string;
  negative: boolean;
}

export interface TsBigIntLiteral extends TsNodeBase {
  kind: TsNodeKind.BigIntLiteral;
  text: string;
}

export function createBigIntLiteral(value: string | PseudoBigInt): TsBigIntLiteral {
  return {
    kind: TsNodeKind.BigIntLiteral,
    text: typeof value === 'string' ? value : `${value.negative ? '-' : ''}${value.base10Value}n`,
  };
}
