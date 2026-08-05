import { ts } from '../../../index';
import { assertPrintedMatchesSnapshot } from '../utils';

describe('switch-statement', () => {
  it('switch', async () => {
    const file = ts.factory.createSourceFile([
      ts.factory.createSwitchStatement(
        ts.factory.createIdentifier('value'),
        ts.factory.createCaseBlock([
          ts.factory.createCaseClause(ts.factory.createNumericLiteral(1), [
            ts.factory.createExpressionStatement(
              ts.factory.createCallExpression(ts.factory.createIdentifier('one'), undefined, []),
            ),
            ts.factory.createReturnStatement(),
          ]),
          ts.factory.createCaseClause(ts.factory.createNumericLiteral(2), [
            ts.factory.createExpressionStatement(
              ts.factory.createCallExpression(ts.factory.createIdentifier('two'), undefined, []),
            ),
            ts.factory.createReturnStatement(),
          ]),
          ts.factory.createDefaultClause([
            ts.factory.createExpressionStatement(
              ts.factory.createCallExpression(
                ts.factory.createIdentifier('fallback'),
                undefined,
                [],
              ),
            ),
          ]),
        ]),
      ),
    ]);
    await assertPrintedMatchesSnapshot(file, 'switch.ts');
  });
});
