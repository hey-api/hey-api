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

export type CallArgs = ReadonlyArray<CallCallee | undefined>;
export type CallCallee = NodeName | MaybeTsDsl<ts.Expression>;
export type CallCtor = (callee: CallCallee, ...args: CallArgs) => CallTsDsl;

const Mixed = ArgsMixin(AsMixin(ExprMixin(SpreadMixin(TypeArgsMixin(TsDsl<ts.CallExpression>)))));

export class CallTsDsl extends Mixed {
  readonly '~dsl' = 'CallTsDsl';

  protected _callee: Ref<CallCallee>;

  constructor(callee: CallCallee, ...args: CallArgs) {
    super();
    this._callee = ref(callee);
    this.args(...args);
  }

  override analyze(ctx: AnalysisContext): void {
    super.analyze(ctx);
    ctx.analyze(this._callee);
  }

  override toAst() {
    return ts.factory.createCallExpression(
      this.$node(this._callee),
      this.$generics(),
      this.$args(),
    );
  }
}

f.call.set((...args) => new CallTsDsl(...args));
