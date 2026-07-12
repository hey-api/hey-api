import type { TsNodeBase } from '../base';
import type { TsExpression } from '../expression';
import { createIdentifier } from '../expressions/identifier';
import { TsNodeKind } from '../kinds';
import type { TsPropertyName } from '../property-name';
import type { TsToken } from '../token';
import type { TsBindingName } from './binding-name';

export interface TsBindingElement extends TsNodeBase {
  dotDotDotToken?: TsToken;
  initializer?: TsExpression;
  kind: TsNodeKind.BindingElement;
  name: string | TsBindingName;
  propertyName?: TsPropertyName;
}

export function createBindingElement(
  dotDotDotToken: TsToken | undefined,
  propertyName: string | TsPropertyName | undefined,
  name: string | TsBindingName,
  initializer?: TsExpression,
): TsBindingElement {
  return {
    dotDotDotToken,
    initializer,
    kind: TsNodeKind.BindingElement,
    name,
    propertyName: typeof propertyName === 'string' ? createIdentifier(propertyName) : propertyName,
  };
}
