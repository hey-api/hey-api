import type { AnalysisContext, NodeName, NodeScope } from '@hey-api/codegen-core';

import { ts } from '../../ts-compiler';
import type { MaybeTsDsl } from '../base';
import { TsDsl } from '../base';
import { TokenTsDsl } from '../token';

const Mixed = TsDsl<ts.MappedTypeNode>;

export class TypeMappedTsDsl extends Mixed {
  readonly '~dsl' = 'TypeMappedTsDsl';
  override scope: NodeScope = 'type';

  protected questionToken?: TokenTsDsl<
    ts.SyntaxKind.QuestionToken | ts.SyntaxKind.PlusToken | ts.SyntaxKind.MinusToken
  >;
  protected readonlyToken?: TokenTsDsl<
    ts.SyntaxKind.ReadonlyKeyword | ts.SyntaxKind.MinusToken | ts.SyntaxKind.PlusToken
  >;
  protected _key?: string | MaybeTsDsl<ts.TypeNode>;
  protected _type?: string | MaybeTsDsl<ts.TypeNode>;

  constructor(name?: NodeName) {
    super();
    if (name) this.name.set(name);
  }

  override analyze(ctx: AnalysisContext): void {
    super.analyze(ctx);
    ctx.analyze(this.questionToken);
    ctx.analyze(this.readonlyToken);
    ctx.analyze(this._key);
    ctx.analyze(this._type);
  }

  /** Returns true when all required builder calls are present. */
  get isValid(): boolean {
    return !this.missingRequiredCalls().length;
  }

  /** Sets the key constraint: `[K in Constraint]` */
  key(type: string | MaybeTsDsl<ts.TypeNode>): this {
    this._key = type;
    return this;
  }

  /** Removes `readonly` from the mapped members (`[K in X]-readonly`). */
  mutable(): this {
    this.readonlyToken = new TokenTsDsl().minus();
    return this;
  }

  /** Makes `[K in X]?:` optional. */
  optional(): this {
    this.questionToken = new TokenTsDsl().optional();
    return this;
  }

  /** Makes `[K in X]` readonly */
  readonly(): this {
    this.readonlyToken = new TokenTsDsl().readonly();
    return this;
  }

  /** Removes `?` from the mapped members (`[K in X]-?:`). */
  required(): this {
    this.questionToken = new TokenTsDsl().minus();
    return this;
  }

  /** Sets the mapped value type: `[K in X]: ValueType` */
  type(type: string | MaybeTsDsl<ts.TypeNode>): this {
    this._type = type;
    return this;
  }

  override toAst() {
    this.$validate();
    return ts.factory.createMappedTypeNode(
      this.$node(this.readonlyToken),
      ts.factory.createTypeParameterDeclaration(
        undefined,
        this.$node(this.name) as ts.Identifier,
        this.$type(this._key),
        undefined,
      ),
      undefined,
      this.$node(this.questionToken),
      this.$type(this._type),
      undefined,
    );
  }

  $validate(): asserts this is this & {
    _key: string | MaybeTsDsl<ts.TypeNode>;
    _type: string | MaybeTsDsl<ts.TypeNode>;
  } {
    const missing = this.missingRequiredCalls();
    if (!missing.length) return;
    const name = this.name.toString();
    throw new Error(`Mapped type${name ? ` "${name}"` : ''} missing ${missing.join(' and ')}`);
  }

  private missingRequiredCalls(): ReadonlyArray<string> {
    const missing: Array<string> = [];
    if (!this._key) missing.push('.key()');
    if (!this._type) missing.push('.\u200Btype()');
    return missing;
  }
}
