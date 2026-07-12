import type { AnalysisContext, NodeName, NodeScope, Ref } from '@hey-api/codegen-core';
import { isRef, ref } from '@hey-api/codegen-core';

import { ts } from '../../ts-compiler';
import type { MaybeTsDsl } from '../base';
import { TsDsl } from '../base';
import { TypeExprMixin } from '../mixins/type-expr';

type Base = NodeName | MaybeTsDsl<ts.EntityName>;
type Right = NodeName | ts.Identifier;

const Mixed = TypeExprMixin(TsDsl<ts.QualifiedName>);

export class TypeAttrTsDsl extends Mixed {
  readonly '~dsl' = 'TypeAttrTsDsl';
  override scope: NodeScope = 'type';

  protected _base?: Ref<Base>;
  protected _right!: Ref<Right>;

  constructor(base: Base | Ref<Base>, right: string | ts.Identifier);
  constructor(right: Right);
  constructor(base: Base | Ref<Base>, right?: Right) {
    super();
    if (right) {
      this.base(base);
      this.right(right);
    } else {
      this.base();
      this.right(base as Right);
    }
  }

  override analyze(ctx: AnalysisContext): void {
    super.analyze(ctx);
    ctx.analyze(this._base);
    ctx.analyze(this._right);
  }

  /** Returns true when all required builder calls are present. */
  get isValid(): boolean {
    return !this.missingRequiredCalls().length;
  }

  base(base?: Base | Ref<Base>): this {
    if (isRef(base)) {
      this._base = base;
    } else {
      this._base = base ? ref(base) : undefined;
    }
    return this;
  }

  right(right: Right): this {
    this._right = ref(right);
    return this;
  }

  override toAst() {
    this.$validate();
    const left = this.$node(this._base);
    if (!ts.isEntityName(left)) {
      throw new Error('TypeAttrTsDsl: base must be an EntityName');
    }
    return ts.factory.createQualifiedName(left, this.$node(this._right) as ts.Identifier);
  }

  $validate(): asserts this is this & {
    _base: Ref<Base>;
    _right: Ref<Right>;
  } {
    const missing = this.missingRequiredCalls();
    if (!missing.length) return;
    throw new Error(`Type attribute missing ${missing.join(' and ')}`);
  }

  private missingRequiredCalls(): ReadonlyArray<string> {
    const missing: Array<string> = [];
    if (!this._base) missing.push('.base()');
    if (!this._right) missing.push('.right()');
    return missing;
  }
}
