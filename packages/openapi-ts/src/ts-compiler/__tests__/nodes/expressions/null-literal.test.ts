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

describe('null-literal', () => {
  it('const null', async () => {
    const file = ts.factory.createSourceFile([constStatement('x', ts.factory.createNull())]);
    await assertPrintedMatchesSnapshot(file, 'const-null.ts');
  });
});
