import type { TsNodeBase } from '../base';
import type { TsExpression } from '../expression';
import { TsNodeKind } from '../kinds';
import type { TsPropertyName } from '../property-name';
import { SyntaxKind } from '../syntax-kind';
import type { TsToken } from '../token';
import type { TsTypeNode } from '../type';
import type { TsModifierLike } from './modifier-like';

export interface TsPropertyDeclaration extends TsNodeBase {
  exclamationToken?: TsToken;
  initializer?: TsExpression;
  kind: TsNodeKind.PropertyDeclaration;
  modifiers?: ReadonlyArray<TsModifierLike>;
  name: string | TsPropertyName;
  questionToken?: TsToken;
  type?: TsTypeNode;
}

export function createPropertyDeclaration(
  modifiers: ReadonlyArray<TsModifierLike> | undefined,
  name: string | TsPropertyName,
  questionOrExclamationToken: TsToken | undefined,
  type: TsTypeNode | undefined,
  initializer: TsExpression | undefined,
): TsPropertyDeclaration {
  return {
    exclamationToken:
      questionOrExclamationToken?.syntaxKind === SyntaxKind.ExclamationToken
        ? questionOrExclamationToken
        : undefined,
    initializer,
    kind: TsNodeKind.PropertyDeclaration,
    modifiers,
    name,
    questionToken:
      questionOrExclamationToken?.syntaxKind === SyntaxKind.QuestionToken
        ? questionOrExclamationToken
        : undefined,
    type,
  };
}
