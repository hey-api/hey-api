import { ts } from '../../../index';
import { assertPrintedMatchesSnapshot } from '../utils';

describe('while-statement', () => {
  it('while', async () => {
    const file = ts.factory.createSourceFile([
      ts.factory.createWhileStatement(
        ts.factory.createIdentifier('cond'),
        ts.factory.createBlock(
          [
            ts.factory.createExpressionStatement(
              ts.factory.createCallExpression(ts.factory.createIdentifier('step'), undefined, []),
            ),
          ],
          true,
        ),
      ),
    ]);
    await assertPrintedMatchesSnapshot(file, 'while.ts');
  });
});
