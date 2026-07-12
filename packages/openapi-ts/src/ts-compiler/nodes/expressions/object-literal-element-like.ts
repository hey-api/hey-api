import type { TsGetAccessorDeclaration } from '../declarations/get-accessor-declaration';
import type { TsMethodDeclaration } from '../declarations/method-declaration';
import type { TsSetAccessorDeclaration } from '../declarations/set-accessor-declaration';
import type { TsPropertyAssignment } from './property-assignment';
import type { TsShorthandPropertyAssignment } from './shorthand-property-assignment';
import type { TsSpreadAssignment } from './spread-assignment';

export type TsObjectLiteralElementLike =
  | TsGetAccessorDeclaration
  | TsMethodDeclaration
  | TsPropertyAssignment
  | TsSetAccessorDeclaration
  | TsShorthandPropertyAssignment
  | TsSpreadAssignment;
