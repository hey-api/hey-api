import type { AnalysisContext, Node } from '@hey-api/codegen-core';

import type { ts } from '../../ts-compiler';
import type { DocFn, DocLines } from '../layout/doc';
import { DocTsDsl } from '../layout/doc';
import type { BaseCtor, MixinCtor } from './types';

export interface DocMethods extends Node {
  $docs<T extends ts.Node>(node: T): T;
  doc(lines?: DocLines, fn?: DocFn): this;
}

export function DocMixin<T extends ts.Node, TBase extends BaseCtor<T>>(Base: TBase) {
  abstract class Doc extends Base {
    private _doc?: DocTsDsl;

    override analyze(ctx: AnalysisContext): void {
      super.analyze(ctx);
    }

    protected doc(lines?: DocLines, fn?: DocFn): this {
      this._doc = new DocTsDsl(lines, fn);
      return this;
    }

    protected $docs<T extends ts.Node>(node: T): T {
      return this._doc ? this._doc.apply(node) : node;
    }
  }

  return Doc as unknown as MixinCtor<TBase, DocMethods>;
}
