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

describe('template-literal-type', () => {
  it('head with single span', async () => {
    const file = ts.factory.createSourceFile([
      castStatement(
        'x',
        ts.factory.createTemplateLiteralType(ts.factory.createTemplateHead('prefix-'), [
          ts.factory.createTemplateLiteralTypeSpan(
            ts.factory.createTypeReferenceNode('T'),
            ts.factory.createTemplateTail(''),
          ),
        ]),
      ),
    ]);
    await assertPrintedMatchesSnapshot(file, 'template-literal-type.ts');
  });
});
