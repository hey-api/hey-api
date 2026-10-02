import path from 'node:path';

import ts from 'typescript';

const pluginsDir = path.join(import.meta.dirname, '..', '..');

describe('client bundles', () => {
  it('pass noImplicitReturns without strictNullChecks', () => {
    const program = ts.createProgram(
      ts.sys.readDirectory(pluginsDir, ['.ts'], undefined, ['client-*/bundle/*.ts']),
      {
        lib: ['lib.es2022.d.ts', 'lib.dom.d.ts', 'lib.dom.iterable.d.ts'],
        module: ts.ModuleKind.ESNext,
        moduleResolution: ts.ModuleResolutionKind.Bundler,
        noEmit: true,
        noImplicitReturns: true,
        skipLibCheck: true,
        strict: false,
        target: ts.ScriptTarget.ES2022,
      },
    );
    const errors = ts
      .getPreEmitDiagnostics(program)
      .filter((diagnostic) => diagnostic.code === 7030)
      .map((diagnostic) => {
        const { line } = diagnostic.file!.getLineAndCharacterOfPosition(diagnostic.start!);
        return `${path.relative(pluginsDir, diagnostic.file!.fileName)}:${line + 1}`;
      });
    expect(errors).toEqual([]);
  });
});
