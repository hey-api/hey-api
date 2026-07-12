import { ts } from '../../../index';
import { assertPrintedMatchesSnapshot } from '../utils';

describe('interface', () => {
  it('property signatures', async () => {
    const file = ts.factory.createSourceFile([
      ts.factory.createInterfaceDeclaration(undefined, 'Point', undefined, undefined, [
        ts.factory.createPropertySignature(undefined, 'x', undefined, undefined),
        ts.factory.createPropertySignature(
          undefined,
          'y',
          ts.factory.createToken(ts.SyntaxKind.QuestionToken),
          undefined,
        ),
        ts.factory.createPropertySignature(
          [ts.factory.createModifier(ts.SyntaxKind.ReadonlyKeyword)],
          'z',
          undefined,
          undefined,
        ),
      ]),
    ]);
    await assertPrintedMatchesSnapshot(file, 'property-signatures.ts');
  });

  it('empty exported', async () => {
    const file = ts.factory.createSourceFile([
      ts.factory.createInterfaceDeclaration(
        [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
        'Empty',
        undefined,
        undefined,
        [],
      ),
    ]);
    await assertPrintedMatchesSnapshot(file, 'empty-exported.ts');
  });

  it('heritage clause', async () => {
    const file = ts.factory.createSourceFile([
      ts.factory.createInterfaceDeclaration(
        undefined,
        'Derived',
        undefined,
        [
          ts.factory.createHeritageClause(ts.factory.createToken(ts.SyntaxKind.ExtendsKeyword), [
            ts.factory.createExpressionWithTypeArguments(
              ts.factory.createIdentifier('Base'),
              undefined,
            ),
          ]),
        ],
        [ts.factory.createPropertySignature(undefined, 'id', undefined, undefined)],
      ),
    ]);
    await assertPrintedMatchesSnapshot(file, 'heritage-clause.ts');
  });
});
