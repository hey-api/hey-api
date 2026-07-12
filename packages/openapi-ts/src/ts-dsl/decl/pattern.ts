import type { AnalysisContext } from '@hey-api/codegen-core';
import type { MaybeArray } from '@hey-api/types';

import { ts } from '../../ts-compiler';
import { TsDsl } from '../base';
import { IdTsDsl } from '../expr/id';
import { TokenTsDsl } from '../token';

const Mixed = TsDsl<ts.BindingName>;

/**
 * Builds binding patterns (e.g., `{ foo, bar }`, `[a, b, ...rest]`).
 */
export class PatternTsDsl extends Mixed {
  readonly '~dsl' = 'PatternTsDsl';

  protected pattern?:
    | { kind: 'array'; values: ReadonlyArray<string> }
    | { kind: 'object'; values: Record<string, string> };
  protected _spread?: string;

  override analyze(ctx: AnalysisContext): void {
    super.analyze(ctx);
  }

  /** Returns true when all required builder calls are present. */
  get isValid(): boolean {
    return !this.missingRequiredCalls().length;
  }

  /** Defines an array pattern (e.g., `[a, b, c]`). */
  array(...props: ReadonlyArray<string> | [ReadonlyArray<string>]): this {
    const values = props[0] instanceof Array ? [...props[0]] : (props as ReadonlyArray<string>);
    this.pattern = { kind: 'array', values };
    return this;
  }

  /** Defines an object pattern (e.g., `{ a, b: alias }`). */
  object(...props: ReadonlyArray<MaybeArray<string> | Record<string, string>>): this {
    const entries: Record<string, string> = {};
    for (const p of props) {
      if (typeof p === 'string') entries[p] = p;
      else if (p instanceof Array) for (const n of p) entries[n] = n;
      else Object.assign(entries, p);
    }
    this.pattern = { kind: 'object', values: entries };
    return this;
  }

  /** Adds a spread element (e.g., `...rest`, `...options`, `...args`). */
  spread(name: string): this {
    this._spread = name;
    return this;
  }

  override toAst() {
    this.$validate();

    if (this.pattern.kind === 'object') {
      const elements = Object.entries(this.pattern.values).map(([key, alias]) =>
        key === alias
          ? ts.factory.createBindingElement(undefined, undefined, key, undefined)
          : ts.factory.createBindingElement(undefined, key, alias, undefined),
      );
      const spread = this.createSpread();
      if (spread) elements.push(spread);
      return ts.factory.createObjectBindingPattern(elements);
    }

    if (this.pattern.kind === 'array') {
      const elements = this.pattern.values.map((p) =>
        ts.factory.createBindingElement(undefined, undefined, p, undefined),
      );
      const spread = this.createSpread();
      if (spread) elements.push(spread);
      return ts.factory.createArrayBindingPattern(elements);
    }

    throw new Error('PatternTsDsl requires object() or array() pattern');
  }

  $validate(): asserts this is this & {
    pattern:
      | { kind: 'array'; values: ReadonlyArray<string> }
      | { kind: 'object'; values: Record<string, string> };
  } {
    const missing = this.missingRequiredCalls();
    if (!missing.length) return;
    throw new Error(`Binding pattern missing ${missing.join(' and ')}`);
  }

  private missingRequiredCalls(): ReadonlyArray<string> {
    const missing: Array<string> = [];
    if (!this.pattern) missing.push('.array() or .object()');
    return missing;
  }

  private createSpread(): ts.BindingElement | undefined {
    return this._spread
      ? ts.factory.createBindingElement(
          this.$node(new TokenTsDsl().spread()),
          undefined,
          this.$node(new IdTsDsl(this._spread)),
        )
      : undefined;
  }
}
