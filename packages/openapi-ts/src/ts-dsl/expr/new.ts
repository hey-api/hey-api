import type { AnalysisContext, NodeName, Ref } from '@hey-api/codegen-core';
import { ref } from '@hey-api/codegen-core';

import { ts } from '../../ts-compiler';
import type { MaybeTsDsl } from '../base';
import { TsDsl } from '../base';
import { ArgsMixin } from '../mixins/args';
import { AsMixin } from '../mixins/as';
import { ExprMixin } from '../mixins/expr';
import { SpreadMixin } from '../mixins/spread';
import { TypeArgsMixin } from '../mixins/type-args';
import { f } from '../utils/factories';

export type NewArgs = ReadonlyArray<NewExpr | undefined>;
export type NewExpr = NodeName | MaybeTsDsl<ts.Expression>;
export type NewCtor = (expr: NewExpr, ...args: NewArgs) => NewTsDsl;

const Mixed = ArgsMixin(AsMixin(ExprMixin(SpreadMixin(TypeArgsMixin(TsDsl<ts.NewExpression>)))));

export class NewTsDsl extends Mixed {
  readonly '~dsl' = 'NewTsDsl';

  protected _newExpr: Ref<NewExpr>;

  constructor(expr: NewExpr, ...args: NewArgs) {
    super();
    this._newExpr = ref(expr);
    this.args(...args);
  }

  override analyze(ctx: AnalysisContext): void {
    super.analyze(ctx);
    ctx.analyze(this._newExpr);
  }

  override toAst() {
    return ts.factory.createNewExpression(
      this.$node(this._newExpr),
      this.$generics(),
      this.$args(),
    );
  }
}

f.new.set((...args) => new NewTsDsl(...args));
