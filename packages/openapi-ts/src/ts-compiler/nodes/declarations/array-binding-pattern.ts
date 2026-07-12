import type { TsNodeBase } from '../base';
import { TsNodeKind } from '../kinds';
import type { TsBindingElement } from './binding-element';

export type TsArrayBindingElement = TsBindingElement;

export interface TsArrayBindingPattern extends TsNodeBase {
  elements: ReadonlyArray<TsArrayBindingElement>;
  kind: TsNodeKind.ArrayBindingPattern;
}

export function createArrayBindingPattern(
  elements: ReadonlyArray<TsArrayBindingElement>,
): TsArrayBindingPattern {
  return {
    elements,
    kind: TsNodeKind.ArrayBindingPattern,
  };
}
