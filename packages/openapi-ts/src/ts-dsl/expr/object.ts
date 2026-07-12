import type { AnalysisContext, NodeName } from '@hey-api/codegen-core';

import { ts } from '../../ts-compiler';
import type { MaybeTsDsl } from '../base';
import { TsDsl } from '../base';
import type { MethodTsDsl } from '../decl/method';
import { AsMixin } from '../mixins/as';
import { ExprMixin } from '../mixins/expr';
import { HintMixin } from '../mixins/hint';
import { LayoutMixin } from '../mixins/layout';
import { f } from '../utils/factories';
import { ObjectPropTsDsl } from './prop';

type Expr = NodeName | MaybeTsDsl<ts.Expression>;
type Stmt = NodeName | MaybeTsDsl<ts.Statement>;

const Mixed = AsMixin(ExprMixin(HintMixin(LayoutMixin(TsDsl<ts.ObjectLiteralExpression>))));

export class ObjectTsDsl extends Mixed {
  readonly '~dsl' = 'ObjectTsDsl';

  protected _props = new Map<string, ObjectPropTsDsl>();
  protected _spreadCounter = 0;

  constructor(...props: Array<ObjectPropTsDsl> | [(o: ObjectTsDsl) => void]) {
    super();
    if (props.length === 1 && typeof props[0] === 'function') {
      props[0](this);
    } else {
      this.props(...(props as Array<ObjectPropTsDsl>));
    }
  }

  override analyze(ctx: AnalysisContext): void {
    super.analyze(ctx);
    for (const prop of this._props.values()) {
      ctx.analyze(prop);
    }
  }

  /** Returns composite key for the property. */
  private _propKey(prop: ObjectPropTsDsl): string {
    if (prop.kind === 'spread') {
      return `spread:${this._spreadCounter++}`;
    }
    return `${prop.kind}:${prop.propName}`;
  }

  /** Adds a computed property (e.g., `{ [expr]: value }`), or removes if null. */
  computed(name: string, expr: Expr | null): this {
    if (expr === null) {
      this._props.delete(`computed:${name}`);
    } else {
      this._props.set(
        `computed:${name}`,
        new ObjectPropTsDsl({ kind: 'computed', name }).value(expr),
      );
    }
    return this;
  }

  /** Adds a getter property (e.g., `{ get foo() { ... } }`), or removes if null. */
  getter(name: string, stmt: Stmt | null): this {
    if (stmt === null) {
      this._props.delete(`getter:${name}`);
    } else {
      this._props.set(`getter:${name}`, new ObjectPropTsDsl({ kind: 'getter', name }).value(stmt));
    }
    return this;
  }

  /** Returns true if object has at least one property or spread. */
  hasProps(): boolean {
    return this._props.size > 0;
  }

  /** Returns true if object has no properties or spreads. */
  get isEmpty(): boolean {
    return this._props.size === 0;
  }

  /** Adds a method property (e.g., `{ foo() { ... } }`), or removes if null. */
  method(name: string, fn: ((m: MethodTsDsl) => void) | null): this {
    if (fn === null) {
      this._props.delete(`method:${name}`);
    } else {
      this._props.set(
        `method:${name}`,
        new ObjectPropTsDsl({ kind: 'method', name }).value(f.method(name, fn)),
      );
    }
    return this;
  }

  /** Adds a property assignment, or removes if null. */
  prop(name: string, expr: Expr | null): this {
    if (expr === null) {
      this._props.delete(`prop:${name}`);
    } else {
      this._props.set(`prop:${name}`, new ObjectPropTsDsl({ kind: 'prop', name }).value(expr));
    }
    return this;
  }

  /** Adds multiple properties. */
  props(...props: ReadonlyArray<ObjectPropTsDsl>): this {
    for (const prop of props) {
      this._props.set(this._propKey(prop), prop);
    }
    return this;
  }

  /** Adds a setter property (e.g., `{ set foo(v) { ... } }`), or removes if null. */
  setter(name: string, stmt: Stmt | null): this {
    if (stmt === null) {
      this._props.delete(`setter:${name}`);
    } else {
      this._props.set(`setter:${name}`, new ObjectPropTsDsl({ kind: 'setter', name }).value(stmt));
    }
    return this;
  }

  /** Adds a spread property (e.g., `{ ...options }`). */
  spread(expr: Expr): this {
    const key = `spread:${this._spreadCounter++}`;
    this._props.set(key, new ObjectPropTsDsl({ kind: 'spread' }).value(expr));
    return this;
  }

  override toAst() {
    const props = [...this._props.values()];
    const node = ts.factory.createObjectLiteralExpression(
      this.$node(props),
      this.$multiline(props.length),
    );
    return this.$hint(node);
  }
}
