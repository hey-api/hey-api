import { py } from '../../../index';
import { assertPrintedMatchesSnapshot } from '../utils';

describe('binary expression', () => {
  it('add', async () => {
    const file = py.factory.createSourceFile([
      py.factory.createAssignment(
        py.factory.createIdentifier('a'),
        undefined,
        py.factory.createLiteral(42),
      ),
      py.factory.createAssignment(
        py.factory.createIdentifier('b'),
        undefined,
        py.factory.createLiteral(84),
      ),
      py.factory.createAssignment(
        py.factory.createIdentifier('z'),
        undefined,
        py.factory.createBinaryExpression(
          py.factory.createIdentifier('a'),
          '+',
          py.factory.createIdentifier('b'),
        ),
      ),
    ]);
    await assertPrintedMatchesSnapshot(file, 'add.py');
  });

  it('subtract', async () => {
    const file = py.factory.createSourceFile([
      py.factory.createAssignment(
        py.factory.createIdentifier('a'),
        undefined,
        py.factory.createLiteral(42),
      ),
      py.factory.createAssignment(
        py.factory.createIdentifier('b'),
        undefined,
        py.factory.createLiteral(84),
      ),
      py.factory.createAssignment(
        py.factory.createIdentifier('z'),
        undefined,
        py.factory.createBinaryExpression(
          py.factory.createIdentifier('a'),
          '-',
          py.factory.createIdentifier('b'),
        ),
      ),
    ]);
    await assertPrintedMatchesSnapshot(file, 'subtract.py');
  });

  it('nested', async () => {
    const file = py.factory.createSourceFile([
      py.factory.createAssignment(
        py.factory.createIdentifier('z'),
        undefined,
        py.factory.createBinaryExpression(
          py.factory.createBinaryExpression(
            py.factory.createIdentifier('a'),
            'or',
            py.factory.createLiteral(0),
          ),
          '+',
          py.factory.createLiteral(1),
        ),
      ),
    ]);
    await assertPrintedMatchesSnapshot(file, 'nested.py');
  });
  it('tighter operand', async () => {
    const file = py.factory.createSourceFile([
      py.factory.createAssignment(
        py.factory.createIdentifier('z'),
        undefined,
        py.factory.createBinaryExpression(
          py.factory.createBinaryExpression(
            py.factory.createIdentifier('x'),
            '%',
            py.factory.createLiteral(2),
          ),
          '==',
          py.factory.createLiteral(0),
        ),
      ),
    ]);
    await assertPrintedMatchesSnapshot(file, 'tighter-operand.py');
  });

  it('equal precedence on the right', async () => {
    const file = py.factory.createSourceFile([
      py.factory.createAssignment(
        py.factory.createIdentifier('z'),
        undefined,
        py.factory.createBinaryExpression(
          py.factory.createIdentifier('a'),
          '-',
          py.factory.createBinaryExpression(
            py.factory.createIdentifier('b'),
            '-',
            py.factory.createIdentifier('c'),
          ),
        ),
      ),
    ]);
    await assertPrintedMatchesSnapshot(file, 'equal-precedence-right.py');
  });
});
