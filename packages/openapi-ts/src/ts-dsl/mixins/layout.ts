import type { AnalysisContext, Node } from '@hey-api/codegen-core';

import type { ts } from '../../ts-compiler';
import type { BaseCtor, MixinCtor } from './types';

export interface LayoutMethods extends Node {
  /** Computes whether output should be multiline based on layout setting and element count. */
  $multiline(count: number): boolean;
  /** Sets automatic line output with optional threshold (default: 3). */
  auto(threshold?: number): this;
  /** Sets single line output. */
  inline(): this;
  /** Sets multi line output. */
  pretty(): this;
}

export function LayoutMixin<T extends ts.Node, TBase extends BaseCtor<T>>(Base: TBase) {
  abstract class Layout extends Base {
    protected static readonly DEFAULT_THRESHOLD = 3;
    protected layout: boolean | number | undefined;

    override analyze(ctx: AnalysisContext): void {
      super.analyze(ctx);
    }

    protected auto(threshold: number = Layout.DEFAULT_THRESHOLD): this {
      this.layout = threshold;
      return this;
    }

    protected inline(): this {
      this.layout = false;
      return this;
    }

    protected pretty(): this {
      this.layout = true;
      return this;
    }

    protected $multiline(count: number): boolean {
      if (this.layout === undefined) {
        this.layout = Layout.DEFAULT_THRESHOLD;
      }
      if (count === 0) return false;
      return typeof this.layout === 'number' ? count >= this.layout : this.layout;
    }
  }

  return Layout as unknown as MixinCtor<TBase, LayoutMethods>;
}
