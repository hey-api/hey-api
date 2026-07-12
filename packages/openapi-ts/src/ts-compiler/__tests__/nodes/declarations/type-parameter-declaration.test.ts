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

describe('type-parameter-declaration', () => {
  it('bare type parameter', async () => {
    const file = ts.factory.createSourceFile([
      castStatement(
        'identity',
        ts.factory.createFunctionTypeNode(
          [ts.factory.createTypeParameterDeclaration(undefined, 'T', undefined, undefined)],
          [],
          ts.factory.createTypeReferenceNode('T'),
        ),
      ),
    ]);
    await assertPrintedMatchesSnapshot(file, 'bare.ts');
  });

  it('constrained type parameter', async () => {
    const file = ts.factory.createSourceFile([
      castStatement(
        'identity',
        ts.factory.createFunctionTypeNode(
          [
            ts.factory.createTypeParameterDeclaration(
              undefined,
              'T',
              ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
              undefined,
            ),
          ],
          [],
          ts.factory.createTypeReferenceNode('T'),
        ),
      ),
    ]);
    await assertPrintedMatchesSnapshot(file, 'constrained.ts');
  });
});
