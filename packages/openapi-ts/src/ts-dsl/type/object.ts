import type { AnalysisContext, NodeScope } from '@hey-api/codegen-core';

import { ts } from '../../ts-compiler';
import { TsDsl } from '../base';
import { TypeIdxSigTsDsl } from './idx-sig';
import { TypePropTsDsl } from './prop';

const Mixed = TsDsl<ts.TypeNode>;

export class TypeObjectTsDsl extends Mixed {
  readonly '~dsl' = 'TypeObjectTsDsl';
  override scope: NodeScope = 'type';

  protected _props = new Map<string, TypePropTsDsl | TypeIdxSigTsDsl>();

  override analyze(ctx: AnalysisContext): void {
    super.analyze(ctx);
    for (const prop of this._props.values()) {
      ctx.analyze(prop);
    }
  }

  /** Returns true if object has at least one property or index signature. */
  hasProps(): boolean {
    return this._props.size > 0;
  }

  /** Adds an index signature to the object type, or removes if fn is null. */
  idxSig(name: string, fn: ((i: TypeIdxSigTsDsl) => void) | null): this {
    const key = `idxSig:${name}`;
    if (fn === null) {
      this._props.delete(key);
    } else {
      this._props.set(key, new TypeIdxSigTsDsl(name, fn));
    }
    return this;
  }

  /** Returns true if object has no properties or index signatures. */
  get isEmpty(): boolean {
    return this._props.size === 0;
  }

  /** Adds a property signature, or removes if fn is null. */
  prop(name: string, fn: ((p: TypePropTsDsl) => void) | null): this {
    const key = `prop:${name}`;
    if (fn === null) {
      this._props.delete(key);
    } else {
      this._props.set(key, new TypePropTsDsl(name, fn));
    }
    return this;
  }

  /** Adds multiple properties/index signatures. */
  props(...members: ReadonlyArray<TypePropTsDsl | TypeIdxSigTsDsl>): this {
    for (const member of members) {
      this._props.set(`${member.kind}:${member.propName}`, member);
    }
    return this;
  }

  override toAst() {
    return ts.factory.createTypeLiteralNode(this.$node([...this._props.values()]));
  }
}
