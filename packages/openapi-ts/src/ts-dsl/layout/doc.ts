import type { AnalysisContext } from '@hey-api/codegen-core';
import type { MaybeArray } from '@hey-api/types';

import { ts } from '../../ts-compiler';
import { TsDsl } from '../base';
import { IdTsDsl } from '../expr/id';
import type { TsDslContext } from '../utils/context';
import { ctx } from '../utils/context';

type DocMaybeLazy<T> = ((ctx: TsDslContext) => T) | T;
export type DocFn = (d: DocTsDsl) => void;
export type DocLines = DocMaybeLazy<MaybeArray<string>>;

export class DocTsDsl extends TsDsl<ts.Node> {
  readonly '~dsl' = 'DocTsDsl';

  protected _lines: Array<DocLines> = [];

  constructor(lines?: DocLines, fn?: DocFn) {
    super();
    if (lines) this.add(lines);
    fn?.(this);
  }

  override analyze(ctx: AnalysisContext): void {
    super.analyze(ctx);
  }

  add(lines: DocLines): this {
    this._lines.push(lines);
    return this;
  }

  apply<T extends ts.Node>(node: T): T {
    const lines = this._lines.reduce((lines: Array<string>, line: DocLines) => {
      if (typeof line === 'function') line = line(ctx);
      for (const l of typeof line === 'string' ? [line] : line) {
        if (l || l === '') lines.push(l);
      }
      return lines;
    }, []);
    if (!lines.length) return node;

    const body = [
      '*',
      ...lines
        .flatMap((line) => line.split('\n'))
        .map((line) => line.replace(/\s+$/, ''))
        .map((line) => (line ? ` * ${line}` : ' *')),
      ' ',
    ].join('\n');

    ts.addSyntheticLeadingComment(node, ts.SyntaxKind.MultiLineCommentTrivia, body, true);

    return node;
  }

  override toAst() {
    // this class does not build a standalone node;
    // it modifies other nodes via `apply()`.
    // Return a dummy comment node for compliance.
    return this.$node(new IdTsDsl(''));
  }
}
