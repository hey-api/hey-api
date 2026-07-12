import type { AnalysisContext, NodeName, Ref } from '@hey-api/codegen-core';
import { isNode, isSymbol, ref } from '@hey-api/codegen-core';

import type { ts } from '../../ts-compiler';
import type { MaybeTsDsl } from '../base';
import { TsDsl } from '../base';
import { AsMixin } from '../mixins/as';
import { ExprMixin } from '../mixins/expr';
import { OperatorMixin } from '../mixins/operator';
import { SpreadMixin } from '../mixins/spread';
import { TypeExprMixin } from '../mixins/type-expr';

type Id = NodeName | MaybeTsDsl<ts.Expression>;

const Mixed = AsMixin(ExprMixin(OperatorMixin(SpreadMixin(TypeExprMixin(TsDsl<ts.Expression>)))));

export class ExprTsDsl extends Mixed {
  readonly '~dsl' = 'ExprTsDsl';

  protected _exprInput: Ref<Id>;

  constructor(id: Id) {
    super();
    this._exprInput = ref(id);
    if (typeof id === 'string' || isSymbol(id)) {
      this.name.set(id);
    } else if (isNode(id)) {
      this.name.set(id.name);
    }
  }

  override analyze(ctx: AnalysisContext): void {
    super.analyze(ctx);
    ctx.analyze(this._exprInput);
  }

  override toAst() {
    return this.$node(this._exprInput);
  }
}
