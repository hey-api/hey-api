import { ts } from '../../../index';
import { assertPrintedMatchesSnapshot } from '../utils';

describe('simple-statements', () => {
  it('labeled loop with break', async () => {
    const file = ts.factory.createSourceFile([
      ts.factory.createLabeledStatement(
        ts.factory.createIdentifier('outer'),
        ts.factory.createForStatement(
          undefined,
          undefined,
          undefined,
          ts.factory.createBlock(
            [
              ts.factory.createIfStatement(
                ts.factory.createIdentifier('done'),
                ts.factory.createBreakStatement(ts.factory.createIdentifier('outer')),
              ),
            ],
            true,
          ),
        ),
      ),
    ]);
    await assertPrintedMatchesSnapshot(file, 'labeled-break.ts');
  });

  it('continue with label', async () => {
    const file = ts.factory.createSourceFile([
      ts.factory.createContinueStatement(ts.factory.createIdentifier('outer')),
    ]);
    await assertPrintedMatchesSnapshot(file, 'continue.ts');
  });

  it('debugger', async () => {
    const file = ts.factory.createSourceFile([ts.factory.createDebuggerStatement()]);
    await assertPrintedMatchesSnapshot(file, 'debugger.ts');
  });

  it('empty', async () => {
    const file = ts.factory.createSourceFile([ts.factory.createEmptyStatement()]);
    await assertPrintedMatchesSnapshot(file, 'empty.ts');
  });
});
