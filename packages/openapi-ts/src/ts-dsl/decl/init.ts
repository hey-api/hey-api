import type { AnalysisContext } from '@hey-api/codegen-core';

import { ts } from '../../ts-compiler';
import { TsDsl } from '../base';
import { DecoratorMixin } from '../mixins/decorator';
import { DoMixin } from '../mixins/do';
import { DocMixin } from '../mixins/doc';
import { PrivateMixin, ProtectedMixin, PublicMixin } from '../mixins/modifiers';
import { ParamMixin } from '../mixins/param';
import { BlockTsDsl } from '../stmt/block';

const Mixed = DecoratorMixin(
  DoMixin(
    DocMixin(
      ParamMixin(PrivateMixin(ProtectedMixin(PublicMixin(TsDsl<ts.ConstructorDeclaration>)))),
    ),
  ),
);

export class InitTsDsl extends Mixed {
  readonly '~dsl' = 'InitTsDsl';

  constructor(fn?: (i: InitTsDsl) => void) {
    super();
    fn?.(this);
  }

  override analyze(ctx: AnalysisContext): void {
    ctx.pushScope();
    try {
      super.analyze(ctx);
    } finally {
      ctx.popScope();
    }
  }

  override toAst() {
    const node = ts.factory.createConstructorDeclaration(
      [...this.$decorators(), ...this.modifiers],
      this.$params(),
      this.$node(new BlockTsDsl(...this._do).pretty()),
    );
    return this.$docs(node);
  }
}
