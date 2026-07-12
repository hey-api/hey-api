import type { AnalysisContext, NodeName } from '@hey-api/codegen-core';

import { ts } from '../../ts-compiler';
import { TsDsl } from '../base';
import { DecoratorMixin } from '../mixins/decorator';
import { DoMixin } from '../mixins/do';
import { DocMixin } from '../mixins/doc';
import {
  AbstractMixin,
  AsyncMixin,
  PrivateMixin,
  ProtectedMixin,
  PublicMixin,
  StaticMixin,
} from '../mixins/modifiers';
import { ParamMixin } from '../mixins/param';
import { BlockTsDsl } from '../stmt/block';
import { safeAccessorName } from '../utils/name';

const Mixed = AbstractMixin(
  AsyncMixin(
    DecoratorMixin(
      DoMixin(
        DocMixin(
          ParamMixin(
            PrivateMixin(
              ProtectedMixin(PublicMixin(StaticMixin(TsDsl<ts.SetAccessorDeclaration>))),
            ),
          ),
        ),
      ),
    ),
  ),
);

export class SetterTsDsl extends Mixed {
  readonly '~dsl' = 'SetterTsDsl';
  override readonly nameSanitizer = safeAccessorName;

  constructor(name: NodeName, fn?: (s: SetterTsDsl) => void) {
    super();
    this.name.set(name);
    fn?.(this);
  }

  override analyze(ctx: AnalysisContext): void {
    ctx.analyze(this.name);

    ctx.pushScope();
    try {
      super.analyze(ctx);
    } finally {
      ctx.popScope();
    }
  }

  override toAst() {
    const node = ts.factory.createSetAccessorDeclaration(
      [...this.$decorators(), ...this.modifiers],
      this.$node(this.name) as ts.PropertyName,
      this.$params(),
      this.$node(new BlockTsDsl(...this._do).pretty()),
    );
    return this.$docs(node);
  }
}
