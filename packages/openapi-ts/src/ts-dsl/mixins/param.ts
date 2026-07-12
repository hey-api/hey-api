import type { AnalysisContext, Node } from '@hey-api/codegen-core';

import type { ts } from '../../ts-compiler';
import type { MaybeTsDsl } from '../base';
import type { ParamCtor, ParamFn, ParamName } from '../decl/param';
import { ParamTsDsl } from '../decl/param';
import type { BaseCtor, MixinCtor } from './types';

export interface ParamMethods extends Node {
  /** Renders the parameters into an array of `ParameterDeclaration`s. */
  $params(): ReadonlyArray<ts.ParameterDeclaration>;
  /** Adds a parameter. */
  param(...args: Parameters<ParamCtor>): this;
  /** Adds multiple parameters. */
  params(...params: ReadonlyArray<MaybeTsDsl<ts.ParameterDeclaration>>): this;
}

export function ParamMixin<T extends ts.Node, TBase extends BaseCtor<T>>(Base: TBase) {
  abstract class Param extends Base {
    protected _params: Array<MaybeTsDsl<ts.ParameterDeclaration>> = [];

    override analyze(ctx: AnalysisContext): void {
      super.analyze(ctx);
      for (const param of this._params) {
        ctx.analyze(param);
      }
    }

    protected param(name: ParamName, fn?: ParamFn): this {
      const p = new ParamTsDsl(name, fn);
      this._params.push(p);
      return this;
    }

    protected params(...params: ReadonlyArray<MaybeTsDsl<ts.ParameterDeclaration>>): this {
      this._params.push(...params);
      return this;
    }

    protected $params(): ReadonlyArray<ts.ParameterDeclaration> {
      return this.$node(this._params);
    }
  }

  return Param as unknown as MixinCtor<TBase, ParamMethods>;
}
