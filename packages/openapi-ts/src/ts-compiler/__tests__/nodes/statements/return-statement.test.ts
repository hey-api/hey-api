import { ts } from '../../../index';
import { assertPrintedMatchesSnapshot } from '../utils';

describe('return-statement', () => {
  it('return value', async () => {
    const file = ts.factory.createSourceFile([
      ts.factory.createBlock(
        [ts.factory.createReturnStatement(ts.factory.createNumericLiteral(1))],
        true,
      ),
    ]);
    await assertPrintedMatchesSnapshot(file, 'return-value.ts');
  });

  it('return void', async () => {
    const file = ts.factory.createSourceFile([
      ts.factory.createBlock([ts.factory.createReturnStatement()], true),
    ]);
    await assertPrintedMatchesSnapshot(file, 'return-void.ts');
  });
});
