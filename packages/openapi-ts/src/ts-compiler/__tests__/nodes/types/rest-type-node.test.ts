import { ts } from '../../../index';
import { assertPrintedMatchesSnapshot } from '../utils';

describe('rest-type-node', () => {
  it('rest tuple member', async () => {
    const file = ts.factory.createSourceFile([
      ts.factory.createTypeAliasDeclaration(
        undefined,
        'Args',
        undefined,
        ts.factory.createTupleTypeNode([
          ts.factory.createTypeReferenceNode('A'),
          ts.factory.createRestTypeNode(
            ts.factory.createArrayTypeNode(ts.factory.createTypeReferenceNode('B')),
          ),
        ]),
      ),
    ]);
    await assertPrintedMatchesSnapshot(file, 'rest-type.ts');
  });
});
