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

describe('delete-expression', () => {
  it('delete identifier', async () => {
    const file = ts.factory.createSourceFile([
      constStatement('d', ts.factory.createDeleteExpression(ts.factory.createIdentifier('obj'))),
    ]);
    await assertPrintedMatchesSnapshot(file, 'delete-identifier.ts');
  });
});
