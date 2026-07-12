import type { AnalysisContext, NodeName } from '@hey-api/codegen-core';

import { ts } from '../../ts-compiler';
import { TsDsl, TypeTsDsl } from '../base';
import { DecoratorMixin } from '../mixins/decorator';
import { DocMixin } from '../mixins/doc';
import {
  PrivateMixin,
  ProtectedMixin,
  PublicMixin,
  ReadonlyMixin,
  StaticMixin,
} from '../mixins/modifiers';
import { OptionalMixin } from '../mixins/optional';
import { ValueMixin } from '../mixins/value';
import { TokenTsDsl } from '../token';
import { TypeExprTsDsl } from '../type/expr';
import { safeAccessorName } from '../utils/name';

export type FieldType = NodeName | TypeTsDsl;

const Mixed = DecoratorMixin(
  DocMixin(
    OptionalMixin(
      PrivateMixin(
        ProtectedMixin(
          PublicMixin(ReadonlyMixin(StaticMixin(ValueMixin(TsDsl<ts.PropertyDeclaration>)))),
        ),
      ),
    ),
  ),
);

export class FieldTsDsl extends Mixed {
  readonly '~dsl' = 'FieldTsDsl';
  override readonly nameSanitizer = safeAccessorName;

  protected _type?: TypeTsDsl;

  constructor(name: NodeName, fn?: (f: FieldTsDsl) => void) {
    super();
    this.name.set(name);
    fn?.(this);
  }

  override analyze(ctx: AnalysisContext): void {
    super.analyze(ctx);
    ctx.analyze(this.name);
    ctx.analyze(this._type);
  }

  /** Sets the field type. */
  type(type: FieldType): this {
    this._type = type instanceof TypeTsDsl ? type : new TypeExprTsDsl(type);
    return this;
  }

  override toAst() {
    const node = ts.factory.createPropertyDeclaration(
      [...this.$decorators(), ...this.modifiers],
      this.$node(this.name) as ts.PropertyName,
      this._optional ? this.$node(new TokenTsDsl().optional()) : undefined,
      this.$type(this._type),
      this.$value(),
    );
    return this.$docs(node);
  }
}
