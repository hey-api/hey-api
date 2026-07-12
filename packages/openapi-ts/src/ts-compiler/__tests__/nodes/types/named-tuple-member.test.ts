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

describe('named-tuple-member', () => {
  it('named and optional members', async () => {
    const file = ts.factory.createSourceFile([
      castStatement(
        'x',
        ts.factory.createTupleTypeNode([
          ts.factory.createNamedTupleMember(
            undefined,
            'first',
            undefined,
            ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
          ),
          ts.factory.createNamedTupleMember(
            undefined,
            'second',
            ts.factory.createToken(ts.SyntaxKind.QuestionToken),
            ts.factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword),
          ),
        ]),
      ),
    ]);
    await assertPrintedMatchesSnapshot(file, 'named-tuple.ts');
  });
});
