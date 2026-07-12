import { ts } from '../../../index';
import { assertPrintedMatchesSnapshot } from '../utils';

function constStatement(name: string, initializer: ts.Expression) {
  return ts.factory.createVariableStatement(
    undefined,
    ts.factory.createVariableDeclarationList(
      [ts.factory.createVariableDeclaration(name, undefined, undefined, initializer)],
      ts.NodeFlags.Const,
    ),
  );
}

describe('no-substitution-template-literal', () => {
  it('const template', async () => {
    const file = ts.factory.createSourceFile([
      constStatement('x', ts.factory.createNoSubstitutionTemplateLiteral('hello')),
    ]);
    await assertPrintedMatchesSnapshot(file, 'const-template.ts');
  });

  it('escapes backtick and dollar-brace', async () => {
    const file = ts.factory.createSourceFile([
      constStatement('x', ts.factory.createNoSubstitutionTemplateLiteral('a `b` ${c}')),
    ]);
    await assertPrintedMatchesSnapshot(file, 'escaped.ts');
  });
});
