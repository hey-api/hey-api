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

describe('false-literal', () => {
  it('const false', async () => {
    const file = ts.factory.createSourceFile([constStatement('x', ts.factory.createFalse())]);
    await assertPrintedMatchesSnapshot(file, 'const-false.ts');
  });
});
