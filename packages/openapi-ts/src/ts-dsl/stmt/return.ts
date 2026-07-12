import type { AnalysisContext, NodeName, Ref } from '@hey-api/codegen-core';
import { ref } from '@hey-api/codegen-core';

import { ts } from '../../ts-compiler';
import type { MaybeTsDsl } from '../base';
import { TsDsl } from '../base';
import { f } from '../utils/factories';

export type ReturnExpr = NodeName | MaybeTsDsl<ts.Expression>;
export type ReturnCtor = (expr?: ReturnExpr) => ReturnTsDsl;

const Mixed = TsDsl<ts.ReturnStatement>;

export class ReturnTsDsl extends Mixed {
  readonly '~dsl' = 'ReturnTsDsl';

  protected _returnExpr?: Ref<ReturnExpr>;

  constructor(expr?: ReturnExpr) {
    super();
    if (expr) this._returnExpr = ref(expr);
  }

  override analyze(ctx: AnalysisContext): void {
    super.analyze(ctx);
    ctx.analyze(this._returnExpr);
  }

  override toAst() {
    return ts.factory.createReturnStatement(this.$node(this._returnExpr));
  }
}

f.return.set((...args) => new ReturnTsDsl(...args));
