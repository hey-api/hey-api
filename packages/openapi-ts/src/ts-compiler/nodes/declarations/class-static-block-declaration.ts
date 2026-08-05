import type { TsNodeBase } from '../base';
import { TsNodeKind } from '../kinds';
import type { TsBlock } from '../statements/block';

export interface TsClassStaticBlockDeclaration extends TsNodeBase {
  body: TsBlock;
  kind: TsNodeKind.ClassStaticBlockDeclaration;
}

export function createClassStaticBlockDeclaration(body: TsBlock): TsClassStaticBlockDeclaration {
  return {
    body,
    kind: TsNodeKind.ClassStaticBlockDeclaration,
  };
}
