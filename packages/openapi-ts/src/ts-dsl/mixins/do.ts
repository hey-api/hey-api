import type { AnalysisContext, Node } from '@hey-api/codegen-core';

import type { ts } from '../../ts-compiler';
import type { MaybeTsDsl } from '../base';
import { StmtTsDsl } from '../stmt/stmt';
import type { BaseCtor, MixinCtor } from './types';

export type DoExpr = MaybeTsDsl<ts.Expression | ts.Statement>;

export interface DoMethods extends Node {
  /** Renders the collected `.do()` calls into an array of `Statement` nodes. */
  $do(): ReadonlyArray<ts.Statement>;
  _do: Array<DoExpr>;
  /** Adds one or more expressions/statements to the body. */
  do(...items: ReadonlyArray<DoExpr>): this;
}

/**
 * Adds `.do()` for appending statements or expressions to a body.
 */
export function DoMixin<T extends ts.Node, TBase extends BaseCtor<T>>(Base: TBase) {
  abstract class Do extends Base {
    protected _do: Array<DoExpr> = [];

    override analyze(ctx: AnalysisContext): void {
      super.analyze(ctx);
      ctx.pushScope();
      try {
        for (const item of this._do) {
          ctx.analyze(item);
        }
      } finally {
        ctx.popScope();
      }
    }

    protected do(...items: ReadonlyArray<DoExpr>): this {
      this._do.push(...items);
      return this;
    }

    protected $do(): ReadonlyArray<ts.Statement> {
      return this.$node(this._do.map((item) => new StmtTsDsl(item)));
    }
  }

  return Do as unknown as MixinCtor<TBase, DoMethods>;
}
