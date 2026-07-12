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

describe('conditional-expression', () => {
  it('ternary', async () => {
    const file = ts.factory.createSourceFile([
      constStatement(
        'r',
        ts.factory.createConditionalExpression(
          ts.factory.createIdentifier('cond'),
          undefined,
          ts.factory.createNumericLiteral(1),
          undefined,
          ts.factory.createNumericLiteral(2),
        ),
      ),
    ]);
    await assertPrintedMatchesSnapshot(file, 'ternary.ts');
  });
});
