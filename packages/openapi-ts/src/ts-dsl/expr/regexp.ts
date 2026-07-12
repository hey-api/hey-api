import type { AnalysisContext } from '@hey-api/codegen-core';

import { ts } from '../../ts-compiler';
import { TsDsl } from '../base';

type RegexFlag = 'g' | 'i' | 'm' | 's' | 'u' | 'y';

type RegexFlags<Avail extends string = RegexFlag> =
  | ''
  | {
      [K in Avail]: `${K}${RegexFlags<Exclude<Avail, K>>}`;
    }[Avail];

const Mixed = TsDsl<ts.RegularExpressionLiteral>;

export class RegExpTsDsl extends Mixed {
  readonly '~dsl' = 'RegExpTsDsl';

  protected pattern: string;
  protected flags?: RegexFlags;

  constructor(pattern: string, flags?: RegexFlags) {
    super();
    this.pattern = pattern;
    this.flags = flags;
  }

  override analyze(ctx: AnalysisContext): void {
    super.analyze(ctx);
  }

  override toAst() {
    const patternContent =
      this.pattern.startsWith('/') && this.pattern.endsWith('/')
        ? this.pattern.slice(1, -1)
        : this.pattern;
    const escapedPattern = patternContent.replace(/(?<!\\)\//g, '\\/');
    const literal = `/${escapedPattern}/${this.flags ?? ''}`;
    return ts.factory.createRegularExpressionLiteral(literal);
  }
}
