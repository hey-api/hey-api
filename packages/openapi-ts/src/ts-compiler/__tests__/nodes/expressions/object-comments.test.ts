import { ts } from '../../../index';
import { assertPrintedMatchesSnapshot } from '../utils';

function commentedProp(name: string, value: string, description: string) {
  const property = ts.factory.createPropertyAssignment(
    ts.factory.createStringLiteral(name, true),
    ts.factory.createStringLiteral(value, true),
  );
  const body = ['*', ` * ${description}`, ' '].join('\n');
  ts.addSyntheticLeadingComment(property, ts.SyntaxKind.MultiLineCommentTrivia, body, true);
  return property;
}

function plainProp(name: string, value: string) {
  return ts.factory.createPropertyAssignment(
    ts.factory.createStringLiteral(name, true),
    ts.factory.createStringLiteral(value, true),
  );
}

function constStatement(name: string, initializer: ts.Expression) {
  return ts.factory.createVariableStatement(
    [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
    ts.factory.createVariableDeclarationList(
      [ts.factory.createVariableDeclaration(name, undefined, undefined, initializer)],
      ts.NodeFlags.Const,
    ),
  );
}

describe('object literal comments', () => {
  it('forces multi-line when a property is commented', async () => {
    const object = ts.factory.createObjectLiteralExpression(
      [commentedProp('1_10', '1-10', '1-10'), commentedProp('11_20', '11-20', '11-20')],
      false,
    );
    const file = ts.factory.createSourceFile([
      constStatement(
        '_110',
        ts.factory.createAsExpression(object, ts.factory.createTypeReferenceNode('const')),
      ),
    ]);
    await assertPrintedMatchesSnapshot(file, 'enum-javascript.ts');
  });

  it('attaches comments only to their own properties', async () => {
    const object = ts.factory.createObjectLiteralExpression(
      [commentedProp('a', 'A', 'desc a'), commentedProp('b', 'B', 'desc b'), plainProp('c', 'C')],
      false,
    );
    const file = ts.factory.createSourceFile([
      constStatement(
        'y',
        ts.factory.createAsExpression(object, ts.factory.createTypeReferenceNode('const')),
      ),
    ]);
    await assertPrintedMatchesSnapshot(file, 'mixed-commented.ts');
  });
});
