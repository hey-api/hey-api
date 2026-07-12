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

describe('qualified-name', () => {
  it('single', async () => {
    const file = ts.factory.createSourceFile([
      constStatement('x', ts.factory.createQualifiedName(ts.factory.createIdentifier('a'), 'b')),
    ]);
    await assertPrintedMatchesSnapshot(file, 'single.ts');
  });

  it('nested', async () => {
    const file = ts.factory.createSourceFile([
      constStatement(
        'x',
        ts.factory.createQualifiedName(
          ts.factory.createQualifiedName(ts.factory.createIdentifier('a'), 'b'),
          ts.factory.createIdentifier('c'),
        ),
      ),
    ]);
    await assertPrintedMatchesSnapshot(file, 'nested.ts');
  });
});
