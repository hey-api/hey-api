import { ts } from '../../../index';
import { assertPrintedMatchesSnapshot } from '../utils';

describe('yield-expression', () => {
  it('yield with expression', async () => {
    const file = ts.factory.createSourceFile([
      ts.factory.createFunctionDeclaration(
        undefined,
        ts.factory.createToken(ts.SyntaxKind.AsteriskToken),
        'gen',
        undefined,
        [],
        undefined,
        ts.factory.createBlock(
          [
            ts.factory.createExpressionStatement(
              ts.factory.createYieldExpression(undefined, ts.factory.createNumericLiteral(1)),
            ),
          ],
          true,
        ),
      ),
    ]);
    await assertPrintedMatchesSnapshot(file, 'yield.ts');
  });

  it('yield delegate with expression', async () => {
    const file = ts.factory.createSourceFile([
      ts.factory.createFunctionDeclaration(
        undefined,
        ts.factory.createToken(ts.SyntaxKind.AsteriskToken),
        'gen',
        undefined,
        [],
        undefined,
        ts.factory.createBlock(
          [
            ts.factory.createExpressionStatement(
              ts.factory.createYieldExpression(
                ts.factory.createToken(ts.SyntaxKind.AsteriskToken),
                ts.factory.createIdentifier('inner'),
              ),
            ),
          ],
          true,
        ),
      ),
    ]);
    await assertPrintedMatchesSnapshot(file, 'yield-delegate.ts');
  });

  it('plain yield', async () => {
    const file = ts.factory.createSourceFile([
      ts.factory.createFunctionDeclaration(
        undefined,
        ts.factory.createToken(ts.SyntaxKind.AsteriskToken),
        'gen',
        undefined,
        [],
        undefined,
        ts.factory.createBlock(
          [
            ts.factory.createExpressionStatement(
              ts.factory.createYieldExpression(undefined, undefined),
            ),
          ],
          true,
        ),
      ),
    ]);
    await assertPrintedMatchesSnapshot(file, 'yield-plain.ts');
  });
});
