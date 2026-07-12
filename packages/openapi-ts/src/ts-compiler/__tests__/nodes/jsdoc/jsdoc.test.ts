import { ts } from '../../../index';
import { assertNodePrintedMatchesSnapshot } from '../utils';

describe('jsdoc', () => {
  it('single line comment', async () => {
    const file = ts.factory.createJSDocComment('A short description.');
    await assertNodePrintedMatchesSnapshot(file, 'single-line.ts');
  });

  it('comment from jsdoc text nodes', async () => {
    const file = ts.factory.createJSDocComment([
      ts.factory.createJSDocText('Line one.\nLine two.'),
    ]);
    await assertNodePrintedMatchesSnapshot(file, 'text-nodes.ts');
  });

  it('empty comment', async () => {
    const file = ts.factory.createJSDocComment();
    await assertNodePrintedMatchesSnapshot(file, 'empty.ts');
  });
});
