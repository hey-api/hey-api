import type { TsNodeBase } from '../base';
import type { TsIdentifier } from '../expressions/identifier';
import { TsNodeKind } from '../kinds';

export interface TsNamespaceImport extends TsNodeBase {
  kind: TsNodeKind.NamespaceImport;
  name: TsIdentifier;
}

export function createNamespaceImport(name: TsIdentifier): TsNamespaceImport {
  return {
    kind: TsNodeKind.NamespaceImport,
    name,
  };
}
