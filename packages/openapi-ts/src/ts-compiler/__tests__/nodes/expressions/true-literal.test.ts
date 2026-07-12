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

describe('true-literal', () => {
  it('const true', async () => {
    const file = ts.factory.createSourceFile([constStatement('x', ts.factory.createTrue())]);
    await assertPrintedMatchesSnapshot(file, 'const-true.ts');
  });
});
