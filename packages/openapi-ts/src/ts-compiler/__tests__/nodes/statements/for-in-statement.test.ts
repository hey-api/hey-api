import { ts } from '../../../index';
import { assertPrintedMatchesSnapshot } from '../utils';

describe('for-in-statement', () => {
  it('for in', async () => {
    const file = ts.factory.createSourceFile([
      ts.factory.createForInStatement(
        ts.factory.createVariableDeclarationList(
          [ts.factory.createVariableDeclaration('key', undefined, undefined, undefined)],
          ts.NodeFlags.Const,
        ),
        ts.factory.createIdentifier('obj'),
        ts.factory.createBlock(
          [ts.factory.createExpressionStatement(ts.factory.createIdentifier('key'))],
          true,
        ),
      ),
    ]);
    await assertPrintedMatchesSnapshot(file, 'for-in.ts');
  });
});
