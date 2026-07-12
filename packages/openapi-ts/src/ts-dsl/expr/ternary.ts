import type { AnalysisContext } from '@hey-api/codegen-core';

import { ts } from '../../ts-compiler';
import type { MaybeTsDsl } from '../base';
import { TsDsl } from '../base';

const Mixed = TsDsl<ts.ConditionalExpression>;

export class TernaryTsDsl extends Mixed {
  readonly '~dsl' = 'TernaryTsDsl';

  protected _condition?: string | MaybeTsDsl<ts.Expression>;
  protected _then?: string | MaybeTsDsl<ts.Expression>;
  protected _else?: string | MaybeTsDsl<ts.Expression>;

  constructor(condition?: string | MaybeTsDsl<ts.Expression>) {
    super();
    if (condition) this.condition(condition);
  }

  override analyze(ctx: AnalysisContext): void {
    super.analyze(ctx);
    ctx.analyze(this._condition);
    ctx.analyze(this._then);
    ctx.analyze(this._else);
  }

  /** Returns true when all required builder calls are present. */
  get isValid(): boolean {
    return !this.missingRequiredCalls().length;
  }

  condition(condition: string | MaybeTsDsl<ts.Expression>) {
    this._condition = condition;
    return this;
  }

  do(expr: string | MaybeTsDsl<ts.Expression>) {
    this._then = expr;
    return this;
  }

  otherwise(expr: string | MaybeTsDsl<ts.Expression>) {
    this._else = expr;
    return this;
  }

  override toAst() {
    this.$validate();
    return ts.factory.createConditionalExpression(
      this.$node(this._condition),
      undefined,
      this.$node(this._then),
      undefined,
      this.$node(this._else),
    );
  }

  $validate(): asserts this is this & {
    _condition: string | MaybeTsDsl<ts.Expression>;
    _else: string | MaybeTsDsl<ts.Expression>;
    _then: string | MaybeTsDsl<ts.Expression>;
  } {
    const missing = this.missingRequiredCalls();
    if (!missing.length) return;
    throw new Error(`Ternary expression missing ${missing.join(' and ')}`);
  }

  private missingRequiredCalls(): ReadonlyArray<string> {
    const missing: Array<string> = [];
    if (!this._condition) missing.push('.condition()');
    if (!this._then) missing.push('.do()');
    if (!this._else) missing.push('.otherwise()');
    return missing;
  }
}
