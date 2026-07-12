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

describe('access-call', () => {
  it('call expression', async () => {
    const file = ts.factory.createSourceFile([
      constStatement(
        'a',
        ts.factory.createCallExpression(ts.factory.createIdentifier('fn'), undefined, [
          ts.factory.createNumericLiteral(1),
          ts.factory.createStringLiteral('x'),
        ]),
      ),
    ]);
    await assertPrintedMatchesSnapshot(file, 'call.ts');
  });

  it('new expression', async () => {
    const file = ts.factory.createSourceFile([
      constStatement(
        'b',
        ts.factory.createNewExpression(ts.factory.createIdentifier('Map'), undefined, []),
      ),
    ]);
    await assertPrintedMatchesSnapshot(file, 'new.ts');
  });

  it('property access expression', async () => {
    const file = ts.factory.createSourceFile([
      constStatement(
        'c',
        ts.factory.createPropertyAccessExpression(ts.factory.createIdentifier('obj'), 'prop'),
      ),
    ]);
    await assertPrintedMatchesSnapshot(file, 'property-access.ts');
  });

  it('element access expression', async () => {
    const file = ts.factory.createSourceFile([
      constStatement(
        'd',
        ts.factory.createElementAccessExpression(ts.factory.createIdentifier('arr'), 0),
      ),
    ]);
    await assertPrintedMatchesSnapshot(file, 'element-access.ts');
  });

  it('parenthesized expression', async () => {
    const file = ts.factory.createSourceFile([
      constStatement(
        'e',
        ts.factory.createPropertyAccessExpression(
          ts.factory.createParenthesizedExpression(ts.factory.createNumericLiteral(1)),
          'toString',
        ),
      ),
    ]);
    await assertPrintedMatchesSnapshot(file, 'parenthesized.ts');
  });

  it('non-null expression', async () => {
    const file = ts.factory.createSourceFile([
      constStatement('f', ts.factory.createNonNullExpression(ts.factory.createIdentifier('value'))),
    ]);
    await assertPrintedMatchesSnapshot(file, 'non-null.ts');
  });

  it('expression with type arguments', async () => {
    const file = ts.factory.createSourceFile([
      constStatement(
        'g',
        ts.factory.createExpressionWithTypeArguments(
          ts.factory.createIdentifier('factory'),
          undefined,
        ),
      ),
    ]);
    await assertPrintedMatchesSnapshot(file, 'expression-with-type-arguments.ts');
  });
});
