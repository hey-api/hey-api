import type { AnalysisContext } from '@hey-api/codegen-core';

import type { ts } from '../../ts-compiler';
import { TsDsl } from '../base';
import type { TsDslContext } from './context';
import { ctx } from './context';

export type LazyThunk<T extends ts.Node> = (ctx: TsDslContext) => TsDsl<T>;

export class LazyTsDsl<T extends ts.Node = ts.Node> extends TsDsl<T> {
  readonly '~dsl' = 'LazyTsDsl';

  private _thunk: LazyThunk<T>;
  private _result?: TsDsl<T>;

  constructor(thunk: LazyThunk<T>) {
    super();
    this._thunk = thunk;
  }

  override analyze(ctx: AnalysisContext): void {
    super.analyze(ctx);
    ctx.analyze(this.toResult());
  }

  toResult(): TsDsl<T> {
    this._result ??= this._thunk(ctx);
    return this._result;
  }

  override toAst() {
    return this.toResult().toAst();
  }
}
