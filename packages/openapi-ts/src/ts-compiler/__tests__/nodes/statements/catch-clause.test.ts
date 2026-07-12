import { ts } from '../../../index';
import { assertPrintedMatchesSnapshot } from '../utils';

describe('catch-clause', () => {
  it('catch without binding', async () => {
    const file = ts.factory.createSourceFile([
      ts.factory.createTryStatement(
        ts.factory.createBlock(
          [ts.factory.createExpressionStatement(ts.factory.createIdentifier('risky'))],
          true,
        ),
        ts.factory.createCatchClause(
          undefined,
          ts.factory.createBlock(
            [ts.factory.createExpressionStatement(ts.factory.createIdentifier('handle'))],
            true,
          ),
        ),
        undefined,
      ),
    ]);
    await assertPrintedMatchesSnapshot(file, 'catch-no-binding.ts');
  });
});
