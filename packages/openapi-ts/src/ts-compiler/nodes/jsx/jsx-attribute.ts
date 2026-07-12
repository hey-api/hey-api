import type { TsNode, TsNodeBase } from '../base';
import type { TsIdentifier } from '../expressions/identifier';
import { TsNodeKind } from '../kinds';
import type { TsJsxNamespacedName } from './jsx-namespaced-name';

export interface TsJsxAttribute extends TsNodeBase {
  initializer?: TsNode;
  kind: TsNodeKind.JsxAttribute;
  name: TsIdentifier | TsJsxNamespacedName;
}

export function createJsxAttribute(
  name: TsIdentifier | TsJsxNamespacedName,
  initializer: TsNode | undefined,
): TsJsxAttribute {
  return {
    initializer,
    kind: TsNodeKind.JsxAttribute,
    name,
  };
}
