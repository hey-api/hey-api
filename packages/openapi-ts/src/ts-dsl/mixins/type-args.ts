import type { AnalysisContext, Node, NodeName, Ref } from '@hey-api/codegen-core';
import { ref } from '@hey-api/codegen-core';

import type { ts } from '../../ts-compiler';
import type { MaybeTsDsl, TypeTsDsl } from '../base';
import type { BaseCtor, MixinCtor } from './types';

type Arg = NodeName | MaybeTsDsl<TypeTsDsl>;

export interface TypeArgsMethods extends Node {
  /** Returns the type arguments as an array of ts.TypeNode nodes. */
  $generics(): ReadonlyArray<ts.TypeNode> | undefined;
  /** Adds a single type argument (e.g., `string` in `Foo<string>`). */
  generic(arg: Arg): this;
  /** Adds type arguments (e.g., `Map<string, number>`). */
  generics(...args: ReadonlyArray<Arg>): this;
}

export function TypeArgsMixin<T extends ts.Node, TBase extends BaseCtor<T>>(Base: TBase) {
  abstract class TypeArgs extends Base {
    protected _generics: Array<Ref<Arg>> = [];

    override analyze(ctx: AnalysisContext): void {
      super.analyze(ctx);
      for (const g of this._generics) {
        ctx.analyze(g);
      }
    }

    protected generic(arg: Arg): this {
      this._generics.push(ref(arg));
      return this;
    }

    protected generics(...args: ReadonlyArray<Arg>): this {
      this._generics.push(...args.map((a) => ref(a)));
      return this;
    }

    protected $generics(): ReadonlyArray<ts.TypeNode> | undefined {
      return this.$type(this._generics);
    }
  }

  return TypeArgs as unknown as MixinCtor<TBase, TypeArgsMethods>;
}
