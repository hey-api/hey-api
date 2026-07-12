import { ts } from '../../../index';
import { assertPrintedMatchesSnapshot } from '../utils';

describe('for-of-statement', () => {
  it('for of', async () => {
    const file = ts.factory.createSourceFile([
      ts.factory.createForOfStatement(
        undefined,
        ts.factory.createVariableDeclarationList(
          [ts.factory.createVariableDeclaration('item', undefined, undefined, undefined)],
          ts.NodeFlags.Const,
        ),
        ts.factory.createIdentifier('items'),
        ts.factory.createBlock(
          [ts.factory.createExpressionStatement(ts.factory.createIdentifier('item'))],
          true,
        ),
      ),
    ]);
    await assertPrintedMatchesSnapshot(file, 'for-of.ts');
  });
});
