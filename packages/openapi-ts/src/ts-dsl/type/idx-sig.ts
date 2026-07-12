import type { AnalysisContext, NodeName, NodeScope } from '@hey-api/codegen-core';

import { ts } from '../../ts-compiler';
import type { MaybeTsDsl } from '../base';
import { TsDsl } from '../base';
import { DocMixin } from '../mixins/doc';
import { ReadonlyMixin } from '../mixins/modifiers';

export type TypeIdxSigType = string | MaybeTsDsl<ts.TypeNode>;
export type TypeIdxSigKind = 'idxSig';

const Mixed = DocMixin(ReadonlyMixin(TsDsl<ts.IndexSignatureDeclaration>));

export class TypeIdxSigTsDsl extends Mixed {
  readonly '~dsl' = 'TypeIdxSigTsDsl';
  override scope: NodeScope = 'type';

  protected _key?: TypeIdxSigType;
  protected _type?: TypeIdxSigType;

  constructor(name: NodeName, fn?: (i: TypeIdxSigTsDsl) => void) {
    super();
    this.name.set(name);
    fn?.(this);
  }

  /** Element kind. */
  get kind(): TypeIdxSigKind {
    return 'idxSig';
  }

  /** Index signature parameter name. */
  get propName(): string {
    return this.name.toString();
  }

  override analyze(ctx: AnalysisContext): void {
    super.analyze(ctx);
    ctx.analyze(this._key);
    ctx.analyze(this._type);
  }

  /** Returns true when all required builder calls are present. */
  get isValid(): boolean {
    return !this.missingRequiredCalls().length;
  }

  /** Sets the key type: `[name: T]` */
  key(type: TypeIdxSigType): this {
    this._key = type;
    return this;
  }

  /** Sets the property type. */
  type(type: TypeIdxSigType): this {
    this._type = type;
    return this;
  }

  override toAst() {
    this.$validate();
    const node = ts.factory.createIndexSignature(
      this.modifiers,
      [
        ts.factory.createParameterDeclaration(
          undefined,
          undefined,
          this.$node(this.name) as ts.BindingName,
          undefined,
          this.$type(this._key),
        ),
      ],
      this.$type(this._type),
    );
    return this.$docs(node);
  }

  $validate(): asserts this is this & {
    _key: TypeIdxSigType;
    _type: TypeIdxSigType;
  } {
    const missing = this.missingRequiredCalls();
    if (!missing.length) return;
    const name = this.name.toString();
    throw new Error(`Index signature${name ? ` "${name}"` : ''} missing ${missing.join(' and ')}`);
  }

  private missingRequiredCalls(): ReadonlyArray<string> {
    const missing: Array<string> = [];
    if (!this._key) missing.push('.key()');
    if (!this._type) missing.push('.\u200Btype()');
    return missing;
  }
}
