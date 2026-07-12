import { ts } from '../../../index';
import { assertPrintedMatchesSnapshot } from '../utils';

describe('throw-statement', () => {
  it('throw statement', async () => {
    const file = ts.factory.createSourceFile([
      ts.factory.createThrowStatement(ts.factory.createIdentifier('error')),
    ]);
    await assertPrintedMatchesSnapshot(file, 'throw-statement.ts');
  });
});
