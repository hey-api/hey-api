import type { AnalysisContext, NodeName } from '@hey-api/codegen-core';

import { ts } from '../../ts-compiler';
import type { MaybeTsDsl } from '../base';
import { TsDsl } from '../base';
import { ArgsMixin } from '../mixins/args';
import { safeRuntimeName } from '../utils/name';

const Mixed = ArgsMixin(TsDsl<ts.Decorator>);

export class DecoratorTsDsl extends Mixed {
  readonly '~dsl' = 'DecoratorTsDsl';
  override readonly nameSanitizer = safeRuntimeName;

  constructor(name: NodeName, ...args: ReadonlyArray<string | MaybeTsDsl<ts.Expression>>) {
    super();
    this.name.set(name);
    this.args(...args);
  }

  override analyze(ctx: AnalysisContext): void {
    super.analyze(ctx);
    ctx.analyze(this.name);
  }

  override toAst() {
    const target = this.$node(this.name);
    const args = this.$args();
    return ts.factory.createDecorator(
      args.length ? ts.factory.createCallExpression(target, undefined, args) : target,
    );
  }
}
