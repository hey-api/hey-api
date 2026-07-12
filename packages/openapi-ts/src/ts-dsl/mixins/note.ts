import type { AnalysisContext, Node } from '@hey-api/codegen-core';

import type { ts } from '../../ts-compiler';
import type { NoteFn, NoteLines } from '../layout/note';
import { NoteTsDsl } from '../layout/note';
import type { BaseCtor, MixinCtor } from './types';

export interface NoteMethods extends Node {
  $note<T extends ts.Node>(node: T): T;
  note(lines?: NoteLines, fn?: NoteFn): this;
}

export function NoteMixin<T extends ts.Node, TBase extends BaseCtor<T>>(Base: TBase) {
  abstract class Note extends Base {
    private _note?: NoteTsDsl;

    override analyze(ctx: AnalysisContext): void {
      super.analyze(ctx);
    }

    protected note(lines?: NoteLines, fn?: NoteFn): this {
      this._note = new NoteTsDsl(lines, fn);
      return this;
    }

    protected $note<T extends ts.Node>(node: T): T {
      return this._note ? this._note.apply(node) : node;
    }
  }

  return Note as unknown as MixinCtor<TBase, NoteMethods>;
}
