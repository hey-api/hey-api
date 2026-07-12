import type { AnalysisContext } from '@hey-api/codegen-core';

import { ts } from '../../ts-compiler';
import type { MaybeTsDsl } from '../base';
import { TsDsl } from '../base';
import { AsMixin } from '../mixins/as';
import { ExprMixin } from '../mixins/expr';
import { LayoutMixin } from '../mixins/layout';
import { SpreadMixin } from '../mixins/spread';
import { LiteralTsDsl } from './literal';

export type ArrayExpr = string | number | boolean | MaybeTsDsl<ts.Expression>;

const Mixed = AsMixin(ExprMixin(LayoutMixin(SpreadMixin(TsDsl<ts.ArrayLiteralExpression>))));

export class ArrayTsDsl extends Mixed {
  readonly '~dsl' = 'ArrayTsDsl';

  protected _elements: Array<MaybeTsDsl<ts.Expression>> = [];

  constructor(...exprs: Array<ArrayExpr>) {
    super();
    this.elements(...exprs);
  }

  override analyze(ctx: AnalysisContext): void {
    super.analyze(ctx);
    for (const item of this._elements) {
      ctx.analyze(item);
    }
  }

  /** Adds a single array element. */
  element(expr: ArrayExpr): this {
    const node =
      typeof expr === 'string' || typeof expr === 'number' || typeof expr === 'boolean'
        ? new LiteralTsDsl(expr)
        : expr;
    this._elements.push(node);
    return this;
  }

  /** Adds multiple array elements. */
  elements(...exprs: ReadonlyArray<ArrayExpr>): this {
    for (const expr of exprs) this.element(expr);
    return this;
  }

  override toAst() {
    return ts.factory.createArrayLiteralExpression(
      this._elements.map((item) => this.$node(item)),
      this.$multiline(this._elements.length),
    );
  }
}
