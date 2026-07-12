import { ts } from '../../../index';
import { assertPrintedMatchesSnapshot } from '../utils';

describe('class', () => {
  it('property declaration', async () => {
    const file = ts.factory.createSourceFile([
      ts.factory.createClassDeclaration(undefined, 'C', undefined, undefined, [
        ts.factory.createPropertyDeclaration(
          [
            ts.factory.createModifier(ts.SyntaxKind.PublicKeyword),
            ts.factory.createModifier(ts.SyntaxKind.ReadonlyKeyword),
          ],
          'x',
          undefined,
          undefined,
          ts.factory.createNumericLiteral(1),
        ),
        ts.factory.createPropertyDeclaration(
          undefined,
          'y',
          ts.factory.createToken(ts.SyntaxKind.QuestionToken),
          undefined,
          undefined,
        ),
      ]),
    ]);
    await assertPrintedMatchesSnapshot(file, 'property-declaration.ts');
  });

  it('method declaration', async () => {
    const file = ts.factory.createSourceFile([
      ts.factory.createClassDeclaration(undefined, 'C', undefined, undefined, [
        ts.factory.createMethodDeclaration(
          undefined,
          undefined,
          'bar',
          undefined,
          undefined,
          [
            ts.factory.createParameterDeclaration(undefined, undefined, 'a'),
            ts.factory.createParameterDeclaration(
              undefined,
              undefined,
              'b',
              undefined,
              undefined,
              ts.factory.createNumericLiteral(2),
            ),
            ts.factory.createParameterDeclaration(
              undefined,
              ts.factory.createToken(ts.SyntaxKind.DotDotDotToken),
              'rest',
            ),
          ],
          undefined,
          ts.factory.createBlock(
            [ts.factory.createReturnStatement(ts.factory.createNumericLiteral(1))],
            true,
          ),
        ),
      ]),
    ]);
    await assertPrintedMatchesSnapshot(file, 'method-declaration.ts');
  });

  it('constructor declaration', async () => {
    const file = ts.factory.createSourceFile([
      ts.factory.createClassDeclaration(undefined, 'C', undefined, undefined, [
        ts.factory.createConstructorDeclaration(
          undefined,
          [
            ts.factory.createParameterDeclaration(undefined, undefined, 'a'),
            ts.factory.createParameterDeclaration(undefined, undefined, 'b'),
          ],
          ts.factory.createBlock(
            [ts.factory.createReturnStatement(ts.factory.createNumericLiteral(1))],
            true,
          ),
        ),
      ]),
    ]);
    await assertPrintedMatchesSnapshot(file, 'constructor-declaration.ts');
  });

  it('accessor declarations', async () => {
    const file = ts.factory.createSourceFile([
      ts.factory.createClassDeclaration(undefined, 'C', undefined, undefined, [
        ts.factory.createGetAccessorDeclaration(
          undefined,
          'v',
          [],
          undefined,
          ts.factory.createBlock(
            [ts.factory.createReturnStatement(ts.factory.createNumericLiteral(1))],
            true,
          ),
        ),
        ts.factory.createSetAccessorDeclaration(
          undefined,
          'v',
          [ts.factory.createParameterDeclaration(undefined, undefined, 'value')],
          ts.factory.createBlock(
            [ts.factory.createReturnStatement(ts.factory.createNumericLiteral(1))],
            true,
          ),
        ),
      ]),
    ]);
    await assertPrintedMatchesSnapshot(file, 'accessor-declarations.ts');
  });

  it('heritage clauses', async () => {
    const file = ts.factory.createSourceFile([
      ts.factory.createClassDeclaration(
        [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
        'C',
        undefined,
        [
          ts.factory.createHeritageClause(ts.factory.createToken(ts.SyntaxKind.ExtendsKeyword), [
            ts.factory.createExpressionWithTypeArguments(
              ts.factory.createIdentifier('Base'),
              undefined,
            ),
          ]),
          ts.factory.createHeritageClause(ts.factory.createToken(ts.SyntaxKind.ImplementsKeyword), [
            ts.factory.createExpressionWithTypeArguments(
              ts.factory.createIdentifier('A'),
              undefined,
            ),
          ]),
        ],
        [
          ts.factory.createPropertyDeclaration(
            undefined,
            'x',
            undefined,
            undefined,
            ts.factory.createNumericLiteral(1),
          ),
        ],
      ),
    ]);
    await assertPrintedMatchesSnapshot(file, 'heritage-clauses.ts');
  });

  it('generic class', async () => {
    const file = ts.factory.createSourceFile([
      ts.factory.createClassDeclaration(
        undefined,
        'Box',
        [
          ts.factory.createTypeParameterDeclaration(undefined, 'T'),
          ts.factory.createTypeParameterDeclaration(undefined, 'U'),
        ],
        undefined,
        [
          ts.factory.createPropertyDeclaration(
            undefined,
            'value',
            undefined,
            ts.factory.createTypeReferenceNode('T'),
            undefined,
          ),
        ],
      ),
    ]);
    await assertPrintedMatchesSnapshot(file, 'generic.ts');
  });

  it('generic method', async () => {
    const file = ts.factory.createSourceFile([
      ts.factory.createClassDeclaration(undefined, 'C', undefined, undefined, [
        ts.factory.createMethodDeclaration(
          undefined,
          undefined,
          'map',
          undefined,
          [ts.factory.createTypeParameterDeclaration(undefined, 'T')],
          [
            ts.factory.createParameterDeclaration(
              undefined,
              undefined,
              'value',
              undefined,
              ts.factory.createTypeReferenceNode('T'),
            ),
          ],
          ts.factory.createTypeReferenceNode('T'),
          ts.factory.createBlock(
            [ts.factory.createReturnStatement(ts.factory.createIdentifier('value'))],
            true,
          ),
        ),
      ]),
    ]);
    await assertPrintedMatchesSnapshot(file, 'generic-method.ts');
  });

  it('empty class', async () => {
    const file = ts.factory.createSourceFile([
      ts.factory.createClassDeclaration(undefined, 'C', undefined, undefined, []),
    ]);
    await assertPrintedMatchesSnapshot(file, 'empty.ts');
  });
});
