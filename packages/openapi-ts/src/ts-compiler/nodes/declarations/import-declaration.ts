import type { TsNodeBase } from '../base';
import type { TsExpression } from '../expression';
import { TsNodeKind } from '../kinds';
import type { TsToken } from '../token';
import type { TsImportClause } from './import-clause';

export interface TsImportDeclaration extends TsNodeBase {
  importClause?: TsImportClause;
  kind: TsNodeKind.ImportDeclaration;
  modifiers?: ReadonlyArray<TsToken>;
  moduleSpecifier: TsExpression;
}

export function createImportDeclaration(
  modifiers: ReadonlyArray<TsToken> | undefined,
  importClause: TsImportClause | undefined,
  moduleSpecifier: TsExpression,
): TsImportDeclaration {
  return {
    importClause,
    kind: TsNodeKind.ImportDeclaration,
    modifiers,
    moduleSpecifier,
  };
}
