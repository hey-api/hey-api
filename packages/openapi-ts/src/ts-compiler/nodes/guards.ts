import type { TsNode } from './base';
import type { TsExportDeclaration } from './declarations/export-declaration';
import type { TsImportDeclaration } from './declarations/import-declaration';
import type { TsVariableStatement } from './declarations/variable-statement';
import type { TsIdentifier } from './expressions/identifier';
import type { TsEntityName } from './expressions/qualified-name';
import type { TsStringLiteral } from './expressions/string-literal';
import { TsNodeKind } from './kinds';
import type { TsStatement } from './statement';
import type { TsReturnStatement } from './statements/return-statement';
import type { TsIntersectionTypeNode } from './types/intersection-type-node';
import type { TsUnionTypeNode } from './types/union-type-node';

const STATEMENT_KINDS: ReadonlySet<TsNodeKind> = new Set([
  TsNodeKind.Block,
  TsNodeKind.ClassDeclaration,
  TsNodeKind.Constructor,
  TsNodeKind.EnumDeclaration,
  TsNodeKind.EnumMember,
  TsNodeKind.ExportDeclaration,
  TsNodeKind.ExpressionStatement,
  TsNodeKind.ForInStatement,
  TsNodeKind.ForOfStatement,
  TsNodeKind.ForStatement,
  TsNodeKind.FunctionDeclaration,
  TsNodeKind.GetAccessor,
  TsNodeKind.IfStatement,
  TsNodeKind.ImportDeclaration,
  TsNodeKind.IndexSignature,
  TsNodeKind.InterfaceDeclaration,
  TsNodeKind.MethodDeclaration,
  TsNodeKind.PropertyDeclaration,
  TsNodeKind.PropertySignature,
  TsNodeKind.ReturnStatement,
  TsNodeKind.SetAccessor,
  TsNodeKind.ThrowStatement,
  TsNodeKind.TryStatement,
  TsNodeKind.TypeAliasDeclaration,
  TsNodeKind.VariableDeclaration,
  TsNodeKind.VariableDeclarationList,
  TsNodeKind.VariableStatement,
]);

export function isEntityName(node: TsNode): node is TsEntityName {
  return node.kind === TsNodeKind.Identifier || node.kind === TsNodeKind.QualifiedName;
}

export function isExportDeclaration(node: TsNode): node is TsExportDeclaration {
  return node.kind === TsNodeKind.ExportDeclaration;
}

export function isIdentifier(node: TsNode): node is TsIdentifier {
  return node.kind === TsNodeKind.Identifier;
}

export function isImportDeclaration(node: TsNode): node is TsImportDeclaration {
  return node.kind === TsNodeKind.ImportDeclaration;
}

export function isIntersectionTypeNode(node: TsNode): node is TsIntersectionTypeNode {
  return node.kind === TsNodeKind.IntersectionType;
}

export function isReturnStatement(node: TsNode): node is TsReturnStatement {
  return node.kind === TsNodeKind.ReturnStatement;
}

export function isStatement(node: TsNode): node is TsStatement {
  return STATEMENT_KINDS.has(node.kind);
}

export function isStringLiteral(node: TsNode): node is TsStringLiteral {
  return node.kind === TsNodeKind.StringLiteral;
}

export function isUnionTypeNode(node: TsNode): node is TsUnionTypeNode {
  return node.kind === TsNodeKind.UnionType;
}

export function isVariableStatement(node: TsNode): node is TsVariableStatement {
  return node.kind === TsNodeKind.VariableStatement;
}
