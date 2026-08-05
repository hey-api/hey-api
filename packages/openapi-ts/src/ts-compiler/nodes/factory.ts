import { createArrayBindingPattern } from './declarations/array-binding-pattern';
import { createBindingElement } from './declarations/binding-element';
import { createClassDeclaration } from './declarations/class-declaration';
import { createClassStaticBlockDeclaration } from './declarations/class-static-block-declaration';
import { createConstructorDeclaration } from './declarations/constructor-declaration';
import { createDecorator } from './declarations/decorator';
import { createEnumDeclaration } from './declarations/enum-declaration';
import { createEnumMember } from './declarations/enum-member';
import { createExportAssignment } from './declarations/export-assignment';
import { createExportDeclaration } from './declarations/export-declaration';
import { createExportSpecifier } from './declarations/export-specifier';
import { createExternalModuleReference } from './declarations/external-module-reference';
import { createFunctionDeclaration } from './declarations/function-declaration';
import { createGetAccessorDeclaration } from './declarations/get-accessor-declaration';
import { createHeritageClause } from './declarations/heritage-clause';
import { createImportClause } from './declarations/import-clause';
import { createImportDeclaration } from './declarations/import-declaration';
import { createImportEqualsDeclaration } from './declarations/import-equals-declaration';
import { createImportSpecifier } from './declarations/import-specifier';
import { createIndexSignature } from './declarations/index-signature-declaration';
import { createInterfaceDeclaration } from './declarations/interface-declaration';
import { createMethodDeclaration } from './declarations/method-declaration';
import { createModuleBlock } from './declarations/module-block';
import { createModuleDeclaration } from './declarations/module-declaration';
import { createNamedExports } from './declarations/named-exports';
import { createNamedImports } from './declarations/named-imports';
import { createNamespaceExport } from './declarations/namespace-export';
import { createNamespaceImport } from './declarations/namespace-import';
import { createObjectBindingPattern } from './declarations/object-binding-pattern';
import { createParameterDeclaration } from './declarations/parameter-declaration';
import { createPropertyDeclaration } from './declarations/property-declaration';
import { createPropertySignature } from './declarations/property-signature';
import { createSetAccessorDeclaration } from './declarations/set-accessor-declaration';
import { createTypeAliasDeclaration } from './declarations/type-alias-declaration';
import { createTypeParameterDeclaration } from './declarations/type-parameter-declaration';
import { createVariableDeclaration } from './declarations/variable-declaration';
import { createVariableDeclarationList } from './declarations/variable-declaration-list';
import { createVariableStatement } from './declarations/variable-statement';
import { createArrayLiteralExpression } from './expressions/array-literal-expression';
import { createArrowFunction } from './expressions/arrow-function';
import { createAsExpression } from './expressions/as-expression';
import { createAwaitExpression } from './expressions/await-expression';
import { createBigIntLiteral } from './expressions/big-int-literal';
import { createBinaryExpression } from './expressions/binary-expression';
import { createCallExpression } from './expressions/call-expression';
import { createClassExpression } from './expressions/class-expression';
import { createCommaListExpression } from './expressions/comma-list-expression';
import { createComputedPropertyName } from './expressions/computed-property-name';
import { createConditionalExpression } from './expressions/conditional-expression';
import { createDeleteExpression } from './expressions/delete-expression';
import {
  createElementAccessChain,
  createElementAccessExpression,
} from './expressions/element-access-expression';
import { createExpressionWithTypeArguments } from './expressions/expression-with-type-arguments';
import { createFunctionExpression } from './expressions/function-expression';
import { createIdentifier } from './expressions/identifier';
import { createFalse, createNull, createTrue } from './expressions/keyword-literals';
import { createMetaProperty } from './expressions/meta-property';
import { createNewExpression } from './expressions/new-expression';
import { createNoSubstitutionTemplateLiteral } from './expressions/no-substitution-template-literal';
import { createNonNullExpression } from './expressions/non-null-expression';
import { createNumericLiteral } from './expressions/numeric-literal';
import { createObjectLiteralExpression } from './expressions/object-literal-expression';
import { createOmittedExpression } from './expressions/omitted-expression';
import { createParenthesizedExpression } from './expressions/parenthesized-expression';
import { createPostfixUnaryExpression } from './expressions/postfix-unary-expression';
import { createPrefixUnaryExpression } from './expressions/prefix-unary-expression';
import { createPrivateIdentifier } from './expressions/private-identifier';
import {
  createPropertyAccessChain,
  createPropertyAccessExpression,
} from './expressions/property-access-expression';
import { createPropertyAssignment } from './expressions/property-assignment';
import { createQualifiedName } from './expressions/qualified-name';
import { createRegularExpressionLiteral } from './expressions/regular-expression-literal';
import { createSatisfiesExpression } from './expressions/satisfies-expression';
import { createShorthandPropertyAssignment } from './expressions/shorthand-property-assignment';
import { createSpreadAssignment } from './expressions/spread-assignment';
import { createSpreadElement } from './expressions/spread-element';
import { createStringLiteral } from './expressions/string-literal';
import { createTaggedTemplateExpression } from './expressions/tagged-template-expression';
import { createTemplateExpression } from './expressions/template-expression';
import { createTemplateHead } from './expressions/template-head';
import { createTemplateMiddle } from './expressions/template-middle';
import { createTemplateSpan } from './expressions/template-span';
import { createTemplateTail } from './expressions/template-tail';
import { createTypeOfExpression } from './expressions/type-of-expression';
import { createVoidExpression } from './expressions/void-expression';
import { createYieldExpression } from './expressions/yield-expression';
import { createJSDocComment } from './jsdoc/jsdoc';
import { createJSDocText } from './jsdoc/jsdoc-text';
import { createJsxAttribute } from './jsx/jsx-attribute';
import { createJsxAttributes } from './jsx/jsx-attributes';
import { createJsxClosingElement } from './jsx/jsx-closing-element';
import { createJsxClosingFragment } from './jsx/jsx-closing-fragment';
import { createJsxElement } from './jsx/jsx-element';
import { createJsxExpression } from './jsx/jsx-expression';
import { createJsxFragment } from './jsx/jsx-fragment';
import { createJsxNamespacedName } from './jsx/jsx-namespaced-name';
import { createJsxOpeningElement } from './jsx/jsx-opening-element';
import { createJsxOpeningFragment } from './jsx/jsx-opening-fragment';
import { createJsxSelfClosingElement } from './jsx/jsx-self-closing-element';
import { createJsxSpreadAttribute } from './jsx/jsx-spread-attribute';
import { createJsxText } from './jsx/jsx-text';
import { createNodeArray } from './node-array';
import { createBlock } from './statements/block';
import { createBreakStatement } from './statements/break-statement';
import { createCaseBlock } from './statements/case-block';
import { createCaseClause } from './statements/case-clause';
import { createCatchClause } from './statements/catch-clause';
import { createContinueStatement } from './statements/continue-statement';
import { createDebuggerStatement } from './statements/debugger-statement';
import { createDefaultClause } from './statements/default-clause';
import { createDoStatement } from './statements/do-statement';
import { createEmptyStatement } from './statements/empty-statement';
import { createExpressionStatement } from './statements/expression-statement';
import { createForInStatement } from './statements/for-in-statement';
import { createForOfStatement } from './statements/for-of-statement';
import { createForStatement } from './statements/for-statement';
import { createIfStatement } from './statements/if-statement';
import { createLabeledStatement } from './statements/labeled-statement';
import { createReturnStatement } from './statements/return-statement';
import { createSwitchStatement } from './statements/switch-statement';
import { createThrowStatement } from './statements/throw-statement';
import { createTryStatement } from './statements/try-statement';
import { createWhileStatement } from './statements/while-statement';
import { createWithStatement } from './statements/with-statement';
import { createSourceFile } from './structure/source-file';
import { createModifier, createToken } from './token';
import { createArrayTypeNode } from './types/array-type-node';
import { createConditionalTypeNode } from './types/conditional-type-node';
import { createConstructorTypeNode } from './types/constructor-type-node';
import { createFunctionTypeNode } from './types/function-type-node';
import { createImportTypeNode } from './types/import-type-node';
import { createIndexedAccessTypeNode } from './types/indexed-access-type-node';
import { createInferTypeNode } from './types/infer-type-node';
import { createIntersectionTypeNode } from './types/intersection-type-node';
import { createKeywordTypeNode } from './types/keyword-type-node';
import { createLiteralTypeNode } from './types/literal-type-node';
import { createMappedTypeNode } from './types/mapped-type-node';
import { createNamedTupleMember } from './types/named-tuple-member';
import { createOptionalTypeNode } from './types/optional-type-node';
import { createParenthesizedType } from './types/parenthesized-type-node';
import { createRestTypeNode } from './types/rest-type-node';
import { createTemplateLiteralType } from './types/template-literal-type';
import { createTemplateLiteralTypeSpan } from './types/template-literal-type-span';
import { createThisTypeNode } from './types/this-type-node';
import { createTupleTypeNode } from './types/tuple-type-node';
import { createTypeLiteralNode } from './types/type-literal-node';
import { createTypeOperatorNode } from './types/type-operator-node';
import { createTypePredicateNode } from './types/type-predicate-node';
import { createTypeQueryNode } from './types/type-query-node';
import { createTypeReferenceNode } from './types/type-reference-node';
import { createUnionTypeNode } from './types/union-type-node';

