import type { TsNodeBase } from '../base';
import { TsNodeKind } from '../kinds';
import type { TsImportSpecifier } from './import-specifier';

export interface TsNamedImports extends TsNodeBase {
  elements: ReadonlyArray<TsImportSpecifier>;
  kind: TsNodeKind.NamedImports;
}

export function createNamedImports(elements: ReadonlyArray<TsImportSpecifier>): TsNamedImports {
  return {
    elements,
    kind: TsNodeKind.NamedImports,
  };
}
