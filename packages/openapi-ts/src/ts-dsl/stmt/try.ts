import type { AnalysisContext, NodeName } from '@hey-api/codegen-core';

import { ts } from '../../ts-compiler';
import { TsDsl } from '../base';
import type { DoExpr } from '../mixins/do';
import { BlockTsDsl } from './block';

const Mixed = TsDsl<ts.TryStatement>;

export class TryTsDsl extends Mixed {
  readonly '~dsl' = 'TryTsDsl';

  protected _catch?: Array<DoExpr>;
  protected _catchArg?: NodeName;
  protected _finally?: Array<DoExpr>;
  protected _try?: Array<DoExpr>;

  constructor(...tryBlock: Array<DoExpr>) {
    super();
    this.try(...tryBlock);
  }

  override analyze(ctx: AnalysisContext): void {
    super.analyze(ctx);

    if (this._try) {
      ctx.pushScope();
      try {
        for (const stmt of this._try) ctx.analyze(stmt);
      } finally {
        ctx.popScope();
      }
    }

    if (this._catch || this._catchArg) {
      ctx.pushScope();
      try {
        ctx.analyze(this._catchArg);
        if (this._catch) {
          for (const stmt of this._catch) ctx.analyze(stmt);
        }
      } finally {
        ctx.popScope();
      }
    }

    if (this._finally) {
      ctx.pushScope();
      try {
        for (const stmt of this._finally) ctx.analyze(stmt);
      } finally {
        ctx.popScope();
      }
    }
  }

  /** Returns true when all required builder calls are present. */
  get isValid(): boolean {
    return !this.missingRequiredCalls().length;
  }

  catch(...items: Array<DoExpr>): this {
    this._catch = items;
    return this;
  }

  catchArg(arg: NodeName): this {
    this._catchArg = arg;
    return this;
  }

  finally(...items: Array<DoExpr>): this {
    this._finally = items;
    return this;
  }

  try(...items: Array<DoExpr>): this {
    this._try = items;
    return this;
  }

  override toAst() {
    this.$validate();
    const catchParam = this._catchArg ? (this.$node(this._catchArg) as ts.BindingName) : undefined;

    return ts.factory.createTryStatement(
      this.$node(new BlockTsDsl(...this._try).pretty()),
      ts.factory.createCatchClause(
        catchParam ? ts.factory.createVariableDeclaration(catchParam) : undefined,
        this.$node(new BlockTsDsl(...(this._catch ?? [])).pretty()),
      ),
      this._finally ? this.$node(new BlockTsDsl(...this._finally).pretty()) : undefined,
    );
  }

  $validate(): asserts this is this & {
    _try: Array<DoExpr>;
  } {
    const missing = this.missingRequiredCalls();
    if (!missing.length) return;
    throw new Error(`Try statement missing ${missing.join(' and ')}`);
  }

  private missingRequiredCalls(): ReadonlyArray<string> {
    const missing: Array<string> = [];
    if (!this._try || !this._try.length) missing.push('.try()');
    return missing;
  }
}
