import type { TsClassDeclaration } from './declarations/class-declaration';
import type { TsConstructorDeclaration } from './declarations/constructor-declaration';
import type { TsEnumDeclaration } from './declarations/enum-declaration';
import type { TsEnumMember } from './declarations/enum-member';
import type { TsExportAssignment } from './declarations/export-assignment';
import type { TsExportDeclaration } from './declarations/export-declaration';
import type { TsFunctionDeclaration } from './declarations/function-declaration';
import type { TsGetAccessorDeclaration } from './declarations/get-accessor-declaration';
import type { TsImportDeclaration } from './declarations/import-declaration';
import type { TsImportEqualsDeclaration } from './declarations/import-equals-declaration';
import type { TsIndexSignatureDeclaration } from './declarations/index-signature-declaration';
import type { TsInterfaceDeclaration } from './declarations/interface-declaration';
import type { TsMethodDeclaration } from './declarations/method-declaration';
import type { TsModuleDeclaration } from './declarations/module-declaration';
import type { TsPropertyDeclaration } from './declarations/property-declaration';
import type { TsPropertySignature } from './declarations/property-signature';
import type { TsSetAccessorDeclaration } from './declarations/set-accessor-declaration';
import type { TsTypeAliasDeclaration } from './declarations/type-alias-declaration';
import type { TsVariableDeclaration } from './declarations/variable-declaration';
import type { TsVariableDeclarationList } from './declarations/variable-declaration-list';
import type { TsVariableStatement } from './declarations/variable-statement';
import type { TsBlock } from './statements/block';
import type { TsBreakStatement } from './statements/break-statement';
import type { TsContinueStatement } from './statements/continue-statement';
import type { TsDebuggerStatement } from './statements/debugger-statement';
import type { TsDoStatement } from './statements/do-statement';
import type { TsEmptyStatement } from './statements/empty-statement';
import type { TsExpressionStatement } from './statements/expression-statement';
import type { TsForInStatement } from './statements/for-in-statement';
import type { TsForOfStatement } from './statements/for-of-statement';
import type { TsForStatement } from './statements/for-statement';
import type { TsIfStatement } from './statements/if-statement';
import type { TsLabeledStatement } from './statements/labeled-statement';
import type { TsReturnStatement } from './statements/return-statement';
import type { TsSwitchStatement } from './statements/switch-statement';
import type { TsThrowStatement } from './statements/throw-statement';
import type { TsTryStatement } from './statements/try-statement';
import type { TsWhileStatement } from './statements/while-statement';
import type { TsWithStatement } from './statements/with-statement';

export type TsStatement =
  | TsBlock
  | TsBreakStatement
  | TsClassDeclaration
  | TsConstructorDeclaration
  | TsContinueStatement
  | TsDebuggerStatement
  | TsDoStatement
  | TsEmptyStatement
  | TsEnumDeclaration
  | TsEnumMember
  | TsExportAssignment
  | TsExportDeclaration
  | TsExpressionStatement
  | TsForInStatement
  | TsForOfStatement
  | TsForStatement
  | TsFunctionDeclaration
  | TsGetAccessorDeclaration
  | TsIfStatement
  | TsImportDeclaration
  | TsImportEqualsDeclaration
  | TsIndexSignatureDeclaration
  | TsInterfaceDeclaration
  | TsLabeledStatement
  | TsMethodDeclaration
  | TsModuleDeclaration
  | TsPropertyDeclaration
  | TsPropertySignature
  | TsReturnStatement
  | TsSetAccessorDeclaration
  | TsSwitchStatement
  | TsThrowStatement
  | TsTryStatement
  | TsTypeAliasDeclaration
  | TsVariableDeclaration
  | TsVariableDeclarationList
  | TsVariableStatement
  | TsWhileStatement
  | TsWithStatement;
