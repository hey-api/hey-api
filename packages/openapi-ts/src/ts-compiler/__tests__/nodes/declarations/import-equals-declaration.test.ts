import { ts } from '../../../index';
import { assertPrintedMatchesSnapshot } from '../utils';

describe('import equals declaration', () => {
  it('external module reference', async () => {
    const file = ts.factory.createSourceFile([
      ts.factory.createImportEqualsDeclaration(
        undefined,
        false,
        ts.factory.createIdentifier('fs'),
        ts.factory.createExternalModuleReference(ts.factory.createStringLiteral('fs')),
      ),
    ]);
    await assertPrintedMatchesSnapshot(file, 'external-module-reference.ts');
  });

  it('entity name reference', async () => {
    const file = ts.factory.createSourceFile([
      ts.factory.createImportEqualsDeclaration(
        undefined,
        false,
        ts.factory.createIdentifier('Foo'),
        ts.factory.createQualifiedName(
          ts.factory.createIdentifier('ns'),
          ts.factory.createIdentifier('Foo'),
        ),
      ),
    ]);
    await assertPrintedMatchesSnapshot(file, 'entity-name-reference.ts');
  });

  it('type only', async () => {
    const file = ts.factory.createSourceFile([
      ts.factory.createImportEqualsDeclaration(
        undefined,
        true,
        ts.factory.createIdentifier('fs'),
        ts.factory.createExternalModuleReference(ts.factory.createStringLiteral('fs')),
      ),
    ]);
    await assertPrintedMatchesSnapshot(file, 'type-only.ts');
  });
});
