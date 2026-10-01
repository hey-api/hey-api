import { py } from '../../../py-compiler';
import { $ } from '../../index';

describe('AwaitPyDsl', () => {
  it('builds an await expression around its operand', () => {
    const node = $.await($('fetch_data').call()).toAst();
    expect(node.kind).toBe(py.PyNodeKind.AwaitExpression);
    expect(node.expression.kind).toBe(py.PyNodeKind.CallExpression);
  });

  it('analyzes its operand, so anything inside it is reached', () => {
    const analyze = vi.fn();
    $.await($('fetch_data').call()).analyze({ analyze } as never);
    expect(analyze).toHaveBeenCalledTimes(1);
  });
});
