import type { AnalysisContext, NodeName, Ref } from '@hey-api/codegen-core';
import { ref } from '@hey-api/codegen-core';

import { ts } from '../../ts-compiler';
import type { MaybeTsDsl } from '../base';
import { TsDsl } from '../base';
import { f } from '../utils/factories';

export type SpreadExpr = NodeName | MaybeTsDsl<ts.Expression>;
export type SpreadCtor = (expr: SpreadExpr) => SpreadTsDsl;

const Mixed = TsDsl<ts.SpreadElement>;

export class SpreadTsDsl extends Mixed {
  readonly '~dsl' = 'SpreadTsDsl';

  protected _expr: Ref<SpreadExpr>;

  constructor(expr: SpreadExpr) {
    super();
    this._expr = ref(expr);
  }

  override analyze(ctx: AnalysisContext): void {
    super.analyze(ctx);
    ctx.analyze(this._expr);
  }

  override toAst() {
    return ts.factory.createSpreadElement(this.$node(this._expr));
  }
}

f.spread.set((...args) => new SpreadTsDsl(...args));
