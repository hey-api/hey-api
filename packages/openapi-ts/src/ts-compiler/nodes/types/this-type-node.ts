import type { TsNodeBase } from '../base';
import { TsNodeKind } from '../kinds';

export interface TsThisTypeNode extends TsNodeBase {
  kind: TsNodeKind.ThisType;
}

export function createThisTypeNode(): TsThisTypeNode {
  return {
    kind: TsNodeKind.ThisType,
  };
}
