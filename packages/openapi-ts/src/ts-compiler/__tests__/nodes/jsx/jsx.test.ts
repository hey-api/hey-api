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

describe('jsx', () => {
  it('self-closing element with attributes and element with expression child', async () => {
    const selfClosing = ts.factory.createJsxSelfClosingElement(
      ts.factory.createIdentifier('Foo'),
      undefined,
      ts.factory.createJsxAttributes([
        ts.factory.createJsxAttribute(
          ts.factory.createIdentifier('a'),
          ts.factory.createStringLiteral('1'),
        ),
        ts.factory.createJsxAttribute(
          ts.factory.createIdentifier('b'),
          ts.factory.createJsxExpression(undefined, ts.factory.createIdentifier('x')),
        ),
      ]),
    );

    const element = ts.factory.createJsxElement(
      ts.factory.createJsxOpeningElement(
        ts.factory.createIdentifier('Foo'),
        undefined,
        ts.factory.createJsxAttributes([]),
      ),
      [ts.factory.createJsxExpression(undefined, ts.factory.createIdentifier('value'))],
      ts.factory.createJsxClosingElement(ts.factory.createIdentifier('Foo')),
    );

    const file = ts.factory.createSourceFile([
      constStatement('s', selfClosing),
      constStatement('e', element),
    ]);
    await assertPrintedMatchesSnapshot(file, 'jsx.tsx');
  });
});
