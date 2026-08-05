import { ts } from '../../../index';
import { assertPrintedMatchesSnapshot } from '../utils';

describe('meta-property', () => {
  it('import.meta', async () => {
    const file = ts.factory.createSourceFile([
      ts.factory.createVariableStatement(
        undefined,
        ts.factory.createVariableDeclarationList(
          [
            ts.factory.createVariableDeclaration(
              'url',
              undefined,
              undefined,
              ts.factory.createPropertyAccessExpression(
                ts.factory.createMetaProperty(
                  ts.SyntaxKind.ImportKeyword,
                  ts.factory.createIdentifier('meta'),
                ),
                'url',
              ),
            ),
          ],
          ts.NodeFlags.Const,
        ),
      ),
    ]);
    await assertPrintedMatchesSnapshot(file, 'import-meta.ts');
  });

  it('new.target', async () => {
    const file = ts.factory.createSourceFile([
      ts.factory.createExpressionStatement(
        ts.factory.createMetaProperty(
          ts.SyntaxKind.NewKeyword,
          ts.factory.createIdentifier('target'),
        ),
      ),
    ]);
    await assertPrintedMatchesSnapshot(file, 'new-target.ts');
  });
});
