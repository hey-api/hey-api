import type { TsNodeBase } from '../base';
import { TsNodeKind } from '../kinds';
import type { TsStatement } from '../statement';
import type { TsModifierLike } from './modifier-like';
import type { TsParameterDeclaration } from './parameter-declaration';

export interface TsConstructorDeclaration extends TsNodeBase {
  body?: TsStatement;
  kind: TsNodeKind.Constructor;
  modifiers?: ReadonlyArray<TsModifierLike>;
  parameters: ReadonlyArray<TsParameterDeclaration>;
}

export function createConstructorDeclaration(
  modifiers: ReadonlyArray<TsModifierLike> | undefined,
  parameters: ReadonlyArray<TsParameterDeclaration>,
  body: TsStatement | undefined,
): TsConstructorDeclaration {
  return {
    body,
    kind: TsNodeKind.Constructor,
    modifiers,
    parameters,
  };
}
