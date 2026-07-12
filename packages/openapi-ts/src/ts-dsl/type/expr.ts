import type { AnalysisContext, NodeName, NodeScope, Ref } from '@hey-api/codegen-core';
import { isNode, ref } from '@hey-api/codegen-core';

import { ts } from '../../ts-compiler';
import { TsDsl } from '../base';
import { TypeArgsMixin } from '../mixins/type-args';
import { TypeExprMixin } from '../mixins/type-expr';
import { f } from '../utils/factories';
import { TypeAttrTsDsl } from './attr';

export type TypeExprExpr = NodeName | TypeAttrTsDsl;
export type TypeExprFn = (t: TypeExprTsDsl) => void;
export type TypeExprCtor = (nameOrFn?: NodeName | TypeExprFn, fn?: TypeExprFn) => TypeExprTsDsl;

const Mixed = TypeArgsMixin(TypeExprMixin(TsDsl<ts.TypeReferenceNode>));

export class TypeExprTsDsl extends Mixed {
  readonly '~dsl' = 'TypeExprTsDsl';
  override scope: NodeScope = 'type';

  protected _exprInput?: Ref<TypeExprExpr>;

  constructor();
  constructor(fn: TypeExprFn);
  constructor(name: NodeName);
  constructor(name: NodeName, fn?: TypeExprFn);
  constructor(name?: NodeName | TypeExprFn, fn?: TypeExprFn) {
    super();
    if (typeof name === 'function') {
      name(this);
    } else {
      this._exprInput = name ? ref(name) : undefined;
      fn?.(this);
    }
  }

  override analyze(ctx: AnalysisContext): void {
    super.analyze(ctx);
    ctx.analyze(this._exprInput);
  }

  /** Returns true when all required builder calls are present. */
  get isValid(): boolean {
    return !this.missingRequiredCalls().length;
  }

  /** Accesses a nested type (e.g., `Foo.Bar`). */
  attr(right: string | ts.Identifier | TypeAttrTsDsl): this {
    this._exprInput = isNode(right)
      ? ref(right.base(this._exprInput))
      : ref(new TypeAttrTsDsl(this._exprInput!, right));
    return this;
  }

  override toAst() {
    this.$validate();
    return ts.factory.createTypeReferenceNode(
      this.$type(this._exprInput) as ts.EntityName,
      this.$generics(),
    );
  }

  $validate(): asserts this is this & {
    _exprInput: Ref<TypeExprExpr>;
  } {
    const missing = this.missingRequiredCalls();
    if (!missing.length) return;
    throw new Error(`Type expression missing ${missing.join(' and ')}`);
  }

  private missingRequiredCalls(): ReadonlyArray<string> {
    const missing: Array<string> = [];
    if (!this._exprInput) missing.push('name or .attr()');
    return missing;
  }
}

f.type.expr.set(
  (...args) => new TypeExprTsDsl(...(args as ConstructorParameters<typeof TypeExprTsDsl>)),
);
