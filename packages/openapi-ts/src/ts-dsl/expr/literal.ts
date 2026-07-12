import type { AnalysisContext } from '@hey-api/codegen-core';

import { ts } from '../../ts-compiler';
import { TsDsl } from '../base';
import { PrefixTsDsl } from '../expr/prefix';
import { AsMixin } from '../mixins/as';

const Mixed = AsMixin(
  TsDsl<
    | ts.BigIntLiteral
    | ts.BooleanLiteral
    | ts.NullLiteral
    | ts.NumericLiteral
    | ts.PrefixUnaryExpression
    | ts.StringLiteral
  >,
);

export class LiteralTsDsl extends Mixed {
  readonly '~dsl' = 'LiteralTsDsl';

  protected value: ts.LiteralValue;

  constructor(value: ts.LiteralValue) {
    super();
    this.value = value;
  }

  override analyze(ctx: AnalysisContext): void {
    super.analyze(ctx);
  }

  override toAst() {
    if (typeof this.value === 'boolean') {
      return this.value ? ts.factory.createTrue() : ts.factory.createFalse();
    }
    if (typeof this.value === 'number') {
      const expr = ts.factory.createNumericLiteral(Math.abs(this.value));
      return this.value < 0 ? this.$node(new PrefixTsDsl(expr).neg()) : expr;
    }
    if (typeof this.value === 'string') {
      return ts.factory.createStringLiteral(this.value, true);
    }
    if (typeof this.value === 'bigint') {
      return ts.factory.createBigIntLiteral(this.value.toString());
    }
    if (this.value === null) {
      return ts.factory.createNull();
    }
    throw new Error(`Unsupported literal: ${String(this.value)}`);
  }
}
