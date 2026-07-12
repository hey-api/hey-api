import type { TsNodeBase } from '../base';
import type { TsExpression } from '../expression';
import { TsNodeKind } from '../kinds';
import { SyntaxKind } from '../syntax-kind';
import { createToken, type TsToken } from '../token';
import type { TsNamedExports } from './named-exports';
import type { TsNamespaceExport } from './namespace-export';

export interface TsExportDeclaration extends TsNodeBase {
  exportClause?: TsNamedExports | TsNamespaceExport;
  kind: TsNodeKind.ExportDeclaration;
  modifiers?: ReadonlyArray<TsToken>;
  moduleSpecifier?: TsExpression;
  typeOnlyToken?: TsToken;
}

export function createExportDeclaration(
  modifiers: ReadonlyArray<TsToken> | undefined,
  isTypeOnly: boolean,
  exportClause: TsNamedExports | TsNamespaceExport | undefined,
  moduleSpecifier?: TsExpression,
): TsExportDeclaration {
  return {
    exportClause,
    kind: TsNodeKind.ExportDeclaration,
    modifiers,
    moduleSpecifier,
    typeOnlyToken: isTypeOnly ? createToken(SyntaxKind.TypeKeyword) : undefined,
  };
}
