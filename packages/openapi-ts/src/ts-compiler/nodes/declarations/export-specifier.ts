import type { TsNodeBase } from '../base';
import { TsNodeKind } from '../kinds';
import type { TsModuleExportName } from '../module-export-name';
import { SyntaxKind } from '../syntax-kind';
import { createToken, type TsToken } from '../token';

export interface TsExportSpecifier extends TsNodeBase {
  kind: TsNodeKind.ExportSpecifier;
  name: TsModuleExportName;
  propertyName?: TsModuleExportName;
  typeOnlyToken?: TsToken;
}

export function createExportSpecifier(
  isTypeOnly: boolean,
  propertyName: TsModuleExportName | undefined,
  name: TsModuleExportName,
): TsExportSpecifier {
  return {
    kind: TsNodeKind.ExportSpecifier,
    name,
    propertyName,
    typeOnlyToken: isTypeOnly ? createToken(SyntaxKind.TypeKeyword) : undefined,
  };
}
