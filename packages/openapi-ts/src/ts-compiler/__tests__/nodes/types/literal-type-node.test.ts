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

describe('literal-type-node', () => {
  it('string literal type', async () => {
    const file = ts.factory.createSourceFile([
      castStatement('x', ts.factory.createLiteralTypeNode(ts.factory.createStringLiteral('foo'))),
    ]);
    await assertPrintedMatchesSnapshot(file, 'string.ts');
  });

  it('numeric literal type', async () => {
    const file = ts.factory.createSourceFile([
      castStatement('x', ts.factory.createLiteralTypeNode(ts.factory.createNumericLiteral(42))),
    ]);
    await assertPrintedMatchesSnapshot(file, 'numeric.ts');
  });
});
