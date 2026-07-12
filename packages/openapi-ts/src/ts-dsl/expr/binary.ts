import type { AnalysisContext, NodeName, Ref } from '@hey-api/codegen-core';
import { ref } from '@hey-api/codegen-core';

import { ts } from '../../ts-compiler';
import type { MaybeTsDsl } from '../base';
import { TsDsl } from '../base';
import { AsMixin } from '../mixins/as';
import { ExprMixin } from '../mixins/expr';

type Expr = NodeName | MaybeTsDsl<ts.Expression>;
type Op = Operator | ts.BinaryOperator;
type Operator =
  | '!='
  | '!=='
  | '&&'
  | '*'
  | '+'
  | '-'
  | '/'
  | '<'
  | '<='
  | '='
  | '=='
  | '==='
  | '>'
  | '>='
  | '??'
  | '??='
  | '||';

const OPERATOR_TOKENS: Record<Operator, ts.BinaryOperator> = {
  '!=': ts.SyntaxKind.ExclamationEqualsToken,
  '!==': ts.SyntaxKind.ExclamationEqualsEqualsToken,
  '&&': ts.SyntaxKind.AmpersandAmpersandToken,
  '*': ts.SyntaxKind.AsteriskToken,
  '+': ts.SyntaxKind.PlusToken,
  '-': ts.SyntaxKind.MinusToken,
  '/': ts.SyntaxKind.SlashToken,
  '<': ts.SyntaxKind.LessThanToken,
  '<=': ts.SyntaxKind.LessThanEqualsToken,
  '=': ts.SyntaxKind.EqualsToken,
  '==': ts.SyntaxKind.EqualsEqualsToken,
  '===': ts.SyntaxKind.EqualsEqualsEqualsToken,
  '>': ts.SyntaxKind.GreaterThanToken,
  '>=': ts.SyntaxKind.GreaterThanEqualsToken,
  '??': ts.SyntaxKind.QuestionQuestionToken,
  '??=': ts.SyntaxKind.QuestionQuestionEqualsToken,
  '||': ts.SyntaxKind.BarBarToken,
};

const Mixed = AsMixin(ExprMixin(TsDsl<ts.BinaryExpression>));

export class BinaryTsDsl extends Mixed {
  readonly '~dsl' = 'BinaryTsDsl';

  protected _base: Ref<Expr>;
  protected _expr?: Ref<Expr>;
  protected _op?: Op;

  constructor(base: Expr, op?: Op, expr?: Expr) {
    super();
    this._base = ref(base);
    this._op = op;
    if (expr) this._expr = ref(expr);
  }

  override analyze(ctx: AnalysisContext): void {
    super.analyze(ctx);
    ctx.analyze(this._base);
    ctx.analyze(this._expr);
  }

  /** Returns true when all required builder calls are present. */
  get isValid(): boolean {
    return !this.missingRequiredCalls().length;
  }

  /** Logical AND — `this && expr` */
  and(expr: Expr): this {
    return this.opAndExpr('&&', expr);
  }

  /** Creates an assignment expression (e.g., `this = expr`). */
  assign(expr: Expr): this {
    return this.opAndExpr('=', expr);
  }

  /** Nullish coalescing — `this ?? expr` */
  coalesce(expr: Expr): this {
    return this.opAndExpr('??', expr);
  }

  /** Division — `this / expr` */
  div(expr: Expr): this {
    return this.opAndExpr('/', expr);
  }

  /** Strict equality — `this === expr` */
  eq(expr: Expr): this {
    return this.opAndExpr('===', expr);
  }

  /** Greater than — `this > expr` */
  gt(expr: Expr): this {
    return this.opAndExpr('>', expr);
  }

  /** Greater than or equal — `this >= expr` */
  gte(expr: Expr): this {
    return this.opAndExpr('>=', expr);
  }

  /** Loose equality — `this == expr` */
  looseEq(expr: Expr): this {
    return this.opAndExpr('==', expr);
  }

  /** Loose inequality — `this != expr` */
  looseNeq(expr: Expr): this {
    return this.opAndExpr('!=', expr);
  }

  /** Less than — `this < expr` */
  lt(expr: Expr): this {
    return this.opAndExpr('<', expr);
  }

  /** Less than or equal — `this <= expr` */
  lte(expr: Expr): this {
    return this.opAndExpr('<=', expr);
  }

  /** Subtraction — `this - expr` */
  minus(expr: Expr): this {
    return this.opAndExpr('-', expr);
  }

  /** Strict inequality — `this !== expr` */
  neq(expr: Expr): this {
    return this.opAndExpr('!==', expr);
  }

  /** Nullish assignment — `this ??= expr` */
  nullishAssign(expr: Expr): this {
    return this.opAndExpr('??=', expr);
  }

  /** Logical OR — `this || expr` */
  or(expr: Expr): this {
    return this.opAndExpr('||', expr);
  }

  /** Addition — `this + expr` */
  plus(expr: Expr): this {
    return this.opAndExpr('+', expr);
  }

  /** Multiplication — `this * expr` */
  times(expr: Expr): this {
    return this.opAndExpr('*', expr);
  }

  override toAst() {
    this.$validate();
    const base = this.$node(this._base);
    const op = this._op as Op;
    const operator =
      op in OPERATOR_TOKENS ? this.opToToken(op as Operator) : (op as ts.BinaryOperator);
    return ts.factory.createBinaryExpression(base, operator, this.$node(this._expr));
  }

  $validate(): asserts this is this & {
    _expr: Ref<Expr>;
    _op: Op;
  } {
    const missing = this.missingRequiredCalls();
    if (!missing.length) return;
    throw new Error(`Binary expression missing ${missing.join(' and ')}`);
  }

  private missingRequiredCalls(): ReadonlyArray<string> {
    const missing: Array<string> = [];
    if (!this._op) missing.push('operator (e.g., .eq(), .plus())');
    if (!this._expr) missing.push('right-hand expression');
    return missing;
  }

  /** Sets the binary operator and right-hand operand for this expression. */
  private opAndExpr(op: Op, expr: Expr): this {
    this._expr = ref(expr);
    this._op = op;
    return this;
  }

  private opToToken(op: Operator): ts.BinaryOperator | ts.BinaryOperatorToken {
    const token = OPERATOR_TOKENS[op];
    if (!token) {
      throw new Error(`Unsupported operator: ${op}`);
    }
    return token;
  }
}
