import type { TsNodeBase } from '../base';
import { TsNodeKind } from '../kinds';
import type { ScriptKind } from '../script-kind';
import type { ScriptTarget } from '../script-target';
import type { TsStatement } from '../statement';

export interface TsSourceFile extends TsNodeBase {
  kind: TsNodeKind.SourceFile;
  statements: ReadonlyArray<TsStatement>;
}

export function createSourceFile(
  statements: ReadonlyArray<TsStatement>,
  leadingComments?: ReadonlyArray<string>,
  trailingComments?: ReadonlyArray<string>,
): TsSourceFile {
  return {
    kind: TsNodeKind.SourceFile,
    leadingComments,
    statements,
    trailingComments,
  };
}

export function parseSourceFile(
  _fileName: string,
  _sourceText: string,
  _languageVersion: ScriptTarget,
  _setParentNodes?: boolean,
  _scriptKind?: ScriptKind,
): TsSourceFile {
  return { kind: TsNodeKind.SourceFile, statements: [] };
}
