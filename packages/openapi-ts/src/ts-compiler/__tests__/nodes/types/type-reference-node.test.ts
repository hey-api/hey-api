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

describe('type-reference-node', () => {
  it('plain reference', async () => {
    const file = ts.factory.createSourceFile([
      castStatement('x', ts.factory.createTypeReferenceNode('Foo')),
    ]);
    await assertPrintedMatchesSnapshot(file, 'plain.ts');
  });

  it('generic reference', async () => {
    const file = ts.factory.createSourceFile([
      castStatement(
        'x',
        ts.factory.createTypeReferenceNode('Array', [
          ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
        ]),
      ),
    ]);
    await assertPrintedMatchesSnapshot(file, 'generic.ts');
  });
});
