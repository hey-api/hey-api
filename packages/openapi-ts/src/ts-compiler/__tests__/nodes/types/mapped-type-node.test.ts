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

describe('mapped-type-node', () => {
  it('readonly optional mapped type', async () => {
    const file = ts.factory.createSourceFile([
      castStatement(
        'x',
        ts.factory.createMappedTypeNode(
          ts.factory.createToken(ts.SyntaxKind.ReadonlyKeyword),
          ts.factory.createTypeParameterDeclaration(
            undefined,
            'K',
            ts.factory.createTypeOperatorNode(
              ts.SyntaxKind.KeyOfKeyword,
              ts.factory.createTypeReferenceNode('T'),
            ),
            undefined,
          ),
          undefined,
          ts.factory.createToken(ts.SyntaxKind.QuestionToken),
          ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
          undefined,
        ),
      ),
    ]);
    await assertPrintedMatchesSnapshot(file, 'mapped-type.ts');
  });
});
