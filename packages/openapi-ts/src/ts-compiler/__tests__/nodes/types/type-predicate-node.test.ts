import { ts } from '../../../index';
import { assertPrintedMatchesSnapshot } from '../utils';

describe('type-predicate-node', () => {
  it('parameter is type', async () => {
    const file = ts.factory.createSourceFile([
      ts.factory.createFunctionDeclaration(
        undefined,
        undefined,
        'isT',
        undefined,
        [
          ts.factory.createParameterDeclaration(
            undefined,
            undefined,
            'x',
            undefined,
            ts.factory.createKeywordTypeNode(ts.SyntaxKind.UnknownKeyword),
          ),
        ],
        ts.factory.createTypePredicateNode(undefined, 'x', ts.factory.createTypeReferenceNode('T')),
        ts.factory.createBlock([ts.factory.createReturnStatement(ts.factory.createTrue())]),
      ),
    ]);
    await assertPrintedMatchesSnapshot(file, 'type-predicate.ts');
  });

  it('asserts parameter is type', async () => {
    const file = ts.factory.createSourceFile([
      ts.factory.createFunctionDeclaration(
        undefined,
        undefined,
        'assertT',
        undefined,
        [
          ts.factory.createParameterDeclaration(
            undefined,
            undefined,
            'x',
            undefined,
            ts.factory.createKeywordTypeNode(ts.SyntaxKind.UnknownKeyword),
          ),
        ],
        ts.factory.createTypePredicateNode(
          ts.factory.createToken(ts.SyntaxKind.AssertsKeyword),
          'x',
          ts.factory.createTypeReferenceNode('T'),
        ),
        undefined,
      ),
    ]);
    await assertPrintedMatchesSnapshot(file, 'asserts-type-predicate.ts');
  });

  it('asserts parameter without type', async () => {
    const file = ts.factory.createSourceFile([
      ts.factory.createFunctionDeclaration(
        undefined,
        undefined,
        'assertTruthy',
        undefined,
        [
          ts.factory.createParameterDeclaration(
            undefined,
            undefined,
            'x',
            undefined,
            ts.factory.createKeywordTypeNode(ts.SyntaxKind.UnknownKeyword),
          ),
        ],
        ts.factory.createTypePredicateNode(
          ts.factory.createToken(ts.SyntaxKind.AssertsKeyword),
          'x',
          undefined,
        ),
        undefined,
      ),
    ]);
    await assertPrintedMatchesSnapshot(file, 'asserts-only-type-predicate.ts');
  });
});
