import { ts } from '../../../index';
import { assertPrintedMatchesSnapshot } from '../utils';

describe('class-expression', () => {
  it('named class expression with heritage', async () => {
    const classExpression = ts.factory.createClassExpression(
      undefined,
      ts.factory.createIdentifier('Derived'),
      undefined,
      [
        ts.factory.createHeritageClause(ts.SyntaxKind.ExtendsKeyword, [
          ts.factory.createExpressionWithTypeArguments(
            ts.factory.createIdentifier('Base'),
            undefined,
          ),
        ]),
      ],
      [
        ts.factory.createMethodDeclaration(
          undefined,
          undefined,
          'greet',
          undefined,
          undefined,
          [],
          undefined,
          ts.factory.createBlock(
            [ts.factory.createReturnStatement(ts.factory.createStringLiteral('hi'))],
            true,
          ),
        ),
      ],
    );
    const file = ts.factory.createSourceFile([
      ts.factory.createVariableStatement(
        undefined,
        ts.factory.createVariableDeclarationList(
          [ts.factory.createVariableDeclaration('Derived', undefined, undefined, classExpression)],
          ts.NodeFlags.Const,
        ),
      ),
    ]);
    await assertPrintedMatchesSnapshot(file, 'class-expression.ts');
  });

  it('anonymous empty class expression', async () => {
    const file = ts.factory.createSourceFile([
      ts.factory.createVariableStatement(
        undefined,
        ts.factory.createVariableDeclarationList(
          [
            ts.factory.createVariableDeclaration(
              'C',
              undefined,
              undefined,
              ts.factory.createClassExpression(undefined, undefined, undefined, undefined, []),
            ),
          ],
          ts.NodeFlags.Const,
        ),
      ),
    ]);
    await assertPrintedMatchesSnapshot(file, 'class-expression-anonymous.ts');
  });
});
