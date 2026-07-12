import { ts } from '../../../index';
import type { TsParameterDeclaration } from '../../../nodes/declarations/parameter-declaration';
import { assertPrintedMatchesSnapshot } from '../utils';

function functionWithParameters(parameters: ReadonlyArray<TsParameterDeclaration>) {
  return ts.factory.createFunctionDeclaration(
    undefined,
    undefined,
    'handler',
    undefined,
    parameters,
    undefined,
    undefined,
  );
}

describe('parameter-declaration', () => {
  it('plain name', async () => {
    const file = ts.factory.createSourceFile([
      functionWithParameters([
        ts.factory.createParameterDeclaration(undefined, undefined, 'value'),
      ]),
    ]);
    await assertPrintedMatchesSnapshot(file, 'plain-name.ts');
  });

  it('optional parameter', async () => {
    const file = ts.factory.createSourceFile([
      functionWithParameters([
        ts.factory.createParameterDeclaration(
          undefined,
          undefined,
          'value',
          ts.factory.createToken(ts.SyntaxKind.QuestionToken),
        ),
      ]),
    ]);
    await assertPrintedMatchesSnapshot(file, 'optional-parameter.ts');
  });

  it('default initializer', async () => {
    const file = ts.factory.createSourceFile([
      functionWithParameters([
        ts.factory.createParameterDeclaration(
          undefined,
          undefined,
          'value',
          undefined,
          undefined,
          ts.factory.createNumericLiteral(1),
        ),
      ]),
    ]);
    await assertPrintedMatchesSnapshot(file, 'default-initializer.ts');
  });

  it('rest parameter', async () => {
    const file = ts.factory.createSourceFile([
      functionWithParameters([
        ts.factory.createParameterDeclaration(
          undefined,
          ts.factory.createToken(ts.SyntaxKind.DotDotDotToken),
          'args',
        ),
      ]),
    ]);
    await assertPrintedMatchesSnapshot(file, 'rest-parameter.ts');
  });
});
