import type { TsArrayBindingPattern } from './declarations/array-binding-pattern';
import type { TsBindingElement } from './declarations/binding-element';
import type { TsClassStaticBlockDeclaration } from './declarations/class-static-block-declaration';
import type { TsDecorator } from './declarations/decorator';
import type { TsExportSpecifier } from './declarations/export-specifier';
import type { TsExternalModuleReference } from './declarations/external-module-reference';
import type { TsHeritageClause } from './declarations/heritage-clause';
import type { TsImportClause } from './declarations/import-clause';
import type { TsImportSpecifier } from './declarations/import-specifier';
import type { TsModuleBlock } from './declarations/module-block';
import type { TsNamedExports } from './declarations/named-exports';
import type { TsNamedImports } from './declarations/named-imports';
import type { TsNamespaceExport } from './declarations/namespace-export';
import type { TsNamespaceImport } from './declarations/namespace-import';
import type { TsObjectBindingPattern } from './declarations/object-binding-pattern';
import type { TsParameterDeclaration } from './declarations/parameter-declaration';
import type { TsTypeParameterDeclaration } from './declarations/type-parameter-declaration';
import type { TsExpression } from './expression';
import type { TsPropertyAssignment } from './expressions/property-assignment';
import type { TsShorthandPropertyAssignment } from './expressions/shorthand-property-assignment';
import type { TsSpreadAssignment } from './expressions/spread-assignment';
import type { TsTemplateHead } from './expressions/template-head';
import type { TsTemplateMiddle } from './expressions/template-middle';
import type { TsTemplateSpan } from './expressions/template-span';
import type { TsTemplateTail } from './expressions/template-tail';
import type { TsJSDoc } from './jsdoc/jsdoc';
import type { TsJSDocText } from './jsdoc/jsdoc-text';
import type { TsJsxAttribute } from './jsx/jsx-attribute';
import type { TsJsxAttributes } from './jsx/jsx-attributes';
import type { TsJsxClosingElement } from './jsx/jsx-closing-element';
import type { TsJsxClosingFragment } from './jsx/jsx-closing-fragment';
import type { TsJsxExpression } from './jsx/jsx-expression';
import type { TsJsxNamespacedName } from './jsx/jsx-namespaced-name';
import type { TsJsxOpeningElement } from './jsx/jsx-opening-element';
import type { TsJsxOpeningFragment } from './jsx/jsx-opening-fragment';
import type { TsJsxSpreadAttribute } from './jsx/jsx-spread-attribute';
import type { TsJsxText } from './jsx/jsx-text';
import type { TsNodeKind } from './kinds';
import type { TsStatement } from './statement';
import type { TsCaseBlock } from './statements/case-block';
import type { TsCaseClause } from './statements/case-clause';
import type { TsCatchClause } from './statements/catch-clause';
import type { TsDefaultClause } from './statements/default-clause';
import type { TsSourceFile } from './structure/source-file';
import type { TsToken } from './token';
import type { TsTypeNode } from './type';

export interface TsNodeBase {
  getSourceFile?(): TsSourceFile;
  kind: TsNodeKind;
  leadingComments?: ReadonlyArray<string>;
  trailingComments?: ReadonlyArray<string>;
}

export type TsNode =
  | TsArrayBindingPattern
  | TsBindingElement
  | TsCaseBlock
  | TsCaseClause
  | TsCatchClause
  | TsClassStaticBlockDeclaration
  | TsDecorator
  | TsDefaultClause
  | TsExportSpecifier
  | TsExpression
  | TsExternalModuleReference
  | TsHeritageClause
  | TsImportClause
  | TsImportSpecifier
  | TsJSDoc
  | TsJSDocText
  | TsJsxAttribute
  | TsJsxAttributes
  | TsJsxClosingElement
  | TsJsxClosingFragment
  | TsJsxExpression
  | TsJsxNamespacedName
  | TsJsxOpeningElement
  | TsJsxOpeningFragment
  | TsJsxSpreadAttribute
  | TsJsxText
  | TsModuleBlock
  | TsNamedExports
  | TsNamedImports
  | TsNamespaceExport
  | TsNamespaceImport
  | TsObjectBindingPattern
  | TsParameterDeclaration
  | TsPropertyAssignment
  | TsShorthandPropertyAssignment
  | TsSourceFile
  | TsSpreadAssignment
  | TsStatement
  | TsTemplateHead
  | TsTemplateMiddle
  | TsTemplateSpan
  | TsTemplateTail
  | TsToken
  | TsTypeNode
  | TsTypeParameterDeclaration;
