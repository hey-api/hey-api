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

describe('type-literal-node', () => {
  it('empty type literal', async () => {
    const file = ts.factory.createSourceFile([
      castStatement('x', ts.factory.createTypeLiteralNode(undefined)),
    ]);
    await assertPrintedMatchesSnapshot(file, 'empty.ts');
  });
});
