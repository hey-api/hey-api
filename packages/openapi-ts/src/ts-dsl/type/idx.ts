import type { AnalysisContext, NodeScope } from '@hey-api/codegen-core';

import { ts } from '../../ts-compiler';
import type { MaybeTsDsl } from '../base';
import { TsDsl } from '../base';
import { TypeExprMixin } from '../mixins/type-expr';
import { f } from '../utils/factories';

type Base = string | MaybeTsDsl<ts.TypeNode>;
type Index = string | number | MaybeTsDsl<ts.TypeNode>;
export type TypeIdxCtor = (base: Base, index: Index) => TypeIdxTsDsl;

const Mixed = TypeExprMixin(TsDsl<ts.IndexedAccessTypeNode>);

export class TypeIdxTsDsl extends Mixed {
  readonly '~dsl' = 'TypeIdxTsDsl';
  override scope: NodeScope = 'type';

  protected _base!: Base;
  protected _index!: Index;

  constructor(base: Base, index: Index) {
    super();
    this.base(base);
    this.index(index);
  }

  override analyze(ctx: AnalysisContext): void {
    super.analyze(ctx);
    ctx.analyze(this._base);
    ctx.analyze(this._index);
  }

  /** Returns true when all required builder calls are present. */
  get isValid(): boolean {
    return !this.missingRequiredCalls().length;
  }

  base(base: Base): this {
    this._base = base;
    return this;
  }

  index(index: Index): this {
    this._index = index;
    return this;
  }

  override toAst() {
    this.$validate();
    return ts.factory.createIndexedAccessTypeNode(this.$type(this._base), this.$type(this._index));
  }

  $validate(): asserts this is this & {
    _base: Base;
    _index: Index;
  } {
    const missing = this.missingRequiredCalls();
    if (!missing.length) return;
    throw new Error(`Indexed access type missing ${missing.join(' and ')}`);
  }

  private missingRequiredCalls(): ReadonlyArray<string> {
    const missing: Array<string> = [];
    if (this._base === undefined) missing.push('.base()');
    if (this._index === undefined) missing.push('.index()');
    return missing;
  }
}

f.type.idx.set((...args) => new TypeIdxTsDsl(...args));
