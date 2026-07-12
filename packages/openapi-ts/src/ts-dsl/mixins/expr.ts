import type { AnalysisContext, Node } from '@hey-api/codegen-core';

import type { ts } from '../../ts-compiler';
import { f } from '../utils/factories';
import type { BaseCtor, DropFirst, MixinCtor } from './types';

export interface ExprMethods extends Node {
  /** Accesses a property on the current expression (e.g., `this.foo`). */
  attr(...args: DropFirst<Parameters<typeof f.attr>>): ReturnType<typeof f.attr>;
  /** Awaits the current expression (e.g., `await expr`). */
  await(): ReturnType<typeof f.await>;
  /** Calls the current expression (e.g., `fn(arg1, arg2)`). */
  call(...args: DropFirst<Parameters<typeof f.call>>): ReturnType<typeof f.call>;
  /** Produces a `return` statement returning the current expression. */
  return(): ReturnType<typeof f.return>;
}

export function ExprMixin<T extends ts.Expression, TBase extends BaseCtor<T>>(Base: TBase) {
  abstract class Expr extends Base {
    override analyze(ctx: AnalysisContext): void {
      super.analyze(ctx);
    }

    protected attr(...args: DropFirst<Parameters<typeof f.attr>>): ReturnType<typeof f.attr> {
      return f.attr(this, ...args);
    }

    protected await(): ReturnType<typeof f.await> {
      return f.await(this);
    }

    protected call(...args: DropFirst<Parameters<typeof f.call>>): ReturnType<typeof f.call> {
      return f.call(this, ...args);
    }

    protected return(): ReturnType<typeof f.return> {
      return f.return(this);
    }
  }

  return Expr as unknown as MixinCtor<TBase, ExprMethods>;
}
