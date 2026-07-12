import { ts } from '../../../index';
import { assertPrintedMatchesSnapshot } from '../utils';

describe('index-signature', () => {
  it('readonly', async () => {
    const file = ts.factory.createSourceFile([
      ts.factory.createInterfaceDeclaration(undefined, 'Dictionary', undefined, undefined, [
        ts.factory.createIndexSignature(
          [ts.factory.createModifier(ts.SyntaxKind.ReadonlyKeyword)],
          [
            ts.factory.createParameterDeclaration(
              undefined,
              undefined,
              'key',
              undefined,
              ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
              undefined,
            ),
          ],
          ts.factory.createKeywordTypeNode(ts.SyntaxKind.UnknownKeyword),
        ),
      ]),
    ]);
    await assertPrintedMatchesSnapshot(file, 'readonly.ts');
  });
});
