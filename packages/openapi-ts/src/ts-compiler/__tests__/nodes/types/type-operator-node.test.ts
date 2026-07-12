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

describe('type-operator-node', () => {
  it('keyof operator', async () => {
    const file = ts.factory.createSourceFile([
      castStatement(
        'x',
        ts.factory.createTypeOperatorNode(
          ts.SyntaxKind.KeyOfKeyword,
          ts.factory.createTypeReferenceNode('T'),
        ),
      ),
    ]);
    await assertPrintedMatchesSnapshot(file, 'type-operator.ts');
  });
});
