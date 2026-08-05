import type { TsArrayTypeNode } from './types/array-type-node';
import type { TsConditionalTypeNode } from './types/conditional-type-node';
import type { TsConstructorTypeNode } from './types/constructor-type-node';
import type { TsFunctionTypeNode } from './types/function-type-node';
import type { TsImportTypeNode } from './types/import-type-node';
import type { TsIndexedAccessTypeNode } from './types/indexed-access-type-node';
import type { TsInferTypeNode } from './types/infer-type-node';
import type { TsIntersectionTypeNode } from './types/intersection-type-node';
import type { TsKeywordTypeNode } from './types/keyword-type-node';
import type { TsLiteralTypeNode } from './types/literal-type-node';
import type { TsMappedTypeNode } from './types/mapped-type-node';
import type { TsNamedTupleMember } from './types/named-tuple-member';
import type { TsOptionalTypeNode } from './types/optional-type-node';
import type { TsParenthesizedTypeNode } from './types/parenthesized-type-node';
import type { TsRestTypeNode } from './types/rest-type-node';
import type { TsTemplateLiteralType } from './types/template-literal-type';
import type { TsTemplateLiteralTypeSpan } from './types/template-literal-type-span';
import type { TsThisTypeNode } from './types/this-type-node';
import type { TsTupleTypeNode } from './types/tuple-type-node';
import type { TsTypeLiteralNode } from './types/type-literal-node';
import type { TsTypeOperatorNode } from './types/type-operator-node';
import type { TsTypePredicateNode } from './types/type-predicate-node';
import type { TsTypeQueryNode } from './types/type-query-node';
import type { TsTypeReferenceNode } from './types/type-reference-node';
import type { TsUnionTypeNode } from './types/union-type-node';

export type TsTypeNode =
  | TsArrayTypeNode
  | TsConditionalTypeNode
  | TsConstructorTypeNode
  | TsFunctionTypeNode
  | TsImportTypeNode
  | TsIndexedAccessTypeNode
  | TsInferTypeNode
  | TsIntersectionTypeNode
  | TsKeywordTypeNode
  | TsLiteralTypeNode
  | TsMappedTypeNode
  | TsNamedTupleMember
  | TsOptionalTypeNode
  | TsParenthesizedTypeNode
  | TsRestTypeNode
  | TsTemplateLiteralType
  | TsTemplateLiteralTypeSpan
  | TsThisTypeNode
  | TsTupleTypeNode
  | TsTypeLiteralNode
  | TsTypeOperatorNode
  | TsTypePredicateNode
  | TsTypeQueryNode
  | TsTypeReferenceNode
  | TsUnionTypeNode;
