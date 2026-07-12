import { ts } from '../../../index';
import { assertPrintedMatchesSnapshot } from '../utils';

describe('enum-member', () => {
  it('with initializer', async () => {
    const file = ts.factory.createSourceFile([
      ts.factory.createEnumDeclaration(undefined, 'Status', [
        ts.factory.createEnumMember('Active', ts.factory.createStringLiteral('active')),
      ]),
    ]);
    await assertPrintedMatchesSnapshot(file, 'with-initializer.ts');
  });
});
