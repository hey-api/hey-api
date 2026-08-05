import { ts } from '../../../index';
import { assertPrintedMatchesSnapshot } from '../utils';

describe('class-static-block-declaration', () => {
  it('static block', async () => {
    const file = ts.factory.createSourceFile([
      ts.factory.createClassDeclaration(undefined, 'Counter', undefined, undefined, [
        ts.factory.createPropertyDeclaration(
          [ts.factory.createModifier(ts.SyntaxKind.StaticKeyword)],
          'count',
          undefined,
          undefined,
          ts.factory.createNumericLiteral(0),
        ),
        ts.factory.createClassStaticBlockDeclaration(
          ts.factory.createBlock(
            [
              ts.factory.createExpressionStatement(
                ts.factory.createBinaryExpression(
                  ts.factory.createPropertyAccessExpression(
                    ts.factory.createIdentifier('Counter'),
                    'count',
                  ),
                  ts.factory.createToken(ts.SyntaxKind.EqualsToken),
                  ts.factory.createNumericLiteral(1),
                ),
              ),
            ],
            true,
          ),
        ),
      ]),
    ]);
    await assertPrintedMatchesSnapshot(file, 'class-static-block-declaration.ts');
  });
});
