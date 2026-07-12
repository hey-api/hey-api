import type { AnalysisContext, NodeName, NodeScope, Ref } from '@hey-api/codegen-core';
import { ref } from '@hey-api/codegen-core';

import { ts } from '../../ts-compiler';
import type { TypeTsDsl } from '../base';
import { TsDsl } from '../base';

type Type = NodeName | ts.TypeNode | TypeTsDsl;

const Mixed = TsDsl<ts.IntersectionTypeNode>;

export class TypeAndTsDsl extends Mixed {
  readonly '~dsl' = 'TypeAndTsDsl';
  override scope: NodeScope = 'type';

  protected _types: Array<Ref<Type>> = [];

  constructor(...nodes: Array<Type>) {
    super();
    this.types(...nodes);
  }

  override analyze(ctx: AnalysisContext): void {
    super.analyze(ctx);
    for (const type of this._types) {
      ctx.analyze(type);
    }
  }

  types(...nodes: Array<Type>): this {
    this._types.push(...nodes.map((n) => ref(n)));
    return this;
  }

  override toAst() {
    const flat: Array<ts.TypeNode> = [];

    for (const node of this._types) {
      const type = this.$type(node);
      if (ts.isIntersectionTypeNode(type)) {
        flat.push(...type.types);
      } else {
        flat.push(type);
      }
    }

    return ts.factory.createIntersectionTypeNode(flat);
  }
}
