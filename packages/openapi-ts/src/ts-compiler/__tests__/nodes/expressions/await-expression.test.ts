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

describe('await-expression', () => {
  it('await identifier', async () => {
    const file = ts.factory.createSourceFile([
      constStatement('r', ts.factory.createAwaitExpression(ts.factory.createIdentifier('promise'))),
    ]);
    await assertPrintedMatchesSnapshot(file, 'await-identifier.ts');
  });
});
