import { ts } from '../../../index';
import { assertPrintedMatchesSnapshot } from '../utils';

describe('enum', () => {
  it('initialized members', async () => {
    const file = ts.factory.createSourceFile([
      ts.factory.createEnumDeclaration(
        [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
        'Direction',
        [
          ts.factory.createEnumMember('Up', ts.factory.createNumericLiteral(1)),
          ts.factory.createEnumMember('Down', ts.factory.createStringLiteral('down')),
        ],
      ),
    ]);
    await assertPrintedMatchesSnapshot(file, 'initialized-members.ts');
  });

  it('bare members', async () => {
    const file = ts.factory.createSourceFile([
      ts.factory.createEnumDeclaration(undefined, 'Color', [
        ts.factory.createEnumMember('Red'),
        ts.factory.createEnumMember('Green'),
      ]),
    ]);
    await assertPrintedMatchesSnapshot(file, 'bare-members.ts');
  });
});
