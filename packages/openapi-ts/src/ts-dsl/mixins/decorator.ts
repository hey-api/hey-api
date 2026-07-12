import type { AnalysisContext, Node, NodeName } from '@hey-api/codegen-core';

import type { ts } from '../../ts-compiler';
import type { MaybeTsDsl } from '../base';
import { DecoratorTsDsl } from '../decl/decorator';
import type { BaseCtor, MixinCtor } from './types';

export interface DecoratorMethods extends Node {
  /** Renders the decorators into an array of `ts.Decorator`s. */
  $decorators(): ReadonlyArray<ts.Decorator>;
  /** Adds a decorator (e.g., `@sealed({ in: 'root' })`). */
  decorator(
    name: NodeName | MaybeTsDsl<ts.Expression>,
    ...args: ReadonlyArray<string | MaybeTsDsl<ts.Expression>>
  ): this;
}

export function DecoratorMixin<T extends ts.Node, TBase extends BaseCtor<T>>(Base: TBase) {
  abstract class Decorator extends Base {
    protected decorators: Array<DecoratorTsDsl> = [];

    override analyze(ctx: AnalysisContext): void {
      super.analyze(ctx);
      for (const decorator of this.decorators) {
        ctx.analyze(decorator);
      }
    }

    protected decorator(
      name: NodeName,
      ...args: ReadonlyArray<string | MaybeTsDsl<ts.Expression>>
    ): this {
      this.decorators.push(new DecoratorTsDsl(name, ...args));
      return this;
    }

    protected $decorators(): ReadonlyArray<ts.Decorator> {
      return this.$node(this.decorators);
    }
  }

  return Decorator as unknown as MixinCtor<TBase, DecoratorMethods>;
}
