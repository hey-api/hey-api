import type { TsNodeBase } from '../base';
import type { TsIdentifier } from '../expressions/identifier';
import { TsNodeKind } from '../kinds';

export interface TsJsxNamespacedName extends TsNodeBase {
  kind: TsNodeKind.JsxNamespacedName;
  name: TsIdentifier;
  namespace: TsIdentifier;
}

export function createJsxNamespacedName(
  namespace: TsIdentifier,
  name: TsIdentifier,
): TsJsxNamespacedName {
  return {
    kind: TsNodeKind.JsxNamespacedName,
    name,
    namespace,
  };
}
