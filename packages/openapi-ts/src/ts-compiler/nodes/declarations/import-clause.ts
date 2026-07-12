import type { TsNodeBase } from '../base';
import type { TsIdentifier } from '../expressions/identifier';
import { TsNodeKind } from '../kinds';
import { SyntaxKind } from '../syntax-kind';
import { createToken, type TsToken } from '../token';
import type { TsNamedImports } from './named-imports';
import type { TsNamespaceImport } from './namespace-import';

export interface TsImportClause extends TsNodeBase {
  kind: TsNodeKind.ImportClause;
  name?: TsIdentifier;
  namedBindings?: TsNamedImports | TsNamespaceImport;
  phaseModifier?: TsToken;
}

export function createImportClause(
  isTypeOnly: boolean,
  name: TsIdentifier | undefined,
  namedBindings: TsNamedImports | TsNamespaceImport | undefined,
): TsImportClause {
  return {
    kind: TsNodeKind.ImportClause,
    name,
    namedBindings,
    phaseModifier: isTypeOnly ? createToken(SyntaxKind.TypeKeyword) : undefined,
  };
}
