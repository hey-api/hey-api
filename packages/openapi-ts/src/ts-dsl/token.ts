import { ts } from '../ts-compiler';
import { TsDsl } from './base';

export class TokenTsDsl<K extends ts.SyntaxKind = never> extends TsDsl<ts.Token<K>> {
  readonly '~dsl' = 'TokenTsDsl';

  protected _kind?: K;

  /** Sets the token kind */
  kind(kind: K): this {
    this._kind = kind;
    return this;
  }

  /** Creates `-` */
  minus(): TokenTsDsl<ts.SyntaxKind.MinusToken> {
    return (this as TokenTsDsl<ts.SyntaxKind.MinusToken>).kind(ts.SyntaxKind.MinusToken);
  }

  /** Creates `?` (optional) */
  optional(): TokenTsDsl<ts.SyntaxKind.QuestionToken> {
    return (this as TokenTsDsl<ts.SyntaxKind.QuestionToken>).kind(ts.SyntaxKind.QuestionToken);
  }

  /** Creates `+` */
  plus(): TokenTsDsl<ts.SyntaxKind.PlusToken> {
    return (this as TokenTsDsl<ts.SyntaxKind.PlusToken>).kind(ts.SyntaxKind.PlusToken);
  }

  /** Creates `?.` (optional chaining token) */
  questionDot(): TokenTsDsl<ts.SyntaxKind.QuestionDotToken> {
    return (this as TokenTsDsl<ts.SyntaxKind.QuestionDotToken>).kind(
      ts.SyntaxKind.QuestionDotToken,
    );
  }

  /** Creates `readonly` */
  readonly(): TokenTsDsl<ts.SyntaxKind.ReadonlyKeyword> {
    return (this as TokenTsDsl<ts.SyntaxKind.ReadonlyKeyword>).kind(ts.SyntaxKind.ReadonlyKeyword);
  }

  /** Creates `...` (spread / rest) */
  spread(): TokenTsDsl<ts.SyntaxKind.DotDotDotToken> {
    return (this as TokenTsDsl<ts.SyntaxKind.DotDotDotToken>).kind(ts.SyntaxKind.DotDotDotToken);
  }

  override toAst(): ts.Token<K> {
    this.$validate();
    // @ts-expect-error
    return ts.factory.createToken(this._kind);
  }

  $validate(): asserts this is this & {
    _kind: K;
  } {
    const missing = this.missingRequiredCalls();
    if (!missing.length) return;
    throw new Error(`Token missing ${missing.join(' and ')}`);
  }

  private missingRequiredCalls(): ReadonlyArray<string> {
    const missing: Array<string> = [];
    if (!this._kind) missing.push('.kind()');
    return missing;
  }

  /** Returns true when all required builder calls are present. */
  get isValid(): boolean {
    return !this.missingRequiredCalls().length;
  }
}
