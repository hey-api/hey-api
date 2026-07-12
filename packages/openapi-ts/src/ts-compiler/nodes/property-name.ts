import type { TsBigIntLiteral } from './expressions/big-int-literal';
import type { TsComputedPropertyName } from './expressions/computed-property-name';
import type { TsIdentifier } from './expressions/identifier';
import type { TsNoSubstitutionTemplateLiteral } from './expressions/no-substitution-template-literal';
import type { TsNumericLiteral } from './expressions/numeric-literal';
import type { TsPrivateIdentifier } from './expressions/private-identifier';
import type { TsStringLiteral } from './expressions/string-literal';

export type TsPropertyName =
  | TsBigIntLiteral
  | TsComputedPropertyName
  | TsIdentifier
  | TsNoSubstitutionTemplateLiteral
  | TsNumericLiteral
  | TsPrivateIdentifier
  | TsStringLiteral;
