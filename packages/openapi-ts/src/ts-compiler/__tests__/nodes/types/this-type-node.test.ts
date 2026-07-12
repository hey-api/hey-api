import { ts } from '../../../index';
import { assertPrintedMatchesSnapshot } from '../utils';

describe('this-type-node', () => {
  it('this return type', async () => {
    const file = ts.factory.createSourceFile([
      ts.factory.createTypeAliasDeclaration(
        undefined,
        'Self',
        undefined,
        ts.factory.createThisTypeNode(),
      ),
    ]);
    await assertPrintedMatchesSnapshot(file, 'this-type.ts');
  });
});