export const factory = {
  createArrayBindingPattern,
  createArrayLiteralExpression,
  createArrayTypeNode,
  createArrowFunction,
  createAsExpression,
  createAwaitExpression,
  createBigIntLiteral,
  createBinaryExpression,
  createBindingElement,
  createBlock,
  createBreakStatement,
  createCallExpression,
  createCaseBlock,
  createCaseClause,
  createCatchClause,
  createClassDeclaration,
  createClassExpression,
  createClassStaticBlockDeclaration,
  createCommaListExpression,
  createComputedPropertyName,
  createConditionalExpression,
  createConditionalTypeNode,
  createConstructorDeclaration,
  createConstructorTypeNode,
  createContinueStatement,
  createDebuggerStatement,
  createDecorator,
  createDefaultClause,
  createDeleteExpression,
  createDoStatement,
  createElementAccessChain,
  createElementAccessExpression,
  createEmptyStatement,
  createEnumDeclaration,
  createEnumMember,
  createExportAssignment,
  createExportDeclaration,
  createExportSpecifier,
  createExpressionStatement,
  createExpressionWithTypeArguments,
  createExternalModuleReference,
  createFalse,
  createForInStatement,
  createForOfStatement,
  createForStatement,
  createFunctionDeclaration,
  createFunctionExpression,
  createFunctionTypeNode,
  createGetAccessorDeclaration,
  createHeritageClause,
  createIdentifier,
  createIfStatement,
  createImportClause,
  createImportDeclaration,
  createImportEqualsDeclaration,
  createImportSpecifier,
  createImportTypeNode,
  createIndexSignature,
  createIndexedAccessTypeNode,
  createInferTypeNode,
  createInterfaceDeclaration,
  createIntersectionTypeNode,
  createJSDocComment,
  createJSDocText,
  createJsxAttribute,
  createJsxAttributes,
  createJsxClosingElement,
  createJsxClosingFragment,
  createJsxElement,
  createJsxExpression,
  createJsxFragment,
  createJsxNamespacedName,
  createJsxOpeningElement,
  createJsxOpeningFragment,
  createJsxSelfClosingElement,
  createJsxSpreadAttribute,
  createJsxText,
  createKeywordTypeNode,
  createLabeledStatement,
  createLiteralTypeNode,
  createMappedTypeNode,
  createMetaProperty,
  createMethodDeclaration,
  createModifier,
  createModuleBlock,
  createModuleDeclaration,
  createNamedExports,
  createNamedImports,
  createNamedTupleMember,
  createNamespaceExport,
  createNamespaceImport,
  createNewExpression,
  createNoSubstitutionTemplateLiteral,
  createNodeArray,
  createNonNullExpression,
  createNull,
  createNumericLiteral,
  createObjectBindingPattern,
  createObjectLiteralExpression,
  createOmittedExpression,
  createOptionalTypeNode,
  createParameterDeclaration,
  createParenthesizedExpression,
  createParenthesizedType,
  createPostfixUnaryExpression,
  createPrefixUnaryExpression,
  createPrivateIdentifier,
  createPropertyAccessChain,
  createPropertyAccessExpression,
  createPropertyAssignment,
  createPropertyDeclaration,
  createPropertySignature,
  createQualifiedName,
  createRegularExpressionLiteral,
  createRestTypeNode,
  createReturnStatement,
  createSatisfiesExpression,
  createSetAccessorDeclaration,
  createShorthandPropertyAssignment,
  createSourceFile,
  createSpreadAssignment,
  createSpreadElement,
  createStringLiteral,
  createSwitchStatement,
  createTaggedTemplateExpression,
  createTemplateExpression,
  createTemplateHead,
  createTemplateLiteralType,
  createTemplateLiteralTypeSpan,
  createTemplateMiddle,
  createTemplateSpan,
  createTemplateTail,
  createThisTypeNode,
  createThrowStatement,
  createToken,
  createTrue,
  createTryStatement,
  createTupleTypeNode,
  createTypeAliasDeclaration,
  createTypeLiteralNode,
  createTypeOfExpression,
  createTypeOperatorNode,
  createTypeParameterDeclaration,
  createTypePredicateNode,
  createTypeQueryNode,
  createTypeReferenceNode,
  createUnionTypeNode,
  createVariableDeclaration,
  createVariableDeclarationList,
  createVariableStatement,
  createVoidExpression,
  createWhileStatement,
  createWithStatement,
  createYieldExpression,
} as const;
