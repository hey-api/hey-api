import type { AnalysisContext, Node, NodeName, Ref } from '@hey-api/codegen-core';
import { ref } from '@hey-api/codegen-core';

import { py } from '../../py-compiler';
import type { MaybePyDsl } from '../base';
import type { BaseCtor, MixinCtor } from './types';

type DecoratorArg = MaybePyDsl<py.Expression>;
type DecoratorName = NodeName | MaybePyDsl<py.Expression>;

export interface DecoratorMethods extends Node {
  $decorators(): ReadonlyArray<py.Expression>;
  decorator(name: DecoratorName, ...args: ReadonlyArray<DecoratorArg>): this;
}

export function DecoratorMixin<T extends py.Node, TBase extends BaseCtor<T>>(Base: TBase) {
  abstract class Decorator extends Base {
    protected _decorators: Array<{
      args: ReadonlyArray<Ref<DecoratorArg>>;
      name: Ref<DecoratorName>;
    }> = [];

    override analyze(ctx: AnalysisContext): void {
      super.analyze(ctx);
      for (const decorator of this._decorators) {
        ctx.analyze(decorator.name);
        for (const arg of decorator.args) {
          ctx.analyze(arg);
        }
      }
    }

    protected decorator(name: DecoratorName, ...args: ReadonlyArray<DecoratorArg>): this {
      this._decorators.push({
        args: args.map((arg) => ref(arg)),
        name: ref(name),
      });
      return this;
    }

    protected $decorators(): ReadonlyArray<py.Expression> {
      return this._decorators.map((decorator) =>
        decorator.args.length
          ? py.factory.createCallExpression(
              this.$node(decorator.name),
              decorator.args.map((arg) => this.$node(arg)),
            )
          : this.$node(decorator.name),
      );
    }
  }

  return Decorator as unknown as MixinCtor<TBase, DecoratorMethods>;
}
