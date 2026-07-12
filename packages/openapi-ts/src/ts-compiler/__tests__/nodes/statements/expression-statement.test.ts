import { ts } from '../../../index';
import { assertPrintedMatchesSnapshot } from '../utils';

describe('expression-statement', () => {
  it('expression statement', async () => {
    const file = ts.factory.createSourceFile([
      ts.factory.createExpressionStatement(ts.factory.createIdentifier('foo')),
    ]);
    await assertPrintedMatchesSnapshot(file, 'expression-statement.ts');
  });
});
