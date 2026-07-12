import type { TsNodeBase } from '../base';
import { TsNodeKind } from '../kinds';

export interface TsRegularExpressionLiteral extends TsNodeBase {
  kind: TsNodeKind.RegularExpressionLiteral;
  text: string;
}

export function createRegularExpressionLiteral(text: string): TsRegularExpressionLiteral {
  return {
    kind: TsNodeKind.RegularExpressionLiteral,
    text,
  };
}
