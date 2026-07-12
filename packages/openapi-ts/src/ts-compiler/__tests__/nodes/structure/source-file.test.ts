import { ts } from '../../../index';
import { assertPrintedMatchesSnapshot } from '../utils';

describe('source file', () => {
  it('simple', async () => {
    const file = ts.factory.createSourceFile([]);
    await assertPrintedMatchesSnapshot(file, 'simple.ts');
  });
});
