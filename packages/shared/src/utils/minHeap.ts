/**
 * Binary min-heap keyed by a numeric priority. Priorities are passed in
 * alongside each item (rather than looked up from a `Map` on every
 * comparison) so heap operations do plain number comparisons instead of
 * string-keyed map lookups — significant on graphs with hundreds of
 * thousands of nodes, since each push/pop does O(log n) comparisons.
 */
export class MinHeap {
  private heap: Array<string> = [];
  private priorities: Array<number> = [];

  isEmpty(): boolean {
    return !this.heap.length;
  }

  pop(): string | undefined {
    const top = this.heap[0];
    if (!this.heap.length) return;
    const last = this.heap.pop()!;
    const lastPriority = this.priorities.pop()!;
    if (!this.heap.length) return top;
    this.heap[0] = last;
    this.priorities[0] = lastPriority;
    this.sinkDown(0);
    return top;
  }

  push(item: string, priority: number): void {
    this.heap.push(item);
    this.priorities.push(priority);
    this.bubbleUp(this.heap.length - 1);
  }

  private bubbleUp(index: number): void {
    const heap = this.heap;
    const priorities = this.priorities;
    const curVal = heap[index]!;
    const curPriority = priorities[index]!;
    while (index > 0) {
      const parent = (index - 1) >> 1;
      const parentPriority = priorities[parent]!;
      if (parentPriority <= curPriority) break;
      heap[index] = heap[parent]!;
      priorities[index] = parentPriority;
      index = parent;
    }
    heap[index] = curVal;
    priorities[index] = curPriority;
  }

  private sinkDown(index: number): void {
    const heap = this.heap;
    const priorities = this.priorities;
    const len = heap.length;
    const curVal = heap[index]!;
    const curPriority = priorities[index]!;
    while (true) {
      const left = 2 * index + 1;
      const right = 2 * index + 2;
      let smallest = index;
      let smallestPriority = curPriority;
      if (left < len) {
        const leftPriority = priorities[left]!;
        if (leftPriority < smallestPriority) {
          smallest = left;
          smallestPriority = leftPriority;
        }
      }
      if (right < len) {
        const rightPriority = priorities[right]!;
        if (rightPriority < smallestPriority) {
          smallest = right;
          smallestPriority = rightPriority;
        }
      }
      if (smallest === index) break;
      heap[index] = heap[smallest]!;
      priorities[index] = priorities[smallest]!;
      index = smallest;
    }
    heap[index] = curVal;
    priorities[index] = curPriority;
  }
}
