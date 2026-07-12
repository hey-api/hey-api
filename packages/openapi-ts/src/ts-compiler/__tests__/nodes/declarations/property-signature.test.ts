import { ts } from '../../../index';
import { assertPrintedMatchesSnapshot } from '../utils';

describe('property-signature', () => {
  it('optional', async () => {
    const file = ts.factory.createSourceFile([
      ts.factory.createInterfaceDeclaration(undefined, 'Options', undefined, undefined, [
        ts.factory.createPropertySignature(
          undefined,
          'name',
          ts.factory.createToken(ts.SyntaxKind.QuestionToken),
          undefined,
        ),
      ]),
    ]);
    await assertPrintedMatchesSnapshot(file, 'optional.ts');
  });

  it('readonly', async () => {
    const file = ts.factory.createSourceFile([
      ts.factory.createInterfaceDeclaration(undefined, 'Options', undefined, undefined, [
        ts.factory.createPropertySignature(
          [ts.factory.createModifier(ts.SyntaxKind.ReadonlyKeyword)],
          'id',
          undefined,
          undefined,
        ),
      ]),
    ]);
    await assertPrintedMatchesSnapshot(file, 'readonly.ts');
  });
});
