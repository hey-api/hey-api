import { ts } from '../../../ts-compiler';
import { $ } from '../../index';

const printer = ts.createPrinter();
const astToString = (node: Parameters<typeof printer.format>[0]) => printer.format(node).trimEnd();

describe('TernaryTsDsl', () => {
  it('renders a basic ternary expression', () => {
    const node = $.ternary($('a').eq($('b')))
      .do($.literal(1))
      .otherwise($.literal(2));
    const result = astToString(node.toAst());
    expect(result).toBe('a === b ? 1 : 2');
  });

  it('renders a ternary with inequality', () => {
    const node = $.ternary($('options').neq($('skipToken')))
      .do($('options'))
      .otherwise($('undefined'));
    const result = astToString(node.toAst());
    expect(result).toBe('options !== skipToken ? options : undefined');
  });

  it('renders a ternary with as-cast in the truthy branch', () => {
    const node = $.ternary($('options').neq($('skipToken')))
      .do($('options').as('T'))
      .otherwise($('undefined'));
    const result = astToString(node.toAst());
    expect(result).toBe('options !== skipToken ? options as T : undefined');
  });
});
