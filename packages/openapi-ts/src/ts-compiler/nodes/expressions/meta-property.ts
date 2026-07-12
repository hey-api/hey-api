import type { TsNodeBase } from '../base';
import { TsNodeKind } from '../kinds';
import type { SyntaxKind } from '../syntax-kind';
import type { TsIdentifier } from './identifier';

export interface TsMetaProperty extends TsNodeBase {
  keywordToken: SyntaxKind;
  kind: TsNodeKind.MetaProperty;
  name: TsIdentifier;
}

export function createMetaProperty(keywordToken: SyntaxKind, name: TsIdentifier): TsMetaProperty {
  return {
    keywordToken,
    kind: TsNodeKind.MetaProperty,
    name,
  };
}
