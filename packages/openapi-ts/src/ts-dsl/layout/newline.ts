import type { AnalysisContext } from '@hey-api/codegen-core';

import type { ts } from '../../ts-compiler';
import { TsDsl } from '../base';
import { IdTsDsl } from '../expr/id';

export class NewlineTsDsl extends TsDsl<ts.Identifier> {
  readonly '~dsl' = 'NewlineTsDsl';

  override analyze(ctx: AnalysisContext): void {
    super.analyze(ctx);
  }

  override toAst() {
    return this.$node(new IdTsDsl('\n'));
  }
}
