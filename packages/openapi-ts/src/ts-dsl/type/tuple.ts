import type { AnalysisContext, NodeScope } from '@hey-api/codegen-core';

import { ts } from '../../ts-compiler';
import type { TypeTsDsl } from '../base';
import { TsDsl } from '../base';

export type TupleElement = string | ts.TypeNode | TypeTsDsl;

const Mixed = TsDsl<ts.TupleTypeNode>;

export class TypeTupleTsDsl extends Mixed {
  readonly '~dsl' = 'TypeTupleTsDsl';
  override scope: NodeScope = 'type';

  protected _elements: Array<TupleElement> = [];

  constructor(...nodes: Array<TupleElement>) {
    super();
    this.elements(...nodes);
  }

  override analyze(ctx: AnalysisContext): void {
    super.analyze(ctx);
    for (const type of this._elements) {
      ctx.analyze(type);
    }
  }

  elements(...types: Array<TupleElement>): this {
    this._elements.push(...types);
    return this;
  }

  override toAst() {
    return ts.factory.createTupleTypeNode(this._elements.map((t) => this.$type(t)));
  }
}
