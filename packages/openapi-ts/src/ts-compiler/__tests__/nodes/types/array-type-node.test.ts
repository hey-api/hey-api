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

describe('array-type-node', () => {
  it('array of keyword', async () => {
    const file = ts.factory.createSourceFile([
      castStatement(
        'x',
        ts.factory.createArrayTypeNode(
          ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
        ),
      ),
    ]);
    await assertPrintedMatchesSnapshot(file, 'array.ts');
  });
});
