import { ts } from '../../../index';
import { assertPrintedMatchesSnapshot } from '../utils';

describe('function-declaration', () => {
  it('no params with body', async () => {
    const file = ts.factory.createSourceFile([
      ts.factory.createFunctionDeclaration(
        undefined,
        undefined,
        'main',
        undefined,
        [],
        undefined,
        ts.factory.createBlock([]),
      ),
    ]);
    await assertPrintedMatchesSnapshot(file, 'no-params-with-body.ts');
  });

  it('exported async generic', async () => {
    const file = ts.factory.createSourceFile([
      ts.factory.createFunctionDeclaration(
        [
          ts.factory.createModifier(ts.SyntaxKind.ExportKeyword),
          ts.factory.createModifier(ts.SyntaxKind.AsyncKeyword),
        ],
        ts.factory.createToken(ts.SyntaxKind.AsteriskToken),
        'gen',
        [
          ts.factory.createTypeParameterDeclaration(undefined, 'T'),
          ts.factory.createTypeParameterDeclaration(undefined, 'U'),
        ],
        [ts.factory.createParameterDeclaration(undefined, undefined, 'value')],
        undefined,
        ts.factory.createBlock([]),
      ),
    ]);
    await assertPrintedMatchesSnapshot(file, 'exported-async-generic.ts');
  });

  it('ambient overload', async () => {
    const file = ts.factory.createSourceFile([
      ts.factory.createFunctionDeclaration(
        undefined,
        undefined,
        'noop',
        undefined,
        [],
        undefined,
        undefined,
      ),
    ]);
    await assertPrintedMatchesSnapshot(file, 'ambient-overload.ts');
  });
});
