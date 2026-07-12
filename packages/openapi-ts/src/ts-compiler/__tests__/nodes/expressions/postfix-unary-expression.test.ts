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

describe('postfix-unary-expression', () => {
  it('increment', async () => {
    const file = ts.factory.createSourceFile([
      constStatement(
        'n',
        ts.factory.createPostfixUnaryExpression(
          ts.factory.createIdentifier('i'),
          ts.SyntaxKind.PlusPlusToken,
        ),
      ),
    ]);
    await assertPrintedMatchesSnapshot(file, 'increment.ts');
  });
});
