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

describe('chains', () => {
  it('property access chain', async () => {
    const file = ts.factory.createSourceFile([
      constStatement(
        'a',
        ts.factory.createPropertyAccessChain(
          ts.factory.createIdentifier('obj'),
          ts.factory.createToken(ts.SyntaxKind.QuestionDotToken),
          'prop',
        ),
      ),
    ]);
    await assertPrintedMatchesSnapshot(file, 'property-access-chain.ts');
  });

  it('property access chain without question dot', async () => {
    const file = ts.factory.createSourceFile([
      constStatement(
        'b',
        ts.factory.createPropertyAccessChain(ts.factory.createIdentifier('obj'), undefined, 'prop'),
      ),
    ]);
    await assertPrintedMatchesSnapshot(file, 'property-access-chain-dot.ts');
  });

  it('element access chain', async () => {
    const file = ts.factory.createSourceFile([
      constStatement(
        'c',
        ts.factory.createElementAccessChain(
          ts.factory.createIdentifier('arr'),
          ts.factory.createToken(ts.SyntaxKind.QuestionDotToken),
          0,
        ),
      ),
    ]);
    await assertPrintedMatchesSnapshot(file, 'element-access-chain.ts');
  });

  it('element access chain without question dot', async () => {
    const file = ts.factory.createSourceFile([
      constStatement(
        'd',
        ts.factory.createElementAccessChain(ts.factory.createIdentifier('arr'), undefined, 0),
      ),
    ]);
    await assertPrintedMatchesSnapshot(file, 'element-access-chain-index.ts');
  });
});
