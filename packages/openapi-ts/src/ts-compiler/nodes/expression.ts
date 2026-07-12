import type { TsArrayLiteralExpression } from './expressions/array-literal-expression';
import type { TsArrowFunction } from './expressions/arrow-function';
import type { TsAsExpression } from './expressions/as-expression';
import type { TsAwaitExpression } from './expressions/await-expression';
import type { TsBigIntLiteral } from './expressions/big-int-literal';
import type { TsBinaryExpression } from './expressions/binary-expression';
import type { TsCallExpression } from './expressions/call-expression';
import type { TsClassExpression } from './expressions/class-expression';
import type { TsCommaListExpression } from './expressions/comma-list-expression';
import type { TsComputedPropertyName } from './expressions/computed-property-name';
import type { TsConditionalExpression } from './expressions/conditional-expression';
import type { TsDeleteExpression } from './expressions/delete-expression';
import type { TsElementAccessExpression } from './expressions/element-access-expression';
import type { TsExpressionWithTypeArguments } from './expressions/expression-with-type-arguments';
import type { TsFunctionExpression } from './expressions/function-expression';
import type { TsIdentifier } from './expressions/identifier';
import type { TsMetaProperty } from './expressions/meta-property';
import type { TsNewExpression } from './expressions/new-expression';
import type { TsNoSubstitutionTemplateLiteral } from './expressions/no-substitution-template-literal';
import type { TsNonNullExpression } from './expressions/non-null-expression';
import type { TsNumericLiteral } from './expressions/numeric-literal';
import type { TsObjectLiteralExpression } from './expressions/object-literal-expression';
import type { TsOmittedExpression } from './expressions/omitted-expression';
import type { TsParenthesizedExpression } from './expressions/parenthesized-expression';
import type { TsPostfixUnaryExpression } from './expressions/postfix-unary-expression';
import type { TsPrefixUnaryExpression } from './expressions/prefix-unary-expression';
import type { TsPrivateIdentifier } from './expressions/private-identifier';
import type { TsPropertyAccessExpression } from './expressions/property-access-expression';
import type { TsQualifiedName } from './expressions/qualified-name';
import type { TsRegularExpressionLiteral } from './expressions/regular-expression-literal';
import type { TsSatisfiesExpression } from './expressions/satisfies-expression';
import type { TsSpreadElement } from './expressions/spread-element';
import type { TsStringLiteral } from './expressions/string-literal';
import type { TsTaggedTemplateExpression } from './expressions/tagged-template-expression';
import type { TsTemplateExpression } from './expressions/template-expression';
import type { TsTypeOfExpression } from './expressions/type-of-expression';
import type { TsVoidExpression } from './expressions/void-expression';
import type { TsYieldExpression } from './expressions/yield-expression';
import type { TsJsxElement } from './jsx/jsx-element';
import type { TsJsxFragment } from './jsx/jsx-fragment';
import type { TsJsxSelfClosingElement } from './jsx/jsx-self-closing-element';
import type { TsToken } from './token';

export type TsExpression =
  | TsArrayLiteralExpression
  | TsArrowFunction
  | TsAsExpression
  | TsAwaitExpression
  | TsBigIntLiteral
  | TsBinaryExpression
  | TsCallExpression
  | TsClassExpression
  | TsCommaListExpression
  | TsComputedPropertyName
  | TsConditionalExpression
  | TsDeleteExpression
  | TsElementAccessExpression
  | TsExpressionWithTypeArguments
  | TsFunctionExpression
  | TsIdentifier
  | TsJsxElement
  | TsJsxFragment
  | TsJsxSelfClosingElement
  | TsMetaProperty
  | TsNewExpression
  | TsNoSubstitutionTemplateLiteral
  | TsNonNullExpression
  | TsNumericLiteral
  | TsObjectLiteralExpression
  | TsOmittedExpression
  | TsParenthesizedExpression
  | TsPostfixUnaryExpression
  | TsPrefixUnaryExpression
  | TsPrivateIdentifier
  | TsPropertyAccessExpression
  | TsQualifiedName
  | TsRegularExpressionLiteral
  | TsSatisfiesExpression
  | TsSpreadElement
  | TsStringLiteral
  | TsTaggedTemplateExpression
  | TsTemplateExpression
  | TsToken
  | TsTypeOfExpression
  | TsVoidExpression
  | TsYieldExpression;
