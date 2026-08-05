import { ts } from '../../../index';
import { assertPrintedMatchesSnapshot } from '../utils';

describe('comma-list-expression', () => {
  it('comma list', async () => {
    const file = ts.factory.createSourceFile([
      ts.factory.createForStatement(
        undefined,
        undefined,
        ts.factory.createCommaListExpression([
          ts.factory.createPostfixUnaryExpression(
            ts.factory.createIdentifier('i'),
            ts.SyntaxKind.PlusPlusToken,
          ),
          ts.factory.createPostfixUnaryExpression(
            ts.factory.createIdentifier('j'),
            ts.SyntaxKind.MinusMinusToken,
          ),
        ]),
        ts.factory.createBlock([], true),
      ),
    ]);
    await assertPrintedMatchesSnapshot(file, 'comma-list.ts');
  });
});
