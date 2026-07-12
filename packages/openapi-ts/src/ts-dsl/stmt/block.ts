import type { AnalysisContext } from '@hey-api/codegen-core';

import { ts } from '../../ts-compiler';
import { TsDsl } from '../base';
import type { DoExpr } from '../mixins/do';
import { DoMixin } from '../mixins/do';
import { LayoutMixin } from '../mixins/layout';

const Mixed = DoMixin(LayoutMixin(TsDsl<ts.Block>));

export class BlockTsDsl extends Mixed {
  readonly '~dsl' = 'BlockTsDsl';

  constructor(...items: Array<DoExpr>) {
    super();
    this.do(...items);
  }

  override analyze(ctx: AnalysisContext) {
    super.analyze(ctx);
  }

  override toAst() {
    const statements = this.$do();
    return ts.factory.createBlock(statements, this.$multiline(statements.length));
  }
}
