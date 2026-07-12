import { ts } from '../../../index';
import { assertPrintedMatchesSnapshot } from '../utils';

function castStatement(name: string, type: ts.TypeNode) {
  return ts.factory.createVariableStatement(
    undefined,
    ts.factory.createVariableDeclarationList(
      [
        ts.factory.createVariableDeclaration(
          name,
          undefined,
          undefined,
          ts.factory.createAsExpression(ts.factory.createIdentifier('value'), type),
        ),
      ],
      ts.NodeFlags.Const,
    ),
  );
}

describe('template-literal-type-span', () => {
  it('middle and tail spans', async () => {
    const file = ts.factory.createSourceFile([
      castStatement(
        'x',
        ts.factory.createTemplateLiteralType(ts.factory.createTemplateHead('a'), [
          ts.factory.createTemplateLiteralTypeSpan(
            ts.factory.createTypeReferenceNode('T'),
            ts.factory.createTemplateMiddle('b'),
          ),
          ts.factory.createTemplateLiteralTypeSpan(
            ts.factory.createTypeReferenceNode('U'),
            ts.factory.createTemplateTail('c'),
          ),
        ]),
      ),
    ]);
    await assertPrintedMatchesSnapshot(file, 'template-literal-type-span.ts');
  });
});
