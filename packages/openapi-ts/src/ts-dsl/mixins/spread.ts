import type { AnalysisContext, Node } from '@hey-api/codegen-core';

import type { ts } from '../../ts-compiler';
import { f } from '../utils/factories';
import type { BaseCtor, MixinCtor } from './types';

export interface SpreadMethods extends Node {
  /** Produces a spread element from the current expression (e.g., `...expr`). */
  spread(): ReturnType<typeof f.spread>;
}

export function SpreadMixin<T extends ts.Expression, TBase extends BaseCtor<T>>(Base: TBase) {
  abstract class Spread extends Base {
    override analyze(ctx: AnalysisContext): void {
      super.analyze(ctx);
    }

    protected spread(): ReturnType<typeof f.spread> {
      return f.spread(this);
    }
  }

  return Spread as unknown as MixinCtor<TBase, SpreadMethods>;
}
