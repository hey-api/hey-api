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

describe('spread-element', () => {
  it('spread identifier', async () => {
    const file = ts.factory.createSourceFile([
      constStatement(
        's',
        ts.factory.createArrayLiteralExpression([
          ts.factory.createSpreadElement(ts.factory.createIdentifier('rest')),
        ]),
      ),
    ]);
    await assertPrintedMatchesSnapshot(file, 'spread-identifier.ts');
  });
});
