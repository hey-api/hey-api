import { ts } from '../../../index';
import { assertPrintedMatchesSnapshot } from '../utils';

describe('try-statement', () => {
  it('try catch', async () => {
    const file = ts.factory.createSourceFile([
      ts.factory.createTryStatement(
        ts.factory.createBlock(
          [ts.factory.createExpressionStatement(ts.factory.createIdentifier('risky'))],
          true,
        ),
        ts.factory.createCatchClause(
          ts.factory.createVariableDeclaration('error', undefined, undefined, undefined),
          ts.factory.createBlock(
            [ts.factory.createExpressionStatement(ts.factory.createIdentifier('handle'))],
            true,
          ),
        ),
        undefined,
      ),
    ]);
    await assertPrintedMatchesSnapshot(file, 'try-catch.ts');
  });

  it('try catch finally', async () => {
    const file = ts.factory.createSourceFile([
      ts.factory.createTryStatement(
        ts.factory.createBlock(
          [ts.factory.createExpressionStatement(ts.factory.createIdentifier('risky'))],
          true,
        ),
        ts.factory.createCatchClause(
          ts.factory.createVariableDeclaration('error', undefined, undefined, undefined),
          ts.factory.createBlock(
            [ts.factory.createExpressionStatement(ts.factory.createIdentifier('handle'))],
            true,
          ),
        ),
        ts.factory.createBlock(
          [ts.factory.createExpressionStatement(ts.factory.createIdentifier('cleanup'))],
          true,
        ),
      ),
    ]);
    await assertPrintedMatchesSnapshot(file, 'try-catch-finally.ts');
  });
});
