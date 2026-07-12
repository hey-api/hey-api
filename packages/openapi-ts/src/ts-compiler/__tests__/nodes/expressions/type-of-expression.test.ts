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

describe('type-of-expression', () => {
  it('typeof identifier', async () => {
    const file = ts.factory.createSourceFile([
      constStatement('t', ts.factory.createTypeOfExpression(ts.factory.createIdentifier('value'))),
    ]);
    await assertPrintedMatchesSnapshot(file, 'typeof-identifier.ts');
  });
});
