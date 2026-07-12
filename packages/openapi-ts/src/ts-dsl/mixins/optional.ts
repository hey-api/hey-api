import type { AnalysisContext, Node } from '@hey-api/codegen-core';

import type { ts } from '../../ts-compiler';
import type { BaseCtor, MixinCtor } from './types';

export interface OptionalMethods extends Node {
  _optional?: boolean;
  /** Marks the node as optional when the condition is true. */
  optional(condition?: boolean): this;
  /** Marks the node as required when the condition is true. */
  required(condition?: boolean): this;
}

export function OptionalMixin<T extends ts.Node, TBase extends BaseCtor<T>>(Base: TBase) {
  abstract class Optional extends Base {
    protected _optional?: boolean;

    override analyze(ctx: AnalysisContext): void {
      super.analyze(ctx);
    }

    protected optional(condition?: boolean): this {
      this._optional = !arguments.length ? true : Boolean(condition);
      return this;
    }

    protected required(condition?: boolean): this {
      this._optional = !arguments.length ? false : !condition;
      return this;
    }
  }

  return Optional as unknown as MixinCtor<TBase, OptionalMethods>;
}
