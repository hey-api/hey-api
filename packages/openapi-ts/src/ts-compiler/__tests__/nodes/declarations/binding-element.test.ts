import { ts } from '../../../index';
import { assertPrintedMatchesSnapshot } from '../utils';

describe('binding-element', () => {
  it('default, renamed, and rest elements', async () => {
    const file = ts.factory.createSourceFile([
      ts.factory.createFunctionDeclaration(
        undefined,
        undefined,
        'handler',
        undefined,
        [
          ts.factory.createParameterDeclaration(
            undefined,
            undefined,
            ts.factory.createObjectBindingPattern([
              ts.factory.createBindingElement(
                undefined,
                undefined,
                'page',
                ts.factory.createNumericLiteral(1),
              ),
              ts.factory.createBindingElement(undefined, 'order', 'sort'),
              ts.factory.createBindingElement(
                ts.factory.createToken(ts.SyntaxKind.DotDotDotToken),
                undefined,
                'rest',
              ),
            ]),
          ),
        ],
        undefined,
        ts.factory.createBlock([]),
      ),
    ]);
    await assertPrintedMatchesSnapshot(file, 'default-renamed-rest.ts');
  });
});
