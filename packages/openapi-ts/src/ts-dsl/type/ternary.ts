import type { AnalysisContext, NodeName, NodeScope } from '@hey-api/codegen-core';

import { ts } from '../../ts-compiler';
import type { TypeTsDsl } from '../base';
import { TsDsl } from '../base';

type KeywordTypeName =
  | 'any'
  | 'bigint'
  | 'boolean'
  | 'never'
  | 'null'
  | 'number'
  | 'object'
  | 'string'
  | 'symbol'
  | 'undefined'
  | 'unknown'
  | 'void';

const keywordSyntaxKind: Record<Exclude<KeywordTypeName, 'null'>, ts.KeywordTypeSyntaxKind> = {
  any: ts.SyntaxKind.AnyKeyword,
  bigint: ts.SyntaxKind.BigIntKeyword,
  boolean: ts.SyntaxKind.BooleanKeyword,
  never: ts.SyntaxKind.NeverKeyword,
  number: ts.SyntaxKind.NumberKeyword,
  object: ts.SyntaxKind.ObjectKeyword,
  string: ts.SyntaxKind.StringKeyword,
  symbol: ts.SyntaxKind.SymbolKeyword,
  undefined: ts.SyntaxKind.UndefinedKeyword,
  unknown: ts.SyntaxKind.UnknownKeyword,
  void: ts.SyntaxKind.VoidKeyword,
};

type Type = NodeName | ts.TypeNode | TypeTsDsl;

const Mixed = TsDsl<ts.ConditionalTypeNode>;

export class TypeTernaryTsDsl extends Mixed {
  readonly '~dsl' = 'TypeTernaryTsDsl';
  override scope: NodeScope = 'type';

  protected _check?: Type;
  protected _extends?: Type;
  protected _true?: Type;
  protected _false?: Type;

  constructor(check?: Type) {
    super();
    if (check) this.check(check);
  }

  override analyze(ctx: AnalysisContext): void {
    super.analyze(ctx);
    ctx.analyze(this._check);
    ctx.analyze(this._extends);
    ctx.analyze(this._true);
    ctx.analyze(this._false);
  }

  /** Returns true when all required builder calls are present. */
  get isValid(): boolean {
    return !this.missingRequiredCalls().length;
  }

  /** Sets the checked type: `Check extends ...` */
  check(type: Type): this {
    this._check = this.resolveType(type);
    return this;
  }

  /** Sets the constraint: `Check extends Extends ? ...` */
  extends(type: Type): this {
    this._extends = this.resolveType(type);
    return this;
  }

  /** Sets the true branch: `... ? Do : ...` */
  do(type: Type): this {
    this._true = this.resolveType(type);
    return this;
  }

  /** Sets the false branch: `... : Otherwise` */
  otherwise(type: Type): this {
    this._false = this.resolveType(type);
    return this;
  }

  override toAst() {
    this.$validate();
    return ts.factory.createConditionalTypeNode(
      this.$type(this._check),
      this.$type(this._extends),
      this.$type(this._true),
      this.$type(this._false),
    );
  }

  $validate(): asserts this is this & {
    _check: Type;
    _extends: Type;
    _false: Type;
    _true: Type;
  } {
    const missing = this.missingRequiredCalls();
    if (!missing.length) return;
    throw new Error(`Ternary type missing ${missing.join(' and ')}`);
  }

  private missingRequiredCalls(): ReadonlyArray<string> {
    const missing: Array<string> = [];
    if (!this._check) missing.push('.check()');
    if (!this._extends) missing.push('.\u200Bextends()');
    if (!this._true) missing.push('.do()');
    if (!this._false) missing.push('.otherwise()');
    return missing;
  }

  private resolveType(type: Type): Type {
    if (typeof type === 'string' && type in keywordSyntaxKind) {
      return ts.factory.createKeywordTypeNode(
        keywordSyntaxKind[type as Exclude<KeywordTypeName, 'null'>],
      );
    }
    return type;
  }
}
