import type { AnalysisContext } from '@hey-api/codegen-core';

import { ts } from '../../ts-compiler';
import type { MaybeTsDsl } from '../base';
import { TsDsl } from '../base';

export type PrefixExpr = string | MaybeTsDsl<ts.Expression>;
export type PrefixOp = ts.PrefixUnaryOperator;

const Mixed = TsDsl<ts.PrefixUnaryExpression>;

export class PrefixTsDsl extends Mixed {
  readonly '~dsl' = 'PrefixTsDsl';

  protected _expr?: PrefixExpr;
  protected _op?: PrefixOp;

  constructor(expr?: PrefixExpr, op?: PrefixOp) {
    super();
    this._expr = expr;
    this._op = op;
  }

  override analyze(ctx: AnalysisContext): void {
    super.analyze(ctx);
    ctx.analyze(this._expr);
  }

  /** Returns true when all required builder calls are present. */
  get isValid(): boolean {
    return !this.missingRequiredCalls().length;
  }

  /** Sets the operand (the expression being prefixed). */
  expr(expr: PrefixExpr): this {
    this._expr = expr;
    return this;
  }

  /** Sets the operator to MinusToken for negation (`-`). */
  neg(): this {
    this._op = ts.SyntaxKind.MinusToken;
    return this;
  }

  /** Sets the operator to ExclamationToken for logical NOT (`!`). */
  not(): this {
    this._op = ts.SyntaxKind.ExclamationToken;
    return this;
  }

  /** Sets the operator (e.g., `ts.SyntaxKind.ExclamationToken` for `!`). */
  op(op: PrefixOp): this {
    this._op = op;
    return this;
  }

  override toAst() {
    this.$validate();
    return ts.factory.createPrefixUnaryExpression(this._op, this.$node(this._expr));
  }

  $validate(): asserts this is this & {
    _expr: PrefixExpr;
    _op: PrefixOp;
  } {
    const missing = this.missingRequiredCalls();
    if (!missing.length) return;
    throw new Error(`Prefix unary expression missing ${missing.join(' and ')}`);
  }

  private missingRequiredCalls(): ReadonlyArray<string> {
    const missing: Array<string> = [];
    if (!this._expr) missing.push('.expr()');
    if (!this._op) missing.push('operator (e.g., .not(), .neg())');
    return missing;
  }
}
