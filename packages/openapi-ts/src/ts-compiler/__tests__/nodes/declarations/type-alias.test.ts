import { ts } from '../../../index';
import { assertPrintedMatchesSnapshot } from '../utils';

const stringType = ts.factory.createIdentifier('string') as unknown as ts.TypeNode;

describe('type-alias', () => {
  it('exported', async () => {
    const file = ts.factory.createSourceFile([
      ts.factory.createTypeAliasDeclaration(
        [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
        'Id',
        undefined,
        stringType,
      ),
    ]);
    await assertPrintedMatchesSnapshot(file, 'exported.ts');
  });

  it('type parameters', async () => {
    const file = ts.factory.createSourceFile([
      ts.factory.createTypeAliasDeclaration(
        undefined,
        'Box',
        [ts.factory.createTypeParameterDeclaration(undefined, 'T', undefined, undefined)],
        stringType,
      ),
    ]);
    await assertPrintedMatchesSnapshot(file, 'type-parameters.ts');
  });
});
