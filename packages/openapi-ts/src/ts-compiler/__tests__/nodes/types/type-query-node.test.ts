import { ts } from '../../../index';
import { assertPrintedMatchesSnapshot } from '../utils';

function castStatement(name: string, type: ts.TypeNode) {
  return ts.factory.createVariableStatement(
    undefined,
    ts.factory.createVariableDeclarationList(
      [
        ts.factory.createVariableDeclaration(
          name,
          undefined,
          undefined,
          ts.factory.createAsExpression(ts.factory.createIdentifier('value'), type),
        ),
      ],
      ts.NodeFlags.Const,
    ),
  );
}

describe('type-query-node', () => {
  it('typeof query', async () => {
    const file = ts.factory.createSourceFile([
      castStatement('x', ts.factory.createTypeQueryNode(ts.factory.createIdentifier('y'))),
    ]);
    await assertPrintedMatchesSnapshot(file, 'type-query.ts');
  });
});
