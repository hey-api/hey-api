import type { TsNodeBase } from '../base';
import { TsNodeKind } from '../kinds';
import type { TsExportSpecifier } from './export-specifier';

export interface TsNamedExports extends TsNodeBase {
  elements: ReadonlyArray<TsExportSpecifier>;
  kind: TsNodeKind.NamedExports;
}

export function createNamedExports(elements: ReadonlyArray<TsExportSpecifier>): TsNamedExports {
  return {
    elements,
    kind: TsNodeKind.NamedExports,
  };
}
