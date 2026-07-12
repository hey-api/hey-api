import type { AnalysisContext, Node } from '@hey-api/codegen-core';

import type { ts } from '../../ts-compiler';
import type { MaybeTsDsl, TypeTsDsl } from '../base';
import { f } from '../utils/factories';
import type { BaseCtor, DropFirst, MixinCtor } from './types';

export interface TypeExprMethods extends Node {
  /** Creates an indexed-access type (e.g., `Foo<T>[K]`). */
  idx(
    this: Parameters<typeof f.type.idx>[0],
    ...args: DropFirst<Parameters<typeof f.type.idx>>
  ): ReturnType<typeof f.type.idx>;
  /** Shorthand: builds `keyof T`. */
  keyof(this: MaybeTsDsl<TypeTsDsl>): ReturnType<typeof f.type.operator>;
  /** Shorthand: builds `readonly T`. */
  readonly(this: MaybeTsDsl<TypeTsDsl>): ReturnType<typeof f.type.operator>;
  /** Create a TypeExpr node representing ReturnType<this>. */
  returnType(
    this: Parameters<typeof f.type.query>[0],
    ...args: DropFirst<Parameters<typeof f.type.query>>
  ): ReturnType<typeof f.type.expr>;
  /** Create a TypeOfExpr node representing typeof this. */
  typeofExpr(
    this: Parameters<typeof f.typeofExpr>[0],
    ...args: DropFirst<Parameters<typeof f.typeofExpr>>
  ): ReturnType<typeof f.typeofExpr>;
  /** Create a TypeQuery node representing typeof this. */
  typeofType(
    this: Parameters<typeof f.type.query>[0],
    ...args: DropFirst<Parameters<typeof f.type.query>>
  ): ReturnType<typeof f.type.query>;
  /** Shorthand: builds `unique T`. */
  unique(this: MaybeTsDsl<TypeTsDsl>): ReturnType<typeof f.type.operator>;
}

export function TypeExprMixin<T extends ts.Node, TBase extends BaseCtor<T>>(Base: TBase) {
  abstract class TypeExpr extends Base {
    override analyze(ctx: AnalysisContext): void {
      super.analyze(ctx);
    }

    protected idx(
      this: Parameters<typeof f.type.idx>[0],
      ...args: DropFirst<Parameters<typeof f.type.idx>>
    ): ReturnType<typeof f.type.idx> {
      return f.type.idx(this, ...args);
    }

    protected keyof(this: TypeTsDsl): ReturnType<typeof f.type.operator> {
      return f.type.operator().keyof(this);
    }

    protected readonly(this: TypeTsDsl): ReturnType<typeof f.type.operator> {
      return f.type.operator().readonly(this);
    }

    protected returnType(
      this: Parameters<typeof f.type.query>[0],
      ...args: DropFirst<Parameters<typeof f.type.query>>
    ): ReturnType<typeof f.type.expr> {
      return f.type.expr('ReturnType').generic(f.type.query(this, ...args));
    }

    protected typeofExpr(
      this: Parameters<typeof f.typeofExpr>[0],
      ...args: DropFirst<Parameters<typeof f.typeofExpr>>
    ): ReturnType<typeof f.typeofExpr> {
      return f.typeofExpr(this, ...args);
    }

    protected typeofType(
      this: Parameters<typeof f.type.query>[0],
      ...args: DropFirst<Parameters<typeof f.type.query>>
    ): ReturnType<typeof f.type.query> {
      return f.type.query(this, ...args);
    }

    protected unique(this: TypeTsDsl): ReturnType<typeof f.type.operator> {
      return f.type.operator().unique(this);
    }
  }

  return TypeExpr as unknown as MixinCtor<TBase, TypeExprMethods>;
}
