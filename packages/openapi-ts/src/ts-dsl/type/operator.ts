import type { AnalysisContext, NodeScope } from '@hey-api/codegen-core';

import { ts } from '../../ts-compiler';
import type { MaybeTsDsl } from '../base';
import { TsDsl } from '../base';
import { f } from '../utils/factories';

type Op = ts.SyntaxKind.KeyOfKeyword | ts.SyntaxKind.ReadonlyKeyword | ts.SyntaxKind.UniqueKeyword;
type Type = string | MaybeTsDsl<ts.TypeNode>;
export type TypeOperatorCtor = () => TypeOperatorTsDsl;

const Mixed = TsDsl<ts.TypeOperatorNode>;

/**
 * Builds a TypeScript `TypeOperatorNode`, such as:
 *
 * - `keyof T`
 * - `readonly U`
 * - `unique V`
 *
 * This DSL provides both a generic `.operator()` API and convenient
 * shorthand methods (`.keyof()`, `.readonly()`, `.unique()`).
 *
 * The node will throw during render if required fields are missing.
 */
export class TypeOperatorTsDsl extends Mixed {
  readonly '~dsl' = 'TypeOperatorTsDsl';
  override scope: NodeScope = 'type';

  protected _op?: Op;
  protected _type?: Type;

  override analyze(ctx: AnalysisContext): void {
    super.analyze(ctx);
    ctx.analyze(this._type);
  }

  /** Shorthand: builds `keyof T`. */
  keyof(type: Type): this {
    this.operator(ts.SyntaxKind.KeyOfKeyword);
    this.type(type);
    return this;
  }

  /** Sets the operator explicitly. */
  operator(op: Op): this {
    this._op = op;
    return this;
  }

  /** Shorthand: builds `readonly T`. */
  readonly(type: Type): this {
    this.operator(ts.SyntaxKind.ReadonlyKeyword);
    this.type(type);
    return this;
  }

  /** Sets the target type of the operator. */
  type(type: Type): this {
    this._type = type;
    return this;
  }

  /** Shorthand: builds `unique T`. */
  unique(type: Type): this {
    this.operator(ts.SyntaxKind.UniqueKeyword);
    this.type(type);
    return this;
  }

  override toAst() {
    this.$validate();
    return ts.factory.createTypeOperatorNode(this._op, this.$type(this._type));
  }

  /** Throws if required fields are not set. */
  $validate(): asserts this is this & {
    _op: Op;
    _type: Type;
  } {
    const missing = this.missingRequiredCalls();
    if (!missing.length) return;
    throw new Error(`Type operator missing ${missing.join(' and ')}`);
  }

  private missingRequiredCalls(): ReadonlyArray<string> {
    const missing: Array<string> = [];
    if (!this._op) missing.push('.operator()');
    if (!this._type) missing.push('.\u200Btype()');
    return missing;
  }
}

f.type.operator.set((...args) => new TypeOperatorTsDsl(...args));
