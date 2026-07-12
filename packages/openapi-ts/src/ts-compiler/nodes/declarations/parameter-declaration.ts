import type { TsNodeBase } from '../base';
import type { TsExpression } from '../expression';
import { TsNodeKind } from '../kinds';
import type { TsToken } from '../token';
import type { TsTypeNode } from '../type';
import type { TsBindingName } from './binding-name';
import type { TsModifierLike } from './modifier-like';

export interface TsParameterDeclaration extends TsNodeBase {
  dotDotDotToken?: TsToken;
  initializer?: TsExpression;
  kind: TsNodeKind.Parameter;
  modifiers?: ReadonlyArray<TsModifierLike>;
  name: string | TsBindingName;
  questionToken?: TsToken;
  type?: TsTypeNode;
}

export function createParameterDeclaration(
  modifiers: ReadonlyArray<TsModifierLike> | undefined,
  dotDotDotToken: TsToken | undefined,
  name: string | TsBindingName,
  questionToken?: TsToken,
  type?: TsTypeNode,
  initializer?: TsExpression,
): TsParameterDeclaration {
  return {
    dotDotDotToken,
    initializer,
    kind: TsNodeKind.Parameter,
    modifiers,
    name,
    questionToken,
    type,
  };
}
