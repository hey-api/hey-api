import type { TsNode as _TsNode } from './nodes/base';
import type { TsNodeBase as _TsNodeBase } from './nodes/base';
import type { TsArrayBindingElement as _TsArrayBindingElement } from './nodes/declarations/array-binding-pattern';
import type { TsArrayBindingPattern as _TsArrayBindingPattern } from './nodes/declarations/array-binding-pattern';
import type { TsBindingElement as _TsBindingElement } from './nodes/declarations/binding-element';
import type { TsBindingName as _TsBindingName } from './nodes/declarations/binding-name';
import type { TsBindingPattern as _TsBindingPattern } from './nodes/declarations/binding-name';
import type { TsClassDeclaration as _TsClassDeclaration } from './nodes/declarations/class-declaration';
import type { TsClassElement as _TsClassElement } from './nodes/declarations/class-declaration';
import type { TsClassStaticBlockDeclaration as _TsClassStaticBlockDeclaration } from './nodes/declarations/class-static-block-declaration';
import type { TsConstructorDeclaration as _TsConstructorDeclaration } from './nodes/declarations/constructor-declaration';
import type { TsDecorator as _TsDecorator } from './nodes/declarations/decorator';
import type { TsEnumDeclaration as _TsEnumDeclaration } from './nodes/declarations/enum-declaration';
import type { TsEnumMember as _TsEnumMember } from './nodes/declarations/enum-member';
import type { TsExportAssignment as _TsExportAssignment } from './nodes/declarations/export-assignment';
import type { TsExportDeclaration as _TsExportDeclaration } from './nodes/declarations/export-declaration';
import type { TsExportSpecifier as _TsExportSpecifier } from './nodes/declarations/export-specifier';
import type { TsExternalModuleReference as _TsExternalModuleReference } from './nodes/declarations/external-module-reference';
import type { TsFunctionDeclaration as _TsFunctionDeclaration } from './nodes/declarations/function-declaration';
import type { TsGetAccessorDeclaration as _TsGetAccessorDeclaration } from './nodes/declarations/get-accessor-declaration';
import type { TsHeritageClause as _TsHeritageClause } from './nodes/declarations/heritage-clause';
import type { TsImportClause as _TsImportClause } from './nodes/declarations/import-clause';
import type { TsImportDeclaration as _TsImportDeclaration } from './nodes/declarations/import-declaration';
import type { TsImportEqualsDeclaration as _TsImportEqualsDeclaration } from './nodes/declarations/import-equals-declaration';
import type { TsImportSpecifier as _TsImportSpecifier } from './nodes/declarations/import-specifier';
import type { TsIndexSignatureDeclaration as _TsIndexSignatureDeclaration } from './nodes/declarations/index-signature-declaration';
import type { TsInterfaceDeclaration as _TsInterfaceDeclaration } from './nodes/declarations/interface-declaration';
import type { TsMethodDeclaration as _TsMethodDeclaration } from './nodes/declarations/method-declaration';
import type { TsModifierLike as _TsModifierLike } from './nodes/declarations/modifier-like';
import type { TsModuleBlock as _TsModuleBlock } from './nodes/declarations/module-block';
import type { TsModuleDeclaration as _TsModuleDeclaration } from './nodes/declarations/module-declaration';
import type { TsNamedExports as _TsNamedExports } from './nodes/declarations/named-exports';
import type { TsNamedImports as _TsNamedImports } from './nodes/declarations/named-imports';
import type { TsNamespaceExport as _TsNamespaceExport } from './nodes/declarations/namespace-export';
import type { TsNamespaceImport as _TsNamespaceImport } from './nodes/declarations/namespace-import';
import type { TsObjectBindingPattern as _TsObjectBindingPattern } from './nodes/declarations/object-binding-pattern';
import type { TsParameterDeclaration as _TsParameterDeclaration } from './nodes/declarations/parameter-declaration';
import type { TsPropertyDeclaration as _TsPropertyDeclaration } from './nodes/declarations/property-declaration';
import type { TsPropertySignature as _TsPropertySignature } from './nodes/declarations/property-signature';
import type { TsSetAccessorDeclaration as _TsSetAccessorDeclaration } from './nodes/declarations/set-accessor-declaration';
import type { TsTypeAliasDeclaration as _TsTypeAliasDeclaration } from './nodes/declarations/type-alias-declaration';
import type { TsTypeElement as _TsTypeElement } from './nodes/declarations/type-element';
import type { TsTypeParameterDeclaration as _TsTypeParameterDeclaration } from './nodes/declarations/type-parameter-declaration';
import type { TsVariableDeclaration as _TsVariableDeclaration } from './nodes/declarations/variable-declaration';
import type { TsVariableDeclarationList as _TsVariableDeclarationList } from './nodes/declarations/variable-declaration-list';
import type { TsVariableStatement as _TsVariableStatement } from './nodes/declarations/variable-statement';
import { EmitHint } from './nodes/emit-hint';
import type { TsExpression as _TsExpression } from './nodes/expression';
import type { TsArrayLiteralExpression as _TsArrayLiteralExpression } from './nodes/expressions/array-literal-expression';
import type { TsArrowFunction as _TsArrowFunction } from './nodes/expressions/arrow-function';
import type { TsConciseBody as _TsConciseBody } from './nodes/expressions/arrow-function';
import type { TsAsExpression as _TsAsExpression } from './nodes/expressions/as-expression';
import type { TsAwaitExpression as _TsAwaitExpression } from './nodes/expressions/await-expression';
import type { TsBigIntLiteral as _TsBigIntLiteral } from './nodes/expressions/big-int-literal';
import type { TsBinaryExpression as _TsBinaryExpression } from './nodes/expressions/binary-expression';
import type { TsCallExpression as _TsCallExpression } from './nodes/expressions/call-expression';
import type { TsClassExpression as _TsClassExpression } from './nodes/expressions/class-expression';
import type { TsCommaListExpression as _TsCommaListExpression } from './nodes/expressions/comma-list-expression';
import type { TsComputedPropertyName as _TsComputedPropertyName } from './nodes/expressions/computed-property-name';
import type { TsConditionalExpression as _TsConditionalExpression } from './nodes/expressions/conditional-expression';
import type { TsDeleteExpression as _TsDeleteExpression } from './nodes/expressions/delete-expression';
import type { TsElementAccessExpression as _TsElementAccessExpression } from './nodes/expressions/element-access-expression';
import type { TsExpressionWithTypeArguments as _TsExpressionWithTypeArguments } from './nodes/expressions/expression-with-type-arguments';
import type { TsFunctionExpression as _TsFunctionExpression } from './nodes/expressions/function-expression';
import type { TsIdentifier as _TsIdentifier } from './nodes/expressions/identifier';
import type { TsMetaProperty as _TsMetaProperty } from './nodes/expressions/meta-property';
import type { TsNewExpression as _TsNewExpression } from './nodes/expressions/new-expression';
import type { TsNoSubstitutionTemplateLiteral as _TsNoSubstitutionTemplateLiteral } from './nodes/expressions/no-substitution-template-literal';
import type { TsNonNullExpression as _TsNonNullExpression } from './nodes/expressions/non-null-expression';
import type { TsNumericLiteral as _TsNumericLiteral } from './nodes/expressions/numeric-literal';
import type { TsObjectLiteralElementLike as _TsObjectLiteralElementLike } from './nodes/expressions/object-literal-element-like';
import type { TsObjectLiteralExpression as _TsObjectLiteralExpression } from './nodes/expressions/object-literal-expression';
import type { TsOmittedExpression as _TsOmittedExpression } from './nodes/expressions/omitted-expression';
import type { TsParenthesizedExpression as _TsParenthesizedExpression } from './nodes/expressions/parenthesized-expression';
import type { TsPostfixUnaryExpression as _TsPostfixUnaryExpression } from './nodes/expressions/postfix-unary-expression';
import type { TsPrefixUnaryExpression as _TsPrefixUnaryExpression } from './nodes/expressions/prefix-unary-expression';
import type { TsPrivateIdentifier as _TsPrivateIdentifier } from './nodes/expressions/private-identifier';
import type { TsPropertyAccessExpression as _TsPropertyAccessExpression } from './nodes/expressions/property-access-expression';
import type { TsPropertyAssignment as _TsPropertyAssignment } from './nodes/expressions/property-assignment';
import type { TsEntityName as _TsEntityName } from './nodes/expressions/qualified-name';
import type { TsQualifiedName as _TsQualifiedName } from './nodes/expressions/qualified-name';
import type { TsRegularExpressionLiteral as _TsRegularExpressionLiteral } from './nodes/expressions/regular-expression-literal';
import type { TsSatisfiesExpression as _TsSatisfiesExpression } from './nodes/expressions/satisfies-expression';
import type { TsShorthandPropertyAssignment as _TsShorthandPropertyAssignment } from './nodes/expressions/shorthand-property-assignment';
import type { TsSpreadAssignment as _TsSpreadAssignment } from './nodes/expressions/spread-assignment';
import type { TsSpreadElement as _TsSpreadElement } from './nodes/expressions/spread-element';
import type { TsStringLiteral as _TsStringLiteral } from './nodes/expressions/string-literal';
import type { TsTaggedTemplateExpression as _TsTaggedTemplateExpression } from './nodes/expressions/tagged-template-expression';
import type { TsTemplateExpression as _TsTemplateExpression } from './nodes/expressions/template-expression';
import type { TsTemplateHead as _TsTemplateHead } from './nodes/expressions/template-head';
import type { TsTemplateMiddle as _TsTemplateMiddle } from './nodes/expressions/template-middle';
import type { TsTemplateSpan as _TsTemplateSpan } from './nodes/expressions/template-span';
import type { TsTemplateTail as _TsTemplateTail } from './nodes/expressions/template-tail';
import type { TsTypeOfExpression as _TsTypeOfExpression } from './nodes/expressions/type-of-expression';
import type { TsVoidExpression as _TsVoidExpression } from './nodes/expressions/void-expression';
import type { TsYieldExpression as _TsYieldExpression } from './nodes/expressions/yield-expression';
import { factory } from './nodes/factory';
import {
  isEntityName,
  isExportDeclaration,
  isIdentifier,
  isImportDeclaration,
  isIntersectionTypeNode,
  isReturnStatement,
  isStatement,
  isStringLiteral,
  isUnionTypeNode,
  isVariableStatement,
} from './nodes/guards';
import type { TsJSDoc as _TsJSDoc } from './nodes/jsdoc/jsdoc';
import type { TsJSDocComment as _TsJSDocComment } from './nodes/jsdoc/jsdoc';
import type { TsJSDocText as _TsJSDocText } from './nodes/jsdoc/jsdoc-text';
import type { TsJsxAttribute as _TsJsxAttribute } from './nodes/jsx/jsx-attribute';
import type { TsJsxAttributes as _TsJsxAttributes } from './nodes/jsx/jsx-attributes';
import type { TsJsxClosingElement as _TsJsxClosingElement } from './nodes/jsx/jsx-closing-element';
import type { TsJsxClosingFragment as _TsJsxClosingFragment } from './nodes/jsx/jsx-closing-fragment';
import type { TsJsxElement as _TsJsxElement } from './nodes/jsx/jsx-element';
import type { TsJsxExpression as _TsJsxExpression } from './nodes/jsx/jsx-expression';
import type { TsJsxFragment as _TsJsxFragment } from './nodes/jsx/jsx-fragment';
import type { TsJsxNamespacedName as _TsJsxNamespacedName } from './nodes/jsx/jsx-namespaced-name';
import type { TsJsxOpeningElement as _TsJsxOpeningElement } from './nodes/jsx/jsx-opening-element';
import type { TsJsxOpeningFragment as _TsJsxOpeningFragment } from './nodes/jsx/jsx-opening-fragment';
import type { TsJsxSelfClosingElement as _TsJsxSelfClosingElement } from './nodes/jsx/jsx-self-closing-element';
import type { TsJsxSpreadAttribute as _TsJsxSpreadAttribute } from './nodes/jsx/jsx-spread-attribute';
import type { TsJsxText as _TsJsxText } from './nodes/jsx/jsx-text';
import { TsNodeKind } from './nodes/kinds';
import type { TsModuleExportName as _TsModuleExportName } from './nodes/module-export-name';
import { NewLineKind } from './nodes/new-line-kind';
import { TsNodeFlags } from './nodes/node-flags';
import type { TsPropertyName as _TsPropertyName } from './nodes/property-name';
import { ScriptKind } from './nodes/script-kind';
import { ScriptTarget } from './nodes/script-target';
import type { TsStatement as _TsStatement } from './nodes/statement';
import type { TsBlock as _TsBlock } from './nodes/statements/block';
import type { TsBreakStatement as _TsBreakStatement } from './nodes/statements/break-statement';
import type { TsCaseBlock as _TsCaseBlock } from './nodes/statements/case-block';
import type { TsCaseClause as _TsCaseClause } from './nodes/statements/case-clause';
import type { TsCatchClause as _TsCatchClause } from './nodes/statements/catch-clause';
import type { TsContinueStatement as _TsContinueStatement } from './nodes/statements/continue-statement';
import type { TsDebuggerStatement as _TsDebuggerStatement } from './nodes/statements/debugger-statement';
import type { TsDefaultClause as _TsDefaultClause } from './nodes/statements/default-clause';
import type { TsDoStatement as _TsDoStatement } from './nodes/statements/do-statement';
import type { TsEmptyStatement as _TsEmptyStatement } from './nodes/statements/empty-statement';
import type { TsExpressionStatement as _TsExpressionStatement } from './nodes/statements/expression-statement';
import type { TsForInStatement as _TsForInStatement } from './nodes/statements/for-in-statement';
import type { TsForInitializer as _TsForInitializer } from './nodes/statements/for-initializer';
import type { TsForOfStatement as _TsForOfStatement } from './nodes/statements/for-of-statement';
import type { TsForStatement as _TsForStatement } from './nodes/statements/for-statement';
import type { TsIfStatement as _TsIfStatement } from './nodes/statements/if-statement';
import type { TsLabeledStatement as _TsLabeledStatement } from './nodes/statements/labeled-statement';
import type { TsReturnStatement as _TsReturnStatement } from './nodes/statements/return-statement';
import type { TsSwitchStatement as _TsSwitchStatement } from './nodes/statements/switch-statement';
import type { TsThrowStatement as _TsThrowStatement } from './nodes/statements/throw-statement';
import type { TsTryStatement as _TsTryStatement } from './nodes/statements/try-statement';
import type { TsWhileStatement as _TsWhileStatement } from './nodes/statements/while-statement';
import type { TsWithStatement as _TsWithStatement } from './nodes/statements/with-statement';
import type { TsSourceFile as _TsSourceFile } from './nodes/structure/source-file';
import { parseSourceFile } from './nodes/structure/source-file';
import type { SyntaxKind as _SyntaxKindEnum } from './nodes/syntax-kind';
import { SyntaxKind } from './nodes/syntax-kind';
import {
  addSyntheticLeadingComment,
  addSyntheticTrailingComment,
  setSyntheticLeadingComments,
  setSyntheticTrailingComments,
} from './nodes/synthetic-comments';
import type { TsToken as _TsToken } from './nodes/token';
import type { TsTypeNode as _TsTypeNode } from './nodes/type';
import type { TsArrayTypeNode as _TsArrayTypeNode } from './nodes/types/array-type-node';
import type { TsConditionalTypeNode as _TsConditionalTypeNode } from './nodes/types/conditional-type-node';
import type { TsConstructorTypeNode as _TsConstructorTypeNode } from './nodes/types/constructor-type-node';
import type { TsFunctionTypeNode as _TsFunctionTypeNode } from './nodes/types/function-type-node';
import type { TsImportTypeNode as _TsImportTypeNode } from './nodes/types/import-type-node';
import type { TsIndexedAccessTypeNode as _TsIndexedAccessTypeNode } from './nodes/types/indexed-access-type-node';
import type { TsInferTypeNode as _TsInferTypeNode } from './nodes/types/infer-type-node';
import type { TsIntersectionTypeNode as _TsIntersectionTypeNode } from './nodes/types/intersection-type-node';
import type { TsKeywordTypeNode as _TsKeywordTypeNode } from './nodes/types/keyword-type-node';
import type { TsLiteralTypeNode as _TsLiteralTypeNode } from './nodes/types/literal-type-node';
import type { TsMappedTypeNode as _TsMappedTypeNode } from './nodes/types/mapped-type-node';
import type { TsNamedTupleMember as _TsNamedTupleMember } from './nodes/types/named-tuple-member';
import type { TsOptionalTypeNode as _TsOptionalTypeNode } from './nodes/types/optional-type-node';
import type { TsParenthesizedTypeNode as _TsParenthesizedTypeNode } from './nodes/types/parenthesized-type-node';
import type { TsRestTypeNode as _TsRestTypeNode } from './nodes/types/rest-type-node';
import type { TsTemplateLiteralType as _TsTemplateLiteralType } from './nodes/types/template-literal-type';
import type { TsTemplateLiteralTypeSpan as _TsTemplateLiteralTypeSpan } from './nodes/types/template-literal-type-span';
import type { TsThisTypeNode as _TsThisTypeNode } from './nodes/types/this-type-node';
import type { TsTupleTypeNode as _TsTupleTypeNode } from './nodes/types/tuple-type-node';
import type { TsTypeLiteralNode as _TsTypeLiteralNode } from './nodes/types/type-literal-node';
import type { TsTypeOperatorNode as _TsTypeOperatorNode } from './nodes/types/type-operator-node';
import type { TsTypePredicateNode as _TsTypePredicateNode } from './nodes/types/type-predicate-node';
import type { TsTypeQueryNode as _TsTypeQueryNode } from './nodes/types/type-query-node';
import type { TsTypeReferenceNode as _TsTypeReferenceNode } from './nodes/types/type-reference-node';
import type { TsUnionTypeNode as _TsUnionTypeNode } from './nodes/types/union-type-node';
import type { TsPrinter as _TsPrinter, TsPrinterOptions as _TsPrinterOptions } from './printer';
import { createPrinter } from './printer';

