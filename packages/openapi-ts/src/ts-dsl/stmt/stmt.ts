import type { AnalysisContext } from '@hey-api/codegen-core';

import { ts } from '../../ts-compiler';
import { TsDsl } from '../base';

const Mixed = TsDsl<ts.Statement>;

export class StmtTsDsl extends Mixed {
  readonly '~dsl' = 'StmtTsDsl';

  protected _inner: ts.Expression | ts.Statement | TsDsl<any>;

  constructor(inner: ts.Expression | ts.Statement | TsDsl<any>) {
    super();
    this._inner = inner;
  }

  override analyze(ctx: AnalysisContext): void {
    super.analyze(ctx);
    ctx.analyze(this._inner);
  }

  override toAst() {
    const node = this.$node(this._inner);
    return ts.isStatement(node) ? node : ts.factory.createExpressionStatement(node);
  }
}
