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

describe('regular-expression-literal', () => {
  it('const regex', async () => {
    const file = ts.factory.createSourceFile([
      constStatement('x', ts.factory.createRegularExpressionLiteral('/ab+c/gi')),
    ]);
    await assertPrintedMatchesSnapshot(file, 'const-regex.ts');
  });
});
