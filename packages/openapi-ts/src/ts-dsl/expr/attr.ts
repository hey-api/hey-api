import type { AnalysisContext, NodeName, Ref } from '@hey-api/codegen-core';
import { fromRef, isSymbol, ref } from '@hey-api/codegen-core';

import { ts } from '../../ts-compiler';
import type { MaybeTsDsl } from '../base';
import { TsDsl } from '../base';
import { AsMixin } from '../mixins/as';
import { ExprMixin } from '../mixins/expr';
import { OperatorMixin } from '../mixins/operator';
import { OptionalMixin } from '../mixins/optional';
import { SpreadMixin } from '../mixins/spread';
import { TokenTsDsl } from '../token';
import { f } from '../utils/factories';
import { regexp } from '../utils/regexp';
import { LiteralTsDsl } from './literal';

export type AttrLeft = NodeName | MaybeTsDsl<ts.Expression>;
export type AttrCtor = (left: AttrLeft, right: NodeName) => AttrTsDsl;

const Mixed = AsMixin(
  ExprMixin(
    OperatorMixin(
      OptionalMixin(SpreadMixin(TsDsl<ts.PropertyAccessExpression | ts.ElementAccessExpression>)),
    ),
  ),
);

export class AttrTsDsl extends Mixed {
  readonly '~dsl' = 'AttrTsDsl';

  protected _computed = false;
  protected _left: Ref<AttrLeft>;

  constructor(left: AttrLeft, right: NodeName) {
    super();
    this._left = ref(left);
    this.name.set(right);
  }

  override analyze(ctx: AnalysisContext): void {
    super.analyze(ctx);
    ctx.analyze(this._left);
    ctx.analyze(this.name);
  }

  /** Use computed property access (e.g., `obj[expr]`)? */
  computed(condition?: boolean): this {
    this._computed = condition ?? true;
    return this;
  }

  override toAst() {
    const left = this.$node(this._left);
    regexp.typeScriptIdentifier.lastIndex = 0;
    if (this._computed || !regexp.typeScriptIdentifier.test(this.name.toString())) {
      const right = fromRef(this.name);
      let value = isSymbol(right) ? right.finalName : right;
      if (typeof value === 'string') {
        if (
          (value.startsWith("'") && value.endsWith("'")) ||
          (value.startsWith('"') && value.endsWith('"'))
        ) {
          value = value.slice(1, -1);
        }
      }
      if (this._optional) {
        return ts.factory.createElementAccessChain(
          left,
          this.$node(new TokenTsDsl().questionDot()),
          this.$node(this._computed ? this.name : new LiteralTsDsl(value)),
        );
      }
      return ts.factory.createElementAccessExpression(
        left,
        this.$node(this._computed ? this.name : new LiteralTsDsl(value)),
      );
    }
    if (this._optional) {
      return ts.factory.createPropertyAccessChain(
        left,
        this.$node(new TokenTsDsl().questionDot()),
        this.$node(this.name) as ts.MemberName,
      );
    }
    return ts.factory.createPropertyAccessExpression(left, this.$node(this.name) as ts.MemberName);
  }
}

f.attr.set((...args) => new AttrTsDsl(...args));
