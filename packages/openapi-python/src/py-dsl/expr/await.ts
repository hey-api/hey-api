import type { AnalysisContext, Ref } from '@hey-api/codegen-core';
import { ref } from '@hey-api/codegen-core';

import { py } from '../../py-compiler';
import type { MaybePyDsl } from '../base';
import { PyDsl } from '../base';
import { ExprMixin } from '../mixins/expr';

export type AwaitExpr = MaybePyDsl<py.Expression>;
export type AwaitCtor = (expr: AwaitExpr) => AwaitPyDsl;

const Mixed = ExprMixin(PyDsl<py.AwaitExpression>);

export class AwaitPyDsl extends Mixed {
  readonly '~dsl' = 'AwaitPyDsl';

  protected expr: Ref<AwaitExpr>;

  constructor(expr: AwaitExpr) {
    super();
    this.expr = ref(expr);
  }

  override analyze(ctx: AnalysisContext): void {
    super.analyze(ctx);
    ctx.analyze(this.expr);
  }

  override toAst() {
    return py.factory.createAwaitExpression(this.$node(this.expr));
  }
}
