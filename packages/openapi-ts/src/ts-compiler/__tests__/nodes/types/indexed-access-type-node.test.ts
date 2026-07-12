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

describe('indexed-access-type-node', () => {
  it('indexed access', async () => {
    const file = ts.factory.createSourceFile([
      castStatement(
        'x',
        ts.factory.createIndexedAccessTypeNode(
          ts.factory.createTypeReferenceNode('T'),
          ts.factory.createTypeReferenceNode('K'),
        ),
      ),
    ]);
    await assertPrintedMatchesSnapshot(file, 'indexed-access.ts');
  });
});
