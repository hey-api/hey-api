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

describe('void-expression', () => {
  it('void numeric', async () => {
    const file = ts.factory.createSourceFile([
      constStatement('v', ts.factory.createVoidExpression(ts.factory.createNumericLiteral(0))),
    ]);
    await assertPrintedMatchesSnapshot(file, 'void-numeric.ts');
  });
});
