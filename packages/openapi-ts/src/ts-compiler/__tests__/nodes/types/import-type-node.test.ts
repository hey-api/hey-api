import { ts } from '../../../index';
import { assertPrintedMatchesSnapshot } from '../utils';

describe('import-type-node', () => {
  it('qualified import type with type arguments', async () => {
    const file = ts.factory.createSourceFile([
      ts.factory.createTypeAliasDeclaration(
        undefined,
        'Config',
        undefined,
        ts.factory.createImportTypeNode(
          ts.factory.createLiteralTypeNode(ts.factory.createStringLiteral('module')),
          undefined,
          ts.factory.createQualifiedName(ts.factory.createIdentifier('ns'), 'Options'),
          [ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword)],
        ),
      ),
    ]);
    await assertPrintedMatchesSnapshot(file, 'qualified.ts');
  });

  it('typeof import type', async () => {
    const file = ts.factory.createSourceFile([
      ts.factory.createTypeAliasDeclaration(
        undefined,
        'Mod',
        undefined,
        ts.factory.createImportTypeNode(
          ts.factory.createLiteralTypeNode(ts.factory.createStringLiteral('module')),
          undefined,
          undefined,
          undefined,
          true,
        ),
      ),
    ]);
    await assertPrintedMatchesSnapshot(file, 'typeof.ts');
  });

  it('stores attributes on the node', () => {
    const attributes = ts.factory.createObjectLiteralExpression([]);
    const node = ts.factory.createImportTypeNode(
      ts.factory.createLiteralTypeNode(ts.factory.createStringLiteral('module')),
      attributes,
      undefined,
      undefined,
    );
    expect(node.attributes).toBe(attributes);
  });
});
