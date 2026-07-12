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

describe('objects', () => {
  it('array literal', async () => {
    const file = ts.factory.createSourceFile([
      constStatement(
        'a',
        ts.factory.createArrayLiteralExpression([
          ts.factory.createNumericLiteral(1),
          ts.factory.createNumericLiteral(2),
          ts.factory.createNumericLiteral(3),
        ]),
      ),
    ]);
    await assertPrintedMatchesSnapshot(file, 'array-literal.ts');
  });

  it('empty array literal', async () => {
    const file = ts.factory.createSourceFile([
      constStatement('a', ts.factory.createArrayLiteralExpression()),
    ]);
    await assertPrintedMatchesSnapshot(file, 'empty-array.ts');
  });

  it('object literal', async () => {
    const file = ts.factory.createSourceFile([
      constStatement(
        'o',
        ts.factory.createObjectLiteralExpression([
          ts.factory.createPropertyAssignment('a', ts.factory.createNumericLiteral(1)),
          ts.factory.createPropertyAssignment('b', ts.factory.createNumericLiteral(2)),
        ]),
      ),
    ]);
    await assertPrintedMatchesSnapshot(file, 'object-literal.ts');
  });

  it('empty object literal', async () => {
    const file = ts.factory.createSourceFile([
      constStatement('o', ts.factory.createObjectLiteralExpression()),
    ]);
    await assertPrintedMatchesSnapshot(file, 'empty-object.ts');
  });

  it('shorthand and spread', async () => {
    const file = ts.factory.createSourceFile([
      constStatement(
        'o',
        ts.factory.createObjectLiteralExpression([
          ts.factory.createShorthandPropertyAssignment('a'),
          ts.factory.createSpreadAssignment(ts.factory.createIdentifier('b')),
          ts.factory.createPropertyAssignment('c', ts.factory.createNumericLiteral(1)),
        ]),
      ),
    ]);
    await assertPrintedMatchesSnapshot(file, 'shorthand-spread.ts');
  });
});