export namespace ts {
  export type ArrayBindingElement = _TsArrayBindingElement;
  export type ArrayBindingPattern = _TsArrayBindingPattern;
  export type ArrayLiteralExpression = _TsArrayLiteralExpression;
  export type ArrayTypeNode = _TsArrayTypeNode;
  export type ArrowFunction = _TsArrowFunction;
  export type AsExpression = _TsAsExpression;
  export type AwaitExpression = _TsAwaitExpression;
  export type BigIntLiteral = _TsBigIntLiteral;
  export type BinaryExpression = _TsBinaryExpression;
  export type BinaryOperator = _SyntaxKindEnum;
  export type BinaryOperatorToken = _TsToken;
  export type BindingElement = _TsBindingElement;
  export type BindingName = _TsBindingName;
  export type BindingPattern = _TsBindingPattern;
  export type Block = _TsBlock;
  export type BooleanLiteral = _TsToken;
  export type BreakStatement = _TsBreakStatement;
  export type CallExpression = _TsCallExpression;
  export type CaseBlock = _TsCaseBlock;
  export type CaseClause = _TsCaseClause;
  export type CatchClause = _TsCatchClause;
  export type ClassDeclaration = _TsClassDeclaration;
  export type ClassElement = _TsClassElement;
  export type ClassExpression = _TsClassExpression;
  export type ClassStaticBlockDeclaration = _TsClassStaticBlockDeclaration;
  export type CommaListExpression = _TsCommaListExpression;
  export type ComputedPropertyName = _TsComputedPropertyName;
  export type ConciseBody = _TsConciseBody;
  export type ConditionalExpression = _TsConditionalExpression;
  export type ConditionalTypeNode = _TsConditionalTypeNode;
  export type ConstructorDeclaration = _TsConstructorDeclaration;
  export type ConstructorTypeNode = _TsConstructorTypeNode;
  export type ContinueStatement = _TsContinueStatement;
  export type DebuggerStatement = _TsDebuggerStatement;
  export type Decorator = _TsDecorator;
  export type DefaultClause = _TsDefaultClause;
  export type DeleteExpression = _TsDeleteExpression;
  export type DoStatement = _TsDoStatement;
  export type ElementAccessExpression = _TsElementAccessExpression;
  export type EmptyStatement = _TsEmptyStatement;
  export type EntityName = _TsEntityName;
  export type EnumDeclaration = _TsEnumDeclaration;
  export type EnumMember = _TsEnumMember;
  export type ExportAssignment = _TsExportAssignment;
  export type ExportDeclaration = _TsExportDeclaration;
  export type ExportSpecifier = _TsExportSpecifier;
  export type Expression = _TsExpression;
  export type ExpressionStatement = _TsExpressionStatement;
  export type ExpressionWithTypeArguments = _TsExpressionWithTypeArguments;
  export type ExternalModuleReference = _TsExternalModuleReference;
  export type ForInitializer = _TsForInitializer;
  export type ForInStatement = _TsForInStatement;
  export type ForOfStatement = _TsForOfStatement;
  export type ForStatement = _TsForStatement;
  export type FunctionDeclaration = _TsFunctionDeclaration;
  export type FunctionExpression = _TsFunctionExpression;
  export type FunctionTypeNode = _TsFunctionTypeNode;
  export type GetAccessorDeclaration = _TsGetAccessorDeclaration;
  export type HeritageClause = _TsHeritageClause;
  export type Identifier = _TsIdentifier;
  export type IfStatement = _TsIfStatement;
  export type ImportClause = _TsImportClause;
  export type ImportDeclaration = _TsImportDeclaration;
  export type ImportEqualsDeclaration = _TsImportEqualsDeclaration;
  export type ImportSpecifier = _TsImportSpecifier;
  export type ImportTypeNode = _TsImportTypeNode;
  export type IndexedAccessTypeNode = _TsIndexedAccessTypeNode;
  export type IndexSignatureDeclaration = _TsIndexSignatureDeclaration;
  export type InferTypeNode = _TsInferTypeNode;
  export type InterfaceDeclaration = _TsInterfaceDeclaration;
  export type IntersectionTypeNode = _TsIntersectionTypeNode;
  export type JSDoc = _TsJSDoc;
  export type JSDocComment = _TsJSDocComment;
  export type JSDocText = _TsJSDocText;
  export type JsxAttribute = _TsJsxAttribute;
  export type JsxAttributes = _TsJsxAttributes;
  export type JsxClosingElement = _TsJsxClosingElement;
  export type JsxClosingFragment = _TsJsxClosingFragment;
  export type JsxElement = _TsJsxElement;
  export type JsxExpression = _TsJsxExpression;
  export type JsxFragment = _TsJsxFragment;
  export type JsxNamespacedName = _TsJsxNamespacedName;
  export type JsxOpeningElement = _TsJsxOpeningElement;
  export type JsxOpeningFragment = _TsJsxOpeningFragment;
  export type JsxSelfClosingElement = _TsJsxSelfClosingElement;
  export type JsxSpreadAttribute = _TsJsxSpreadAttribute;
  export type JsxText = _TsJsxText;
  export type KeywordTypeNode = _TsKeywordTypeNode;
  export type KeywordTypeSyntaxKind = _SyntaxKindEnum;
  export type LabeledStatement = _TsLabeledStatement;
  export type LiteralTypeNode = _TsLiteralTypeNode;
  export type LiteralValue = bigint | boolean | null | number | string;
  export type MappedTypeNode = _TsMappedTypeNode;
  export type MemberName = _TsIdentifier | _TsPrivateIdentifier;
  export type MetaProperty = _TsMetaProperty;
  export type MethodDeclaration = _TsMethodDeclaration;
  export type Modifier = _TsToken;
  export type ModifierLike = _TsModifierLike;
  export type ModifierSyntaxKind = _SyntaxKindEnum;
  export type ModuleBlock = _TsModuleBlock;
  export type ModuleDeclaration = _TsModuleDeclaration;
  export type ModuleExportName = _TsModuleExportName;
  export type NamedExports = _TsNamedExports;
  export type NamedImports = _TsNamedImports;
  export type NamedTupleMember = _TsNamedTupleMember;
  export type NamespaceExport = _TsNamespaceExport;
  export type NamespaceImport = _TsNamespaceImport;
  export type NewExpression = _TsNewExpression;
  export type Node = _TsNode;
  export type NodeArray = ReadonlyArray<ts.Node>;
  export type NodeBase = _TsNodeBase;
  export type NodeFlags = TsNodeFlags;
  export type NodeKind = TsNodeKind;
  export type NonNullExpression = _TsNonNullExpression;
  export type NoSubstitutionTemplateLiteral = _TsNoSubstitutionTemplateLiteral;
  export type NullLiteral = _TsToken;
  export type NumericLiteral = _TsNumericLiteral;
  export type ObjectBindingPattern = _TsObjectBindingPattern;
  export type ObjectLiteralElementLike = _TsObjectLiteralElementLike;
  export type ObjectLiteralExpression = _TsObjectLiteralExpression;
  export type OmittedExpression = _TsOmittedExpression;
  export type OptionalTypeNode = _TsOptionalTypeNode;
  export type ParameterDeclaration = _TsParameterDeclaration;
  export type ParenthesizedExpression = _TsParenthesizedExpression;
  export type ParenthesizedTypeNode = _TsParenthesizedTypeNode;
  export type PostfixUnaryExpression = _TsPostfixUnaryExpression;
  export type PostfixUnaryOperator = _SyntaxKindEnum;
  export type PrefixUnaryExpression = _TsPrefixUnaryExpression;
  export type PrefixUnaryOperator = _SyntaxKindEnum;
  export type Printer = _TsPrinter;
  export type PrinterOptions = _TsPrinterOptions;
  export type PrivateIdentifier = _TsPrivateIdentifier;
  export type PropertyAccessExpression = _TsPropertyAccessExpression;
  export type PropertyAssignment = _TsPropertyAssignment;
  export type PropertyDeclaration = _TsPropertyDeclaration;
  export type PropertyName = _TsPropertyName;
  export type PropertySignature = _TsPropertySignature;
  export type QualifiedName = _TsQualifiedName;
  export type RegularExpressionLiteral = _TsRegularExpressionLiteral;
  export type RestTypeNode = _TsRestTypeNode;
  export type ReturnStatement = _TsReturnStatement;
  export type SatisfiesExpression = _TsSatisfiesExpression;
  export type SetAccessorDeclaration = _TsSetAccessorDeclaration;
  export type ShorthandPropertyAssignment = _TsShorthandPropertyAssignment;
  export type SourceFile = _TsSourceFile;
  export type SpreadAssignment = _TsSpreadAssignment;
  export type SpreadElement = _TsSpreadElement;
  export type Statement = _TsStatement;
  export type StringLiteral = _TsStringLiteral;
  export type SwitchStatement = _TsSwitchStatement;

