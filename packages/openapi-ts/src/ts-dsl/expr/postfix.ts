import type { AnalysisContext } from '@hey-api/codegen-core';

import { ts } from '../../ts-compiler';
import type { MaybeTsDsl } from '../base';
import { TsDsl } from '../base';

export type PostfixExpr = string | MaybeTsDsl<ts.Expression>;
export type PostfixOp = ts.PostfixUnaryOperator;

const Mixed = TsDsl<ts.PostfixUnaryExpression>;

export class PostfixTsDsl extends Mixed {
  readonly '~dsl' = 'PostfixTsDsl';

  protected _expr?: PostfixExpr;
  protected _op?: PostfixOp;

  constructor(expr?: PostfixExpr, op?: PostfixOp) {
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

  /** Sets the operator to MinusMinusToken for decrement (`--`). */
  dec(): this {
    this._op = ts.SyntaxKind.MinusMinusToken;
    return this;
  }

  /** Sets the operand (the expression being postfixed). */
  expr(expr: PostfixExpr): this {
    this._expr = expr;
    return this;
  }

  /** Sets the operator to PlusPlusToken for increment (`++`). */
  inc(): this {
    this._op = ts.SyntaxKind.PlusPlusToken;
    return this;
  }

  /** Sets the operator (e.g., `ts.SyntaxKind.PlusPlusToken` for `++`). */
  op(op: PostfixOp): this {
    this._op = op;
    return this;
  }

  override toAst() {
    this.$validate();
    return ts.factory.createPostfixUnaryExpression(this.$node(this._expr), this._op);
  }

  $validate(): asserts this is this & {
    _expr: PostfixExpr;
    _op: PostfixOp;
  } {
    const missing = this.missingRequiredCalls();
    if (!missing.length) return;
    throw new Error(`Postfix unary expression missing ${missing.join(' and ')}`);
  }

  private missingRequiredCalls(): ReadonlyArray<string> {
    const missing: Array<string> = [];
    if (!this._expr) missing.push('.expr()');
    if (!this._op) missing.push('operator (e.g., .inc(), .dec())');
    return missing;
  }
}
