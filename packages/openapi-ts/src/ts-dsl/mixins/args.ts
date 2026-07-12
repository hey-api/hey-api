import type { AnalysisContext, Node, NodeName, Ref } from '@hey-api/codegen-core';
import { ref } from '@hey-api/codegen-core';

import type { ts } from '../../ts-compiler';
import type { MaybeTsDsl } from '../base';
import type { BaseCtor, MixinCtor } from './types';

type Arg = NodeName | MaybeTsDsl<ts.Expression | ts.SpreadElement>;

export interface ArgsMethods extends Node {
  /** Renders the arguments into an array of `Expression`s or `SpreadElement`s. */
  $args(): ReadonlyArray<ts.Expression | ts.SpreadElement>;
  /** Adds a single expression argument. */
  arg(arg: Arg | undefined): this;
  /** Adds one or more expression arguments. */
  args(...args: ReadonlyArray<Arg | undefined>): this;
}

/**
 * Adds `.arg()` and `.args()` for managing expression arguments in call-like nodes.
 */
export function ArgsMixin<T extends ts.Node, TBase extends BaseCtor<T>>(Base: TBase) {
  abstract class Args extends Base {
    protected _args: Array<Ref<Arg>> = [];

    override analyze(ctx: AnalysisContext): void {
      super.analyze(ctx);
      for (const arg of this._args) {
        ctx.analyze(arg);
      }
    }

    protected arg(arg: Arg | undefined): this {
      if (arg !== undefined) this._args.push(ref(arg));
      return this;
    }

    protected args(...args: ReadonlyArray<Arg | undefined>): this {
      this._args.push(
        ...args.filter((a): a is NonNullable<typeof a> => a !== undefined).map((a) => ref(a)),
      );
      return this;
    }

    protected $args(): ReadonlyArray<ts.Expression | ts.SpreadElement> {
      return this.$node(this._args).map((arg) => this.$node(arg));
    }
  }

  return Args as unknown as MixinCtor<TBase, ArgsMethods>;
}
