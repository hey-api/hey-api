import type { TsIdentifier } from '../expressions/identifier';
import type { TsArrayBindingPattern } from './array-binding-pattern';
import type { TsObjectBindingPattern } from './object-binding-pattern';

export type TsBindingName = TsBindingPattern | TsIdentifier;

export type TsBindingPattern = TsArrayBindingPattern | TsObjectBindingPattern;
