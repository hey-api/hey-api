import { ts } from '../../../index';
import { assertPrintedMatchesSnapshot } from '../utils';

describe('array-binding-pattern', () => {
  it('named elements', async () => {
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
            ts.factory.createArrayBindingPattern([
              ts.factory.createBindingElement(undefined, undefined, 'first'),
              ts.factory.createBindingElement(undefined, undefined, 'second'),
            ]),
          ),
        ],
        undefined,
        ts.factory.createBlock([]),
      ),
    ]);
    await assertPrintedMatchesSnapshot(file, 'named-elements.ts');
  });
});
