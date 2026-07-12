import { ts } from '../../../index';
import { assertPrintedMatchesSnapshot } from '../utils';

describe('if-statement', () => {
  it('if', async () => {
    const file = ts.factory.createSourceFile([
      ts.factory.createIfStatement(
        ts.factory.createIdentifier('cond'),
        ts.factory.createBlock(
          [ts.factory.createReturnStatement(ts.factory.createNumericLiteral(1))],
          true,
        ),
      ),
    ]);
    await assertPrintedMatchesSnapshot(file, 'if.ts');
  });

  it('if else', async () => {
    const file = ts.factory.createSourceFile([
      ts.factory.createIfStatement(
        ts.factory.createIdentifier('cond'),
        ts.factory.createBlock(
          [ts.factory.createReturnStatement(ts.factory.createNumericLiteral(1))],
          true,
        ),
        ts.factory.createBlock(
          [ts.factory.createReturnStatement(ts.factory.createNumericLiteral(2))],
          true,
        ),
      ),
    ]);
    await assertPrintedMatchesSnapshot(file, 'if-else.ts');
  });
});
