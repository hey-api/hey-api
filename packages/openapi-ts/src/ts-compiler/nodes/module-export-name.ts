import type { TsIdentifier } from './expressions/identifier';
import type { TsStringLiteral } from './expressions/string-literal';

export type TsModuleExportName = TsIdentifier | TsStringLiteral;
