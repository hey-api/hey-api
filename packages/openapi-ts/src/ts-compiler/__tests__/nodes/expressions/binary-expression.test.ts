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

describe('binary-expression', () => {
  it('addition', async () => {
    const file = ts.factory.createSourceFile([
      constStatement(
        'sum',
        ts.factory.createBinaryExpression(
          ts.factory.createNumericLiteral(1),
          ts.SyntaxKind.PlusToken,
          ts.factory.createNumericLiteral(2),
        ),
      ),
    ]);
    await assertPrintedMatchesSnapshot(file, 'addition.ts');
  });
});