  export namespace SyntaxKind {
    export type AbstractKeyword = _SyntaxKindEnum.AbstractKeyword;
    export type AccessorKeyword = _SyntaxKindEnum.AccessorKeyword;
    export type AmpersandAmpersandToken = _SyntaxKindEnum.AmpersandAmpersandToken;
    export type AmpersandToken = _SyntaxKindEnum.AmpersandToken;
    export type AnyKeyword = _SyntaxKindEnum.AnyKeyword;
    export type AssertsKeyword = _SyntaxKindEnum.AssertsKeyword;
    export type AsteriskAsteriskToken = _SyntaxKindEnum.AsteriskAsteriskToken;
    export type AsteriskToken = _SyntaxKindEnum.AsteriskToken;
    export type AsyncKeyword = _SyntaxKindEnum.AsyncKeyword;
    export type AwaitKeyword = _SyntaxKindEnum.AwaitKeyword;
    export type BarBarToken = _SyntaxKindEnum.BarBarToken;
    export type BarToken = _SyntaxKindEnum.BarToken;
    export type BigIntKeyword = _SyntaxKindEnum.BigIntKeyword;
    export type BooleanKeyword = _SyntaxKindEnum.BooleanKeyword;
    export type CaretToken = _SyntaxKindEnum.CaretToken;
    export type ColonToken = _SyntaxKindEnum.ColonToken;
    export type ConstKeyword = _SyntaxKindEnum.ConstKeyword;
    export type DeclareKeyword = _SyntaxKindEnum.DeclareKeyword;
    export type DefaultKeyword = _SyntaxKindEnum.DefaultKeyword;
    export type DotDotDotToken = _SyntaxKindEnum.DotDotDotToken;
    export type EqualsEqualsEqualsToken = _SyntaxKindEnum.EqualsEqualsEqualsToken;
    export type EqualsEqualsToken = _SyntaxKindEnum.EqualsEqualsToken;
    export type EqualsGreaterThanToken = _SyntaxKindEnum.EqualsGreaterThanToken;
    export type EqualsToken = _SyntaxKindEnum.EqualsToken;
    export type ExclamationEqualsEqualsToken = _SyntaxKindEnum.ExclamationEqualsEqualsToken;
    export type ExclamationEqualsToken = _SyntaxKindEnum.ExclamationEqualsToken;
    export type ExclamationToken = _SyntaxKindEnum.ExclamationToken;
    export type ExportKeyword = _SyntaxKindEnum.ExportKeyword;
    export type ExtendsKeyword = _SyntaxKindEnum.ExtendsKeyword;
    export type FalseKeyword = _SyntaxKindEnum.FalseKeyword;
    export type GreaterThanEqualsToken = _SyntaxKindEnum.GreaterThanEqualsToken;
    export type GreaterThanToken = _SyntaxKindEnum.GreaterThanToken;
    export type ImplementsKeyword = _SyntaxKindEnum.ImplementsKeyword;
    export type ImportKeyword = _SyntaxKindEnum.ImportKeyword;
    export type InKeyword = _SyntaxKindEnum.InKeyword;
    export type KeyOfKeyword = _SyntaxKindEnum.KeyOfKeyword;
    export type LessThanEqualsToken = _SyntaxKindEnum.LessThanEqualsToken;
    export type LessThanToken = _SyntaxKindEnum.LessThanToken;
    export type MinusMinusToken = _SyntaxKindEnum.MinusMinusToken;
    export type MinusToken = _SyntaxKindEnum.MinusToken;
    export type MultiLineCommentTrivia = _SyntaxKindEnum.MultiLineCommentTrivia;
    export type NeverKeyword = _SyntaxKindEnum.NeverKeyword;
    export type NewKeyword = _SyntaxKindEnum.NewKeyword;
    export type NullKeyword = _SyntaxKindEnum.NullKeyword;
    export type NumberKeyword = _SyntaxKindEnum.NumberKeyword;
    export type ObjectKeyword = _SyntaxKindEnum.ObjectKeyword;
    export type OutKeyword = _SyntaxKindEnum.OutKeyword;
    export type OverrideKeyword = _SyntaxKindEnum.OverrideKeyword;
    export type PercentToken = _SyntaxKindEnum.PercentToken;
    export type PlusPlusToken = _SyntaxKindEnum.PlusPlusToken;
    export type PlusToken = _SyntaxKindEnum.PlusToken;
    export type PrivateKeyword = _SyntaxKindEnum.PrivateKeyword;
    export type ProtectedKeyword = _SyntaxKindEnum.ProtectedKeyword;
    export type PublicKeyword = _SyntaxKindEnum.PublicKeyword;
    export type QuestionDotToken = _SyntaxKindEnum.QuestionDotToken;
    export type QuestionQuestionEqualsToken = _SyntaxKindEnum.QuestionQuestionEqualsToken;
    export type QuestionQuestionToken = _SyntaxKindEnum.QuestionQuestionToken;
    export type QuestionToken = _SyntaxKindEnum.QuestionToken;
    export type ReadonlyKeyword = _SyntaxKindEnum.ReadonlyKeyword;
    export type SingleLineCommentTrivia = _SyntaxKindEnum.SingleLineCommentTrivia;
    export type SlashToken = _SyntaxKindEnum.SlashToken;
    export type StaticKeyword = _SyntaxKindEnum.StaticKeyword;
    export type StringKeyword = _SyntaxKindEnum.StringKeyword;
    export type SymbolKeyword = _SyntaxKindEnum.SymbolKeyword;
    export type TildeToken = _SyntaxKindEnum.TildeToken;
    export type TrueKeyword = _SyntaxKindEnum.TrueKeyword;
    export type TypeKeyword = _SyntaxKindEnum.TypeKeyword;
    export type UndefinedKeyword = _SyntaxKindEnum.UndefinedKeyword;
    export type UniqueKeyword = _SyntaxKindEnum.UniqueKeyword;
    export type UnknownKeyword = _SyntaxKindEnum.UnknownKeyword;
    export type VoidKeyword = _SyntaxKindEnum.VoidKeyword;
  }
  export type SyntaxKind = _SyntaxKindEnum;
  export type TaggedTemplateExpression = _TsTaggedTemplateExpression;
  export type TemplateExpression = _TsTemplateExpression;
  export type TemplateHead = _TsTemplateHead;
  export type TemplateLiteralType = _TsTemplateLiteralType;
  export type TemplateLiteralTypeNode = _TsTemplateLiteralType;
  export type TemplateLiteralTypeSpan = _TsTemplateLiteralTypeSpan;
  export type TemplateMiddle = _TsTemplateMiddle;
  export type TemplateSpan = _TsTemplateSpan;
  export type TemplateTail = _TsTemplateTail;
  export type ThisTypeNode = _TsThisTypeNode;
  export type ThrowStatement = _TsThrowStatement;
  export type Token<TKind extends _SyntaxKindEnum = _SyntaxKindEnum> = _TsToken & {
    syntaxKind: TKind;
  };
  export type TryStatement = _TsTryStatement;
  export type TupleTypeNode = _TsTupleTypeNode;
  export type TypeAliasDeclaration = _TsTypeAliasDeclaration;
  export type TypeElement = _TsTypeElement;
  export type TypeLiteralNode = _TsTypeLiteralNode;
  export type TypeNode = _TsTypeNode;
  export type TypeOfExpression = _TsTypeOfExpression;
  export type TypeOperatorNode = _TsTypeOperatorNode;
  export type TypeParameterDeclaration = _TsTypeParameterDeclaration;
  export type TypePredicateNode = _TsTypePredicateNode;
  export type TypeQueryNode = _TsTypeQueryNode;
  export type TypeReferenceNode = _TsTypeReferenceNode;
  export type UnionTypeNode = _TsUnionTypeNode;
  export type VariableDeclaration = _TsVariableDeclaration;
  export type VariableDeclarationList = _TsVariableDeclarationList;
  export type VariableStatement = _TsVariableStatement;
  export type VoidExpression = _TsVoidExpression;
  export type WhileStatement = _TsWhileStatement;
  export type WithStatement = _TsWithStatement;
  export type YieldExpression = _TsYieldExpression;
}

export const ts = {
  EmitHint,
  NewLineKind,
  NodeFlags: TsNodeFlags,
  ScriptKind,
  ScriptTarget,
  SyntaxKind,
  TsNodeKind,
  addSyntheticLeadingComment,
  addSyntheticTrailingComment,
  createPrinter,
  createSourceFile: parseSourceFile,
  factory,
  isEntityName,
  isExportDeclaration,
  isIdentifier,
  isImportDeclaration,
  isIntersectionTypeNode,
  isReturnStatement,
  isStatement,
  isStringLiteral,
  isUnionTypeNode,
  isVariableStatement,
  setSyntheticLeadingComments,
  setSyntheticTrailingComments,
} as const;
