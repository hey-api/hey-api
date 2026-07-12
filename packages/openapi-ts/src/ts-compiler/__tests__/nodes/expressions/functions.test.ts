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

describe('functions', () => {
  it('arrow function concise body', async () => {
    const file = ts.factory.createSourceFile([
      constStatement(
        'f',
        ts.factory.createArrowFunction(
          undefined,
          undefined,
          [],
          undefined,
          undefined,
          ts.factory.createNumericLiteral(1),
        ),
      ),
    ]);
    await assertPrintedMatchesSnapshot(file, 'arrow-concise.ts');
  });

  it('generic arrow function', async () => {
    const file = ts.factory.createSourceFile([
      constStatement(
        'identity',
        ts.factory.createArrowFunction(
          undefined,
          [ts.factory.createTypeParameterDeclaration(undefined, 'T')],
          [
            ts.factory.createParameterDeclaration(
              undefined,
              undefined,
              'value',
              undefined,
              ts.factory.createTypeReferenceNode('T'),
            ),
          ],
          ts.factory.createTypeReferenceNode('T'),
          undefined,
          ts.factory.createIdentifier('value'),
        ),
      ),
    ]);
    await assertPrintedMatchesSnapshot(file, 'arrow-generic.ts');
  });

  it('function expression', async () => {
    const file = ts.factory.createSourceFile([
      constStatement(
        'f',
        ts.factory.createFunctionExpression(
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          ts.factory.createBlock([]),
        ),
      ),
    ]);
    await assertPrintedMatchesSnapshot(file, 'function-expression.ts');
  });

  it('named function expression', async () => {
    const file = ts.factory.createSourceFile([
      constStatement(
        'f',
        ts.factory.createFunctionExpression(
          undefined,
          undefined,
          'foo',
          undefined,
          undefined,
          undefined,
          ts.factory.createBlock([]),
        ),
      ),
    ]);
    await assertPrintedMatchesSnapshot(file, 'function-expression-named.ts');
  });
});
