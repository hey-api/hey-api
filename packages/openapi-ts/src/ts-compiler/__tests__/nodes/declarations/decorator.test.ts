import { ts } from '../../../index';
import { assertPrintedMatchesSnapshot } from '../utils';

describe('decorator', () => {
  it('parameter decorator', async () => {
    const file = ts.factory.createSourceFile([
      ts.factory.createClassDeclaration(undefined, 'Service', undefined, undefined, [
        ts.factory.createMethodDeclaration(
          undefined,
          undefined,
          'handle',
          undefined,
          undefined,
          [
            ts.factory.createParameterDeclaration(
              [ts.factory.createDecorator(ts.factory.createIdentifier('inject'))],
              undefined,
              'value',
            ),
          ],
          undefined,
          ts.factory.createBlock([], false),
        ),
      ]),
    ]);
    await assertPrintedMatchesSnapshot(file, 'parameter-decorator.ts');
  });
});
