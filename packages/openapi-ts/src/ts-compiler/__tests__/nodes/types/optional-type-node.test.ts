import { ts } from '../../../index';
import { assertPrintedMatchesSnapshot } from '../utils';

describe('optional-type-node', () => {
  it('optional tuple member', async () => {
    const file = ts.factory.createSourceFile([
      ts.factory.createTypeAliasDeclaration(
        undefined,
        'Pair',
        undefined,
        ts.factory.createTupleTypeNode([
          ts.factory.createTypeReferenceNode('A'),
          ts.factory.createOptionalTypeNode(ts.factory.createTypeReferenceNode('B')),
        ]),
      ),
    ]);
    await assertPrintedMatchesSnapshot(file, 'optional-type.ts');
  });
});
