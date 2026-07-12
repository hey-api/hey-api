import type { AnalysisContext, NodeName, NodeScope, Ref } from '@hey-api/codegen-core';
import { ref } from '@hey-api/codegen-core';

import { ts } from '../../ts-compiler';
import type { MaybeTsDsl, TypeTsDsl } from '../base';
import { TsDsl } from '../base';

export type TypeParamExpr = NodeName | boolean | MaybeTsDsl<TypeTsDsl>;

const Mixed = TsDsl<ts.TypeParameterDeclaration>;

export class TypeParamTsDsl extends Mixed {
  readonly '~dsl' = 'TypeParamTsDsl';
  override scope: NodeScope = 'type';

  protected constraint?: Ref<TypeParamExpr>;
  protected defaultValue?: Ref<TypeParamExpr>;

  constructor(name?: NodeName, fn?: (name: TypeParamTsDsl) => void) {
    super();
    if (name) this.name.set(name);
    fn?.(this);
  }

  override analyze(ctx: AnalysisContext): void {
    super.analyze(ctx);
    ctx.analyze(this.name);
    ctx.analyze(this.constraint);
    ctx.analyze(this.defaultValue);
  }

  /** Sets the parameter default value. */
  default(value: TypeParamExpr): this {
    this.defaultValue = ref(value);
    return this;
  }

  extends(constraint: TypeParamExpr): this {
    this.constraint = ref(constraint);
    return this;
  }

  override toAst() {
    const name = this.name.toString();
    if (!name) throw new Error('Missing type name');
    return ts.factory.createTypeParameterDeclaration(
      undefined,
      this.$node(this.name) as ts.Identifier,
      this.$type(this.constraint),
      this.$type(this.defaultValue),
    );
  }
}
