import type { TsNodeBase } from '../base';
import { TsNodeKind } from '../kinds';
import type { TsBindingElement } from './binding-element';

export interface TsObjectBindingPattern extends TsNodeBase {
  elements: ReadonlyArray<TsBindingElement>;
  kind: TsNodeKind.ObjectBindingPattern;
}

export function createObjectBindingPattern(
  elements: ReadonlyArray<TsBindingElement>,
): TsObjectBindingPattern {
  return {
    elements,
    kind: TsNodeKind.ObjectBindingPattern,
  };
}
