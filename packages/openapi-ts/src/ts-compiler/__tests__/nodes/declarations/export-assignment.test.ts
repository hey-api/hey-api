import { ts } from '../../../index';
import { assertPrintedMatchesSnapshot } from '../utils';

describe('export assignment', () => {
  it('export default', async () => {
    const file = ts.factory.createSourceFile([
      ts.factory.createExportAssignment(undefined, false, ts.factory.createIdentifier('foo')),
    ]);
    await assertPrintedMatchesSnapshot(file, 'export-default.ts');
  });

  it('export equals', async () => {
    const file = ts.factory.createSourceFile([
      ts.factory.createExportAssignment(undefined, true, ts.factory.createIdentifier('foo')),
    ]);
    await assertPrintedMatchesSnapshot(file, 'export-equals.ts');
  });
});
