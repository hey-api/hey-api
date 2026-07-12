import type { TsNodeBase } from '../base';
import { TsNodeKind } from '../kinds';

export interface TsPrivateIdentifier extends TsNodeBase {
  kind: TsNodeKind.PrivateIdentifier;
  text: string;
}

export function createPrivateIdentifier(text: string): TsPrivateIdentifier {
  return {
    kind: TsNodeKind.PrivateIdentifier,
    text,
  };
}
