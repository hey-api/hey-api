import type { AnalysisContext, Node } from '@hey-api/codegen-core';

import type { ts } from '../../ts-compiler';
import { f } from '../utils/factories';
import type { BaseCtor, DropFirst, MixinCtor } from './types';

export interface AsMethods extends Node {
  /** Creates an `as` type assertion expression (e.g., `value as Type`). */
  as(...args: DropFirst<Parameters<typeof f.as>>): ReturnType<typeof f.as>;
}

export function AsMixin<T extends ts.Expression, TBase extends BaseCtor<T>>(Base: TBase) {
  abstract class As extends Base {
    override analyze(ctx: AnalysisContext): void {
      super.analyze(ctx);
    }

    protected as(...args: DropFirst<Parameters<typeof f.as>>): ReturnType<typeof f.as> {
      return f.as(this, ...args);
    }
  }

  return As as unknown as MixinCtor<TBase, AsMethods>;
}
