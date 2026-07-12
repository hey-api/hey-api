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

describe('prefix-unary-expression', () => {
  it('negation', async () => {
    const file = ts.factory.createSourceFile([
      constStatement(
        'n',
        ts.factory.createPrefixUnaryExpression(
          ts.SyntaxKind.MinusToken,
          ts.factory.createNumericLiteral(1),
        ),
      ),
    ]);
    await assertPrintedMatchesSnapshot(file, 'negation.ts');
  });
});
