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

describe('private-identifier', () => {
  it('const private identifier in object', async () => {
    const file = ts.factory.createSourceFile([
      constStatement(
        'x',
        ts.factory.createBinaryExpression(
          ts.factory.createPrivateIdentifier('#field'),
          ts.SyntaxKind.InKeyword,
          ts.factory.createIdentifier('obj'),
        ),
      ),
    ]);
    await assertPrintedMatchesSnapshot(file, 'const-in.ts');
  });
});
