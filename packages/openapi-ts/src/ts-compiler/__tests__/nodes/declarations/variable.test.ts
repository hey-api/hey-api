import { ts } from '../../../index';
import { assertPrintedMatchesSnapshot } from '../utils';

function constStatement(name: string, initializer: ts.Expression) {
  return ts.factory.createVariableStatement(
    undefined,
    ts.factory.createVariableDeclarationList(
      [ts.factory.createVariableDeclaration(name, undefined, undefined, initializer)],
      ts.NodeFlags.Const,
    ),
  );
}

describe('variable', () => {
  it('const number', async () => {
    const file = ts.factory.createSourceFile([
      constStatement('x', ts.factory.createNumericLiteral(1)),
    ]);
    await assertPrintedMatchesSnapshot(file, 'const-number.ts');
  });

  it('const identifier', async () => {
    const file = ts.factory.createSourceFile([
      constStatement('y', ts.factory.createIdentifier('x')),
    ]);
    await assertPrintedMatchesSnapshot(file, 'const-identifier.ts');
  });

  it('const string', async () => {
    const file = ts.factory.createSourceFile([
      constStatement('s', ts.factory.createStringLiteral('hello')),
    ]);
    await assertPrintedMatchesSnapshot(file, 'const-string.ts');
  });
});
