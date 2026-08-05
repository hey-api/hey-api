import { ts } from '../../../index';
import { assertPrintedMatchesSnapshot } from '../utils';

describe('constructor-type-node', () => {
  it('constructor type', async () => {
    const file = ts.factory.createSourceFile([
      ts.factory.createTypeAliasDeclaration(
        undefined,
        'Factory',
        undefined,
        ts.factory.createConstructorTypeNode(
          undefined,
          undefined,
          [
            ts.factory.createParameterDeclaration(
              undefined,
              undefined,
              'a',
              undefined,
              ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
            ),
          ],
          ts.factory.createTypeReferenceNode('Widget'),
        ),
      ),
    ]);
    await assertPrintedMatchesSnapshot(file, 'constructor.ts');
  });

  it('abstract constructor type', async () => {
    const file = ts.factory.createSourceFile([
      ts.factory.createTypeAliasDeclaration(
        undefined,
        'AbstractFactory',
        undefined,
        ts.factory.createConstructorTypeNode(
          [ts.factory.createModifier(ts.SyntaxKind.AbstractKeyword)],
          undefined,
          [],
          ts.factory.createTypeReferenceNode('Widget'),
        ),
      ),
    ]);
    await assertPrintedMatchesSnapshot(file, 'abstract.ts');
  });
});
