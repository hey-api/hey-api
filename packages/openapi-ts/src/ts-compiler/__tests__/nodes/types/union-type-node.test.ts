import { ts } from '../../../index';
import { assertPrintedMatchesSnapshot } from '../utils';

function castStatement(name: string, type: ts.TypeNode) {
  return ts.factory.createVariableStatement(
    undefined,
    ts.factory.createVariableDeclarationList(
      [
        ts.factory.createVariableDeclaration(
          name,
          undefined,
          undefined,
          ts.factory.createAsExpression(ts.factory.createIdentifier('value'), type),
        ),
      ],
      ts.NodeFlags.Const,
    ),
  );
}

describe('union-type-node', () => {
  it('union of keywords', async () => {
    const file = ts.factory.createSourceFile([
      castStatement(
        'x',
        ts.factory.createUnionTypeNode([
          ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
          ts.factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword),
        ]),
      ),
    ]);
    await assertPrintedMatchesSnapshot(file, 'union.ts');
  });

  it('union with constructor type member', async () => {
    const file = ts.factory.createSourceFile([
      castStatement(
        'x',
        ts.factory.createUnionTypeNode([
          ts.factory.createTypeReferenceNode('A'),
          ts.factory.createConstructorTypeNode(
            undefined,
            undefined,
            [],
            ts.factory.createTypeReferenceNode('B'),
          ),
        ]),
      ),
    ]);
    await assertPrintedMatchesSnapshot(file, 'union-constructor-type.ts');
  });
});
