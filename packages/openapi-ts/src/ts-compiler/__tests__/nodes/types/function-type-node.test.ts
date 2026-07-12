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

describe('function-type-node', () => {
  it('nullary function type', async () => {
    const file = ts.factory.createSourceFile([
      castStatement(
        'x',
        ts.factory.createFunctionTypeNode(
          undefined,
          [],
          ts.factory.createKeywordTypeNode(ts.SyntaxKind.VoidKeyword),
        ),
      ),
    ]);
    await assertPrintedMatchesSnapshot(file, 'nullary.ts');
  });
});
