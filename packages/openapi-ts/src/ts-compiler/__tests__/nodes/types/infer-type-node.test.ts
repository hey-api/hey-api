import { ts } from '../../../index';
import { assertPrintedMatchesSnapshot } from '../utils';

describe('infer-type-node', () => {
  it('infer in conditional type', async () => {
    const file = ts.factory.createSourceFile([
      ts.factory.createTypeAliasDeclaration(
        undefined,
        'ElementType',
        [ts.factory.createTypeParameterDeclaration(undefined, 'T', undefined, undefined)],
        ts.factory.createConditionalTypeNode(
          ts.factory.createTypeReferenceNode('T'),
          ts.factory.createArrayTypeNode(
            ts.factory.createInferTypeNode(
              ts.factory.createTypeParameterDeclaration(undefined, 'U', undefined, undefined),
            ),
          ),
          ts.factory.createTypeReferenceNode('U'),
          ts.factory.createKeywordTypeNode(ts.SyntaxKind.NeverKeyword),
        ),
      ),
    ]);
    await assertPrintedMatchesSnapshot(file, 'infer.ts');
  });
});
