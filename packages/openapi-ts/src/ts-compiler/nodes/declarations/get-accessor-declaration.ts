import type { TsNodeBase } from '../base';
import { TsNodeKind } from '../kinds';
import type { TsPropertyName } from '../property-name';
import type { TsStatement } from '../statement';
import type { TsTypeNode } from '../type';
import type { TsModifierLike } from './modifier-like';
import type { TsParameterDeclaration } from './parameter-declaration';

export interface TsGetAccessorDeclaration extends TsNodeBase {
  body?: TsStatement;
  kind: TsNodeKind.GetAccessor;
  modifiers?: ReadonlyArray<TsModifierLike>;
  name: string | TsPropertyName;
  parameters: ReadonlyArray<TsParameterDeclaration>;
  type?: TsTypeNode;
}

export function createGetAccessorDeclaration(
  modifiers: ReadonlyArray<TsModifierLike> | undefined,
  name: string | TsPropertyName,
  parameters: ReadonlyArray<TsParameterDeclaration>,
  type: TsTypeNode | undefined,
  body: TsStatement | undefined,
): TsGetAccessorDeclaration {
  return {
    body,
    kind: TsNodeKind.GetAccessor,
    modifiers,
    name,
    parameters,
    type,
  };
}
