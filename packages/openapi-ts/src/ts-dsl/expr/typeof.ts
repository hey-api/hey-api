import type { AnalysisContext, NodeName } from '@hey-api/codegen-core';

import { ts } from '../../ts-compiler';
import type { MaybeTsDsl } from '../base';
import { TsDsl } from '../base';
import { OperatorMixin } from '../mixins/operator';
import { f } from '../utils/factories';

export type TypeOfExpr = NodeName | MaybeTsDsl<ts.Expression>;
export type TypeOfExprCtor = (expr: TypeOfExpr) => TypeOfExprTsDsl;

const Mixed = OperatorMixin(TsDsl<ts.TypeOfExpression>);

export class TypeOfExprTsDsl extends Mixed {
  readonly '~dsl' = 'TypeOfExprTsDsl';

  protected _expr: TypeOfExpr;

  constructor(expr: TypeOfExpr) {
    super();
    this._expr = expr;
  }

  override analyze(ctx: AnalysisContext): void {
    super.analyze(ctx);
    ctx.analyze(this._expr);
  }

  override toAst() {
    return ts.factory.createTypeOfExpression(this.$node(this._expr));
  }
}

f.typeofExpr.set((...args) => new TypeOfExprTsDsl(...args));
