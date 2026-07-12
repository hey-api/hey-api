import { ts } from '../../../index';
import { assertPrintedMatchesSnapshot } from '../utils';

describe('block', () => {
  it('block', async () => {
    const file = ts.factory.createSourceFile([
      ts.factory.createBlock(
        [ts.factory.createReturnStatement(ts.factory.createIdentifier('x'))],
        true,
      ),
    ]);
    await assertPrintedMatchesSnapshot(file, 'block.ts');
  });
});
