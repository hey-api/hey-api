import { ts } from '../../../index';
import { assertPrintedMatchesSnapshot } from '../utils';

describe('parenthesized-type-node', () => {
  it('parenthesized union', async () => {
    const file = ts.factory.createSourceFile([
      ts.factory.createTypeAliasDeclaration(
        undefined,
        'Wrapped',
        undefined,
        ts.factory.createArrayTypeNode(
          ts.factory.createParenthesizedType(
            ts.factory.createUnionTypeNode([
              ts.factory.createTypeReferenceNode('A'),
              ts.factory.createTypeReferenceNode('B'),
            ]),
          ),
        ),
      ),
    ]);
    await assertPrintedMatchesSnapshot(file, 'parenthesized-type.ts');
  });
});
