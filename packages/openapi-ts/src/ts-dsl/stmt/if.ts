import type { AnalysisContext, NodeName } from '@hey-api/codegen-core';

import { ts } from '../../ts-compiler';
import type { MaybeTsDsl } from '../base';
import { TsDsl } from '../base';
import type { DoExpr } from '../mixins/do';
import { DoMixin } from '../mixins/do';
import { BlockTsDsl } from './block';

export type IfCondition = NodeName | MaybeTsDsl<ts.Expression>;

const Mixed = DoMixin(TsDsl<ts.IfStatement>);

export class IfTsDsl extends Mixed {
  readonly '~dsl' = 'IfTsDsl';

  protected _condition?: IfCondition;
  protected _else?: Array<DoExpr>;

  constructor(condition?: IfCondition) {
    super();
    if (condition) this.condition(condition);
  }

  override analyze(ctx: AnalysisContext): void {
    super.analyze(ctx);
    ctx.analyze(this._condition);
    if (this._else) {
      ctx.pushScope();
      try {
        for (const stmt of this._else) {
          ctx.analyze(stmt);
        }
      } finally {
        ctx.popScope();
      }
    }
  }

  /** Returns true when all required builder calls are present. */
  get isValid(): boolean {
    return !this.missingRequiredCalls().length;
  }

  condition(condition: IfCondition): this {
    this._condition = condition;
    return this;
  }

  otherwise(...items: Array<DoExpr>): this {
    this._else = items;
    return this;
  }

  override toAst() {
    this.$validate();
    return ts.factory.createIfStatement(
      this.$node(this._condition),
      this.$node(new BlockTsDsl(...this._do).pretty()),
      this._else ? this.$node(new BlockTsDsl(...this._else).pretty()) : undefined,
    );
  }

  $validate(): asserts this is this & {
    _condition: IfCondition;
  } {
    const missing = this.missingRequiredCalls();
    if (!missing.length) return;
    throw new Error(`If statement missing ${missing.join(' and ')}`);
  }

  private missingRequiredCalls(): ReadonlyArray<string> {
    const missing: Array<string> = [];
    if (!this._condition) missing.push('.condition()');
    if (!this._do.length) missing.push('.do()');
    return missing;
  }
}
