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

describe('big-int-literal', () => {
  it('const bigint from string', async () => {
    const file = ts.factory.createSourceFile([
      constStatement('x', ts.factory.createBigIntLiteral('123n')),
    ]);
    await assertPrintedMatchesSnapshot(file, 'const-string.ts');
  });

  it('const bigint from pseudo', async () => {
    const file = ts.factory.createSourceFile([
      constStatement('y', ts.factory.createBigIntLiteral({ base10Value: '42', negative: true })),
    ]);
    await assertPrintedMatchesSnapshot(file, 'const-pseudo.ts');
  });
});
