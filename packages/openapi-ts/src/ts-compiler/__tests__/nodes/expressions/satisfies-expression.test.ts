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

describe('satisfies-expression', () => {
  it('satisfies type', async () => {
    const file = ts.factory.createSourceFile([
      constStatement(
        'x',
        ts.factory.createSatisfiesExpression(
          ts.factory.createIdentifier('value'),
          ts.factory.createIdentifier('Foo') as unknown as ts.TypeNode,
        ),
      ),
    ]);
    await assertPrintedMatchesSnapshot(file, 'satisfies-type.ts');
  });
});
