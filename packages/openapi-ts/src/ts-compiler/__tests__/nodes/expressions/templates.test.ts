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

describe('templates', () => {
  it('template expression', async () => {
    const template = ts.factory.createTemplateExpression(ts.factory.createTemplateHead('start '), [
      ts.factory.createTemplateSpan(
        ts.factory.createIdentifier('a'),
        ts.factory.createTemplateMiddle(' middle '),
      ),
      ts.factory.createTemplateSpan(
        ts.factory.createIdentifier('b'),
        ts.factory.createTemplateTail(' end'),
      ),
    ]);
    const file = ts.factory.createSourceFile([constStatement('x', template)]);
    await assertPrintedMatchesSnapshot(file, 'template-expression.ts');
  });

  it('tagged template expression', async () => {
    const template = ts.factory.createTemplateExpression(ts.factory.createTemplateHead('a'), [
      ts.factory.createTemplateSpan(
        ts.factory.createIdentifier('value'),
        ts.factory.createTemplateTail('b'),
      ),
    ]);
    const tagged = ts.factory.createTaggedTemplateExpression(
      ts.factory.createIdentifier('tag'),
      undefined,
      template,
    );
    const file = ts.factory.createSourceFile([constStatement('y', tagged)]);
    await assertPrintedMatchesSnapshot(file, 'tagged-template-expression.ts');
  });

  it('tagged template with type arguments', async () => {
    const template = ts.factory.createTemplateExpression(ts.factory.createTemplateHead('a'), [
      ts.factory.createTemplateSpan(
        ts.factory.createIdentifier('value'),
        ts.factory.createTemplateTail('b'),
      ),
    ]);
    const tagged = ts.factory.createTaggedTemplateExpression(
      ts.factory.createIdentifier('tag'),
      [ts.factory.createTypeReferenceNode('T'), ts.factory.createTypeReferenceNode('U')],
      template,
    );
    const file = ts.factory.createSourceFile([constStatement('z', tagged)]);
    await assertPrintedMatchesSnapshot(file, 'tagged-template-type-arguments.ts');
  });
});
