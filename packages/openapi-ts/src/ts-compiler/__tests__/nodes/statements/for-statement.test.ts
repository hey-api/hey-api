import { ts } from '../../../index';
import { assertPrintedMatchesSnapshot } from '../utils';

describe('for-statement', () => {
  it('for', async () => {
    const file = ts.factory.createSourceFile([
      ts.factory.createForStatement(
        ts.factory.createVariableDeclarationList(
          [
            ts.factory.createVariableDeclaration(
              'i',
              undefined,
              undefined,
              ts.factory.createNumericLiteral(0),
            ),
          ],
          ts.NodeFlags.Let,
        ),
        ts.factory.createIdentifier('cond'),
        ts.factory.createIdentifier('i'),
        ts.factory.createBlock(
          [ts.factory.createExpressionStatement(ts.factory.createIdentifier('body'))],
          true,
        ),
      ),
    ]);
    await assertPrintedMatchesSnapshot(file, 'for.ts');
  });
});
