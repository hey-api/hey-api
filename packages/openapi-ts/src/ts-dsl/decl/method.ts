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
import { OptionalMixin } from '../mixins/optional';
import { ParamMixin } from '../mixins/param';
import { TypeParamsMixin } from '../mixins/type-params';
import { TypeReturnsMixin } from '../mixins/type-returns';
import { BlockTsDsl } from '../stmt/block';
import { TokenTsDsl } from '../token';
import { f } from '../utils/factories';
import { safeAccessorName } from '../utils/name';

export type MethodCtor = (name: NodeName, fn?: (m: MethodTsDsl) => void) => MethodTsDsl;

const Mixed = AbstractMixin(
  AsyncMixin(
    DecoratorMixin(
      DoMixin(
        DocMixin(
          OptionalMixin(
            ParamMixin(
              PrivateMixin(
                ProtectedMixin(
                  PublicMixin(
                    StaticMixin(TypeParamsMixin(TypeReturnsMixin(TsDsl<ts.MethodDeclaration>))),
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    ),
  ),
);

export class MethodTsDsl extends Mixed {
  readonly '~dsl' = 'MethodTsDsl';
  override readonly nameSanitizer = safeAccessorName;

  constructor(name: NodeName, fn?: (m: MethodTsDsl) => void) {
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
    const node = ts.factory.createMethodDeclaration(
      [...this.$decorators(), ...this.modifiers],
      undefined,
      this.$node(this.name) as ts.PropertyName,
      this._optional ? this.$node(new TokenTsDsl().optional()) : undefined,
      this.$generics(),
      this.$params(),
      this.$returns(),
      this.$node(new BlockTsDsl(...this._do).pretty()),
    );
    return this.$docs(node);
  }
}

f.method.set((...args) => new MethodTsDsl(...args));
