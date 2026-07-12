import type { AnalysisContext } from '@hey-api/codegen-core';

import { ts } from '../../ts-compiler';
import { TsDsl } from '../base';

const Mixed = TsDsl<ts.Identifier>;

export class IdTsDsl extends Mixed {
  readonly '~dsl' = 'IdTsDsl';

  constructor(name: string) {
    super();
    this.name.set(name);
  }

  override analyze(ctx: AnalysisContext): void {
    super.analyze(ctx);
  }

  override toAst() {
    return ts.factory.createIdentifier(this.name.toString());
  }
}
