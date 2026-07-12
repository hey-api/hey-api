import type { TsNodeBase } from '../base';
import type { TsIdentifier } from '../expressions/identifier';
import { TsNodeKind } from '../kinds';
import type { TsModuleExportName } from '../module-export-name';
import { SyntaxKind } from '../syntax-kind';
import { createToken, type TsToken } from '../token';

export interface TsImportSpecifier extends TsNodeBase {
  kind: TsNodeKind.ImportSpecifier;
  name: TsIdentifier;
  propertyName?: TsModuleExportName;
  typeOnlyToken?: TsToken;
}

export function createImportSpecifier(
  isTypeOnly: boolean,
  propertyName: TsModuleExportName | undefined,
  name: TsIdentifier,
): TsImportSpecifier {
  return {
    kind: TsNodeKind.ImportSpecifier,
    name,
    propertyName,
    typeOnlyToken: isTypeOnly ? createToken(SyntaxKind.TypeKeyword) : undefined,
  };
}
