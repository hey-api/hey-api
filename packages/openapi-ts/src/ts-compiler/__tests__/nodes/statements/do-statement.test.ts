import { ts } from '../../../index';
import { assertPrintedMatchesSnapshot } from '../utils';

describe('do-statement', () => {
  it('do while', async () => {
    const file = ts.factory.createSourceFile([
      ts.factory.createDoStatement(
        ts.factory.createBlock(
          [
            ts.factory.createExpressionStatement(
              ts.factory.createCallExpression(ts.factory.createIdentifier('step'), undefined, []),
            ),
          ],
          true,
        ),
        ts.factory.createIdentifier('cond'),
      ),
    ]);
    await assertPrintedMatchesSnapshot(file, 'do-while.ts');
  });
});
