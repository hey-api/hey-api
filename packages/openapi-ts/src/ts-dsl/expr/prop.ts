import type { AnalysisContext, NodeName, Ref } from '@hey-api/codegen-core';
import { ref } from '@hey-api/codegen-core';

import { ts } from '../../ts-compiler';
import type { MaybeTsDsl } from '../base';
import { TsDsl } from '../base';
import { GetterTsDsl } from '../decl/getter';
import { SetterTsDsl } from '../decl/setter';
import { DocMixin } from '../mixins/doc';
import type { f } from '../utils/factories';
import { safePropName } from '../utils/name';
import { IdTsDsl } from './id';

export type ObjectPropKind = 'computed' | 'getter' | 'method' | 'prop' | 'setter' | 'spread';
export type ObjectPropValue =
  | NodeName
  | MaybeTsDsl<ts.Expression | ts.Statement>
  | ReturnType<typeof f.method>;

type Meta =
  | { kind: 'computed'; name: string }
  | { kind: 'getter'; name: string }
  | { kind: 'method'; name: string }
  | { kind: 'prop'; name: string }
  | { kind: 'setter'; name: string }
  | { kind: 'spread'; name?: undefined };

const Mixed = DocMixin(TsDsl<ts.ObjectLiteralElementLike>);

export class ObjectPropTsDsl extends Mixed {
  readonly '~dsl' = 'ObjectPropTsDsl';

  protected _value?: Ref<ObjectPropValue>;
  protected _meta: Meta;

  constructor(meta: Meta) {
    super();
    this._meta = meta;
  }

  override analyze(ctx: AnalysisContext): void {
    super.analyze(ctx);
    ctx.analyze(this._value);
  }

  get isValid(): boolean {
    return !this.missingRequiredCalls().length;
  }

  get kind(): ObjectPropKind {
    return this._meta.kind;
  }

  get propName(): string | undefined {
    return this._meta.name;
  }

  value(value: ObjectPropValue): this {
    this._value = ref(value);
    return this;
  }

  override toAst() {
    this.$validate();
    const node = this.$node(this._value);
    if (this._meta.kind === 'spread') {
      if (ts.isStatement(node)) {
        throw new Error('Invalid spread: object spread must be an expression, not a statement.');
      }
      const result = ts.factory.createSpreadAssignment(node as ts.Expression);
      return this.$docs(result);
    }
    if (this._meta.kind === 'getter') {
      const getter = new GetterTsDsl(this._meta.name).do(node as ts.Statement);
      const result = this.$node(getter);
      return this.$docs(result);
    }
    if (this._meta.kind === 'setter') {
      const setter = new SetterTsDsl(this._meta.name).do(node as ts.Statement);
      const result = this.$node(setter);
      return this.$docs(result);
    }
    if (this._meta.kind === 'method') {
      return this.$docs(node as ts.MethodDeclaration);
    }
    if (ts.isIdentifier(node) && node.text === this._meta.name) {
      const result = ts.factory.createShorthandPropertyAssignment(this._meta.name);
      return this.$docs(result);
    }
    if (ts.isStatement(node)) {
      throw new Error(
        'Invalid property: object property value must be an expression, not a statement.',
      );
    }
    const result = ts.factory.createPropertyAssignment(
      this._meta.kind === 'computed'
        ? ts.factory.createComputedPropertyName(this.$node(new IdTsDsl(this._meta.name)))
        : this.$node(safePropName(this._meta.name)),
      node as ts.Expression,
    );
    return this.$docs(result);
  }

  $validate(): asserts this is this & {
    _value: ObjectPropValue;
    kind: ObjectPropKind;
  } {
    const missing = this.missingRequiredCalls();
    if (!missing.length) return;
    throw new Error(
      `Object property${this._meta.name ? ` "${this._meta.name}"` : ''} missing ${missing.join(' and ')}`,
    );
  }

  private missingRequiredCalls(): ReadonlyArray<string> {
    const missing: Array<string> = [];
    if (!this._value) missing.push('.value()');
    return missing;
  }
}
