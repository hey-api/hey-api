import type { TsNodeBase } from '../base';
import { TsNodeKind } from '../kinds';
import type { TsModuleExportName } from '../module-export-name';

export interface TsNamespaceExport extends TsNodeBase {
  kind: TsNodeKind.NamespaceExport;
  name: TsModuleExportName;
}

export function createNamespaceExport(name: TsModuleExportName): TsNamespaceExport {
  return {
    kind: TsNodeKind.NamespaceExport,
    name,
  };
}
