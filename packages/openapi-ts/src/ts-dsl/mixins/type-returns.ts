import type { AnalysisContext, Node, NodeName } from '@hey-api/codegen-core';

import type { ts } from '../../ts-compiler';
import { TypeTsDsl } from '../base';
import { TypeExprTsDsl } from '../type/expr';
import type { BaseCtor, MixinCtor } from './types';

export interface TypeReturnsMethods extends Node {
  /** Returns the return type node. */
  $returns(): ts.TypeNode | undefined;
  /** Sets the return type. */
  returns(type: NodeName | TypeTsDsl): this;
}

export function TypeReturnsMixin<T extends ts.Node, TBase extends BaseCtor<T>>(Base: TBase) {
  abstract class TypeReturns extends Base {
    protected _returns?: TypeTsDsl;

    override analyze(ctx: AnalysisContext): void {
      super.analyze(ctx);
      ctx.analyze(this._returns);
    }

    protected returns(type: NodeName | TypeTsDsl): this {
      this._returns = type instanceof TypeTsDsl ? type : new TypeExprTsDsl(type);
      return this;
    }

    protected $returns(): ts.TypeNode | undefined {
      return this.$type(this._returns);
    }
  }

  return TypeReturns as unknown as MixinCtor<TBase, TypeReturnsMethods>;
}
