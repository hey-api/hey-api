import type { AnalysisContext } from '@hey-api/codegen-core';
import type { MaybeArray } from '@hey-api/types';

import { ts } from '../../ts-compiler';
import { TsDsl } from '../base';
import { IdTsDsl } from '../expr/id';
import type { TsDslContext } from '../utils/context';
import { ctx } from '../utils/context';

type NoteMaybeLazy<T> = ((ctx: TsDslContext) => T) | T;
export type NoteFn = (d: NoteTsDsl) => void;
export type NoteLines = NoteMaybeLazy<MaybeArray<string>>;

export class NoteTsDsl extends TsDsl<ts.Node> {
  readonly '~dsl' = 'NoteTsDsl';

  protected _lines: Array<NoteLines> = [];

  constructor(lines?: NoteLines, fn?: NoteFn) {
    super();
    if (lines) this.add(lines);
    fn?.(this);
  }

  override analyze(ctx: AnalysisContext): void {
    super.analyze(ctx);
  }

  add(lines: NoteLines): this {
    this._lines.push(lines);
    return this;
  }

  apply<T extends ts.Node>(node: T): T {
    const lines = this._lines.reduce((lines: Array<string>, line: NoteLines) => {
      if (typeof line === 'function') line = line(ctx);
      for (const l of typeof line === 'string' ? [line] : line) {
        if (l || l === '') lines.push(l);
      }
      return lines;
    }, []);
    if (!lines.length) return node;

    ts.addSyntheticLeadingComment(
      node,
      ts.SyntaxKind.MultiLineCommentTrivia,
      `\n${lines.join('\n')}\n`,
      true,
    );

    return node;
  }

  override toAst() {
    // this class does not build a standalone node;
    // it modifies other nodes via `apply()`.
    // Return a dummy comment node for compliance.
    return this.$node(new IdTsDsl(''));
  }
}
