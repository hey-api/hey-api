import type { TsNode, TsNodeBase } from '../base';
import { TsNodeKind } from '../kinds';

export interface TsJsxAttributes extends TsNodeBase {
  kind: TsNodeKind.JsxAttributes;
  properties: ReadonlyArray<TsNode>;
}

export function createJsxAttributes(properties: ReadonlyArray<TsNode>): TsJsxAttributes {
  return {
    kind: TsNodeKind.JsxAttributes,
    properties,
  };
}
