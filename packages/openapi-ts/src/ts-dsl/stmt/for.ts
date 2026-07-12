import type { AnalysisContext } from '@hey-api/codegen-core';

import { ts } from '../../ts-compiler';
import type { MaybeTsDsl } from '../base';
import { TsDsl } from '../base';
import { DoMixin } from '../mixins/do';
import { LayoutMixin } from '../mixins/layout';
import { BlockTsDsl } from './block';
import type { VarTsDsl } from './var';

export type ForMode = 'for' | 'in' | 'of';
export type ForCondition = MaybeTsDsl<ts.Expression>;
export type ForIterable = MaybeTsDsl<ts.Expression>;

const Mixed = DoMixin(LayoutMixin(TsDsl<ts.ForStatement>));

class ImplForTsDsl<M extends ForMode = 'for'> extends Mixed {
  readonly '~dsl' = 'ForTsDsl';

  protected _await?: boolean;
  protected _condition?: ForCondition;
  protected _iterableOrUpdate?: ForIterable;
  protected _mode: ForMode = 'for';
  protected _variableOrInit?: VarTsDsl;

  constructor();
  constructor(
    variableOrInit?: VarTsDsl,
    modeOrCondition?: ForMode | ForCondition,
    iterableOrUpdate?: ForIterable,
  ) {
    super();
    this._iterableOrUpdate = iterableOrUpdate;
    this._variableOrInit = variableOrInit;
    if (typeof modeOrCondition === 'string') {
      this._mode = modeOrCondition ?? 'for';
    } else {
      this._condition = modeOrCondition;
    }
  }

  override analyze(ctx: AnalysisContext): void {
    ctx.analyze(this._condition);
    ctx.analyze(this._iterableOrUpdate);
    ctx.pushScope();
    ctx.analyze(this._variableOrInit);
    try {
      super.analyze(ctx);
    } finally {
      ctx.popScope();
    }
  }

  /** Returns true when all required builder calls are present. */
  get isValid(): boolean {
    return !this.missingRequiredCalls().length;
  }

  /** Enables async iteration (`for await...of`). Can only be called on for...of. */
  await(): ForTsDsl<'of'> {
    this._await = true;
    this.of();
    return this as unknown as ForTsDsl<'of'>;
  }

  /** Sets the condition (e.g., `i < n`). */
  condition(condition: ForCondition): this {
    this._condition = condition;
    return this;
  }

  /** Sets the iteration variable (e.g., `$.const('item')`). */
  each(variable: VarTsDsl): this {
    this._variableOrInit = variable;
    return this;
  }

  /** Sets the object to iterate over and switches to for...in. */
  in(iterable?: ForIterable): ForTsDsl<'in'> {
    this._mode = 'in';
    if (iterable !== undefined) this.iterable(iterable);
    return this as unknown as ForTsDsl<'in'>;
  }

  /** Sets the initialization (e.g., `let i = 0`). */
  init(init: VarTsDsl): this {
    this._variableOrInit = init;
    return this;
  }

  /** Sets the iterable to iterate over. */
  iterable(iterable: ForIterable): this {
    this._iterableOrUpdate = iterable;
    return this;
  }

  /** Sets the iterable to iterate over and switches to for...of. */
  of(iterable?: ForIterable): ForTsDsl<'of'> {
    this._mode = 'of';
    if (iterable !== undefined) this.iterable(iterable);
    return this as unknown as ForTsDsl<'of'>;
  }

  /** Sets the update expression (e.g., `i++`). */
  update(update: ForIterable): this {
    this._iterableOrUpdate = update;
    return this;
  }

  // @ts-expect-error --- need to fix types ---
  override toAst(): M extends 'for'
    ? ts.ForStatement
    : M extends 'of'
      ? ts.ForOfStatement
      : ts.ForInStatement {
    this.$validate();
    const body = this.$node(new BlockTsDsl(...this._do).pretty());

    if (this._mode === 'of') {
      return ts.factory.createForOfStatement(
        this._await ? ts.factory.createToken(ts.SyntaxKind.AwaitKeyword) : undefined,
        this.$node(this._variableOrInit).declarationList,
        this.$node(this._iterableOrUpdate),
        body,
      ) as any;
    }

    if (this._mode === 'in') {
      return ts.factory.createForInStatement(
        this.$node(this._variableOrInit).declarationList,
        this.$node(this._iterableOrUpdate),
        body,
      ) as any;
    }

    const init = this.$node(this._variableOrInit);
    return ts.factory.createForStatement(
      init && ts.isVariableStatement(init) ? init.declarationList : init,
      this.$node(this._condition),
      this.$node(this._iterableOrUpdate),
      body,
    ) as any;
  }

  $validate(): asserts this is this & {
    _iterableOrUpdate: ForIterable;
    _variableOrInit: VarTsDsl;
  } {
    const missing = this.missingRequiredCalls();
    if (!missing.length) return;
    throw new Error(
      `For${this._mode === 'for' ? '' : `...${this._mode}`} statement missing ${missing.join(' and ')}`,
    );
  }

  private missingRequiredCalls(): ReadonlyArray<string> {
    const missing: Array<string> = [];
    if (this._mode !== 'for') {
      if (!this._variableOrInit) missing.push('.each()');
      if (!this._iterableOrUpdate) missing.push('.iterable()');
    }
    return missing;
  }
}

export const ForTsDsl = ImplForTsDsl as {
  new (variableOrInit?: VarTsDsl): ForTsDsl<ForMode>;
  new (
    variableOrInit: VarTsDsl,
    condition: ForCondition,
    iterableOrUpdate?: ForIterable,
  ): ForTsDsl<'for'>;
  new <T extends ForMode>(
    variableOrInit: VarTsDsl,
    mode: T,
    iterableOrUpdate?: ForIterable,
  ): ForTsDsl<T>;
} & typeof ImplForTsDsl;
export type ForTsDsl<M extends ForMode = 'for'> = ImplForTsDsl<M>;
