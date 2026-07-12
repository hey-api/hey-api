import type { TsNodeBase } from '../base';
import { TsNodeKind } from '../kinds';

export interface TsIdentifier extends TsNodeBase {
  kind: TsNodeKind.Identifier;
  text: string;
}

export function createIdentifier(text: string): TsIdentifier {
  return {
    kind: TsNodeKind.Identifier,
    text,
  };
}
