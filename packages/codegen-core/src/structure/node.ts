import type { StructureItem, StructureShell } from './types';

export class StructureNode {
  /** Nested nodes within this node. */
  children: Map<string, StructureNode> = new Map();
  /** Items contained in this node. */
  items: Array<StructureItem> = [];
  /** The name of this node (e.g., "Users", "Accounts"). */
  name: string;
  /** Parent node in the hierarchy. Undefined if this is the root node. */
  parent?: StructureNode;
  /** Shell claimed for this node. */
  shell?: StructureShell;
  /** Source of the claimed shell. */
  shellSource?: symbol;
  /** True if this is a virtual root. */
  virtual: boolean;

  constructor(
    name: string,
    parent?: StructureNode,
    options?: {
      virtual?: boolean;
    },
  ) {
    this.name = name;
    this.parent = parent;
    this.virtual = options?.virtual ?? false;
  }

  get isRoot(): boolean {
    return !this.parent;
  }

  /**
   * Gets or creates a child node.
   *
   * If the child doesn't exist, it's created automatically.
   *
   * @param name - The name of the child node
   * @returns The child node instance
   */
  child(name: string): StructureNode {
    if (!this.children.has(name)) {
      this.children.set(name, new StructureNode(name, this));
    }
    return this.children.get(name)!;
  }

  /**
   * Gets the full path of this node in the hierarchy.
   *
   * @returns An array of node names from the root to this node
   */
  getPath(): ReadonlyArray<string> {
    const path: Array<string> = [];
    // oxlint-disable-next-line typescript/no-this-alias
    let cursor: StructureNode | undefined = this;
    while (cursor) {
      path.unshift(cursor.name);
      cursor = cursor.parent;
    }
    return path;
  }

  /**
   * Yields items from a specific source with typed data.
   *
   * @param source - The source symbol to filter by
   * @returns Generator of items from that source
   */
  *itemsFrom<T = unknown>(source: symbol): Generator<StructureItem & { data: T }> {
    for (const item of this.items) {
      if (item.source === source) {
        yield item as StructureItem & { data: T };
      }
    }
  }

  /**
   * Walk all nodes in the structure (depth-first, post-order).
   *
   * @returns Generator of all structure nodes
   */
  *walk(): Generator<StructureNode> {
    for (const node of this.children.values()) {
      yield* node.walk();
    }
    yield this;
  }
}
