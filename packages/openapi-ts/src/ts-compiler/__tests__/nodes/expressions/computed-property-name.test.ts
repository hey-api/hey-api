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

describe('computed-property-name', () => {
  it('string expression', async () => {
    const file = ts.factory.createSourceFile([
      constStatement(
        'x',
        ts.factory.createComputedPropertyName(ts.factory.createStringLiteral('key')),
      ),
    ]);
    await assertPrintedMatchesSnapshot(file, 'string-expression.ts');
  });

  it('identifier expression', async () => {
    const file = ts.factory.createSourceFile([
      constStatement(
        'x',
        ts.factory.createComputedPropertyName(ts.factory.createIdentifier('key')),
      ),
    ]);
    await assertPrintedMatchesSnapshot(file, 'identifier-expression.ts');
  });
});
