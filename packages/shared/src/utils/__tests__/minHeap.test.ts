import { MinHeap } from '../minHeap';

describe('MinHeap', () => {
  it('pops items in increasing priority order', () => {
    const h = new MinHeap();
    h.push('a', 10);
    h.push('b', 5);
    h.push('c', 20);

    expect(h.pop()).toBe('b');
    expect(h.pop()).toBe('a');
    expect(h.pop()).toBe('c');
    expect(h.pop()).toBeUndefined();
  });

  it('supports interleaved push/pop and maintains order', () => {
    const h = new MinHeap();
    h.push('y', 1);
    expect(h.pop()).toBe('y');

    h.push('z', 2);
    h.push('x', 0);
    expect(h.pop()).toBe('x');
    expect(h.pop()).toBe('z');
  });

  it('handles duplicates (same id pushed multiple times)', () => {
    const h = new MinHeap();
    h.push('dup', 1);
    h.push('dup', 1);
    expect(h.pop()).toBe('dup');
    // second duplicate still present
    expect(h.pop()).toBe('dup');
    expect(h.pop()).toBeUndefined();
  });

  it('isEmpty returns true when empty and false when not', () => {
    const h = new MinHeap();
    expect(h.isEmpty()).toBe(true);
    h.push('a', 0);
    expect(h.isEmpty()).toBe(false);
    h.pop();
    expect(h.isEmpty()).toBe(true);
  });
});
