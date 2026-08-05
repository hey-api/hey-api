import type { Logger } from '@hey-api/codegen-core';

import type { Graph, NodeInfo } from '../../../graph';
import { encodeJsonPointerSegment, normalizeJsonPointer } from '../../../utils/ref';

/**
 * Represents the possible access scopes for OpenAPI nodes.
 * - 'normal': Default scope for regular nodes.
 * - 'read': Node is read-only (e.g., readOnly: true).
 * - 'write': Node is write-only (e.g., writeOnly: true).
 */
export type Scope = 'normal' | 'read' | 'write';

/**
 * Ensures every relevant child node (e.g., properties, items) in the graph has a `scopes` property.
 * If a node does not have its own scopes, it inherits from its parent if available.
 *
 * @param nodes - Map of JSON Pointer to NodeInfo.
 */
export function annotateChildScopes(nodes: Graph['nodes']): void {
  for (const [, nodeInfo] of nodes) {
    if (nodeInfo.scopes) continue;

    if (nodeInfo.parentPointer) {
      const parentInfo = nodes.get(nodeInfo.parentPointer);
      if (parentInfo?.scopes) {
        nodeInfo.scopes = new Set(parentInfo.scopes);
      }
    }
  }
}

interface Cache {
  parentToChildren: Map<string, Array<string>>;
  subtreeDependencies: Map<string, Set<string> | null>;
  transitiveDependencies: Map<string, Set<string> | null>;
}

type PointerDependenciesResult = {
  subtreeDependencies: Set<string> | null;
  transitiveDependencies: Set<string> | null;
};

/**
 * Recursively collects all $ref dependencies in the subtree rooted at `pointer`.
 */
function collectPointerDependencies(
  cache: Cache,
  graph: Graph,
  pointer: string,
  visited: Set<string>,
): PointerDependenciesResult {
  if (cache.transitiveDependencies.has(pointer)) {
    return {
      subtreeDependencies: cache.subtreeDependencies.get(pointer) ?? null,
      transitiveDependencies: cache.transitiveDependencies.get(pointer) ?? null,
    };
  }

  if (visited.has(pointer)) {
    return { subtreeDependencies: null, transitiveDependencies: null };
  }
  visited.add(pointer);

  const nodeInfo = graph.nodes.get(pointer);
  if (!nodeInfo) {
    return { subtreeDependencies: null, transitiveDependencies: null };
  }

  let transitiveDependencies: Set<string> | null = null;
  let subtreeDependencies: Set<string> | null = null;

  // Add direct $ref dependencies for this node
  // (from the dependencies map, or by checking nodeInfo.node directly)
  // We'll use the dependencies map for consistency:
  const nodeDependencies = graph.nodeDependencies.get(pointer);
  if (nodeDependencies) {
    for (const depPointer of nodeDependencies) {
      (transitiveDependencies ??= new Set()).add(depPointer);
      (subtreeDependencies ??= new Set()).add(depPointer);
      // Recursively collect dependencies of the referenced node
      const depResult = collectPointerDependencies(cache, graph, depPointer, visited);
      if (depResult.transitiveDependencies) {
        for (const dependency of depResult.transitiveDependencies) {
          transitiveDependencies.add(dependency);
        }
      }
    }
  }

  const children = cache.parentToChildren.get(pointer) ?? [];
  for (const childPointer of children) {
    if (!cache.transitiveDependencies.has(childPointer)) {
      const childResult = collectPointerDependencies(cache, graph, childPointer, visited);
      cache.transitiveDependencies.set(childPointer, childResult.transitiveDependencies);
      cache.subtreeDependencies.set(childPointer, childResult.subtreeDependencies);
    }
    const childTransitive = cache.transitiveDependencies.get(childPointer) ?? null;
    const childSubtree = cache.subtreeDependencies.get(childPointer) ?? null;
    if (childTransitive) {
      for (const dependency of childTransitive) {
        (transitiveDependencies ??= new Set()).add(dependency);
      }
    }
    if (childSubtree) {
      for (const dependency of childSubtree) {
        (subtreeDependencies ??= new Set()).add(dependency);
      }
    }
  }

  cache.transitiveDependencies.set(pointer, transitiveDependencies);
  cache.subtreeDependencies.set(pointer, subtreeDependencies);
  return { subtreeDependencies, transitiveDependencies };
}

/**
 * Propagates scopes through the graph using a worklist algorithm.
 *
 * A node's scopes only ever flow to two places: its parent (tree edge) and
 * any node that references it via `$ref` (dependency edge). So instead of
 * repeatedly re-scanning every node until a full pass makes no changes (which
 * on a large spec means re-visiting hundreds of thousands of already-settled
 * nodes on every one of several passes), we seed a queue with the nodes that
 * start out with scopes and only re-examine a node when one of its actual
 * scope sources has just changed. Each node is processed once per net scope
 * change it receives (at most 3 times, since scopes are one of 'normal' /
 * 'read' / 'write' and can only grow), giving work proportional to the number
 * of changes rather than (passes × total node count).
 *
 * @param graph - The Graph structure containing nodes and dependencies.
 */
export function propagateScopes(graph: Graph): void {
  // Reverse index: pointer -> nodes whose `nodeDependencies` reference it, so
  // that when `pointer`'s scopes change we know which dependents to recheck.
  const refDependents = new Map<string, Array<string>>();
  for (const [pointer, deps] of graph.nodeDependencies) {
    for (const depPointer of deps) {
      let dependents = refDependents.get(depPointer);
      if (!dependents) {
        dependents = [];
        refDependents.set(depPointer, dependents);
      }
      dependents.push(pointer);
    }
  }

  const queued = new Set<string>();
  const queue: Array<string> = [];
  const enqueue = (pointer: string): void => {
    if (queued.has(pointer)) return;
    queued.add(pointer);
    queue.push(pointer);
  };

  for (const [pointer, nodeInfo] of graph.nodes) {
    if (nodeInfo.scopes) enqueue(pointer);
  }

  let head = 0;
  while (head < queue.length) {
    const pointer = queue[head++] as string;
    queued.delete(pointer);
    const nodeInfo = graph.nodes.get(pointer);
    if (!nodeInfo?.scopes) continue;

    // Push this node's scopes up to its parent.
    if (nodeInfo.parentPointer) {
      const parentInfo = graph.nodes.get(nodeInfo.parentPointer);
      if (parentInfo && propagateScopesToNode(nodeInfo, parentInfo)) {
        enqueue(nodeInfo.parentPointer);
      }
    }

    // Push this node's scopes to anything that $ref's it.
    const dependents = refDependents.get(pointer);
    if (dependents) {
      for (const dependentPointer of dependents) {
        const dependentInfo = graph.nodes.get(dependentPointer);
        if (dependentInfo && propagateScopesToNode(nodeInfo, dependentInfo)) {
          enqueue(dependentPointer);
        }
      }
    }
  }
}

/**
 * Propagates scopes from one node to another.
 * Adds any scopes from fromNodeInfo to toNodeInfo that are not already present.
 * Returns true if any scopes were added, false otherwise.
 *
 * @param fromNodeInfo - The node to propagate scopes from
 * @param toNodeInfo - The node to propagate scopes to
 * @returns boolean - Whether any scopes were added
 */
function propagateScopesToNode(fromNodeInfo: NodeInfo, toNodeInfo: NodeInfo): boolean {
  if (!fromNodeInfo.scopes) {
    return false;
  }

  if (!toNodeInfo.scopes) {
    toNodeInfo.scopes = new Set();
  }

  let changed = false;

  for (const scope of fromNodeInfo.scopes) {
    if (!toNodeInfo.scopes.has(scope)) {
      toNodeInfo.scopes.add(scope);
      changed = true;
    }
  }

  return changed;
}

/**
 * Builds a graph of all nodes in an OpenAPI spec, indexed by normalized JSON Pointer,
 * and tracks all $ref dependencies and reverse dependencies between nodes.
 *
 * - All keys in the returned maps are normalized JSON Pointers (RFC 6901, always starting with '#').
 * - The `nodes` map allows fast lookup of any node and its parent/key context.
 * - The `dependencies` map records, for each node, the set of normalized pointers it references via $ref.
 * - After construction, all nodes will have their local and propagated scopes annotated.
 *
 * @param root The root object (e.g., the OpenAPI spec)
 * @returns An object with:
 *   - nodes: Map from normalized JSON Pointer string to NodeInfo
 *   - dependencies: Map from normalized JSON Pointer string to Set of referenced normalized JSON Pointers
 */
export function buildGraph(
  root: unknown,
  logger: Logger,
): {
  graph: Graph;
} {
  const eventBuildGraph = logger.timeEvent('build-graph');
  const graph: Graph = {
    nodeDependencies: new Map(),
    nodes: new Map(),
    subtreeDependencies: new Map(),
    transitiveDependencies: new Map(),
  };

  // `key`/`node`/`parentPointer`/`pointer` are passed positionally rather
  // than as a destructured options object, since this closure runs once per
  // graph node (hundreds of thousands of times on a large spec) and a
  // wrapper object would be allocated on every call for no benefit.
  function walk(
    key: string | number | null,
    node: unknown,
    parentPointer: string | null,
    pointer: string,
  ): void {
    if (typeof node !== 'object' || node === null) {
      return;
    }

    let deprecated: boolean | undefined;
    let tags: Set<string> | undefined;

    // Check for deprecated property (should be a boolean)
    if ('deprecated' in node && typeof node.deprecated === 'boolean') {
      deprecated = Boolean(node.deprecated);
    }
    // If this node has a $ref, record the dependency
    if ('$ref' in node && typeof node.$ref === 'string') {
      const refPointer = normalizeJsonPointer(node.$ref);
      let deps = graph.nodeDependencies.get(pointer);
      if (!deps) {
        deps = new Set();
        graph.nodeDependencies.set(pointer, deps);
      }
      deps.add(refPointer);
    }
    // Check for tags property (should be an array of strings)
    if ('tags' in node && Array.isArray(node.tags)) {
      for (let i = 0, len = node.tags.length; i < len; i++) {
        const tag: unknown = node.tags[i];
        if (typeof tag === 'string') {
          (tags ??= new Set()).add(tag);
        }
      }
    }

    // `scopes` is included explicitly (even though undefined here) so every
    // `NodeInfo` object has the same hidden class from creation instead of
    // one that changes shape later when scope-seeding assigns it.
    graph.nodes.set(pointer, { deprecated, key, node, parentPointer, scopes: undefined, tags });

    if (Array.isArray(node)) {
      for (let index = 0, len = node.length; index < len; index++) {
        walk(index, node[index], pointer, pointer + '/' + encodeJsonPointerSegment(index));
      }
    } else {
      for (const childKey in node) {
        walk(
          childKey,
          (node as Record<string, unknown>)[childKey],
          pointer,
          pointer + '/' + encodeJsonPointerSegment(childKey),
        );
      }
    }
  }

  walk(null, root, null, '#');

  const cache: Cache = {
    parentToChildren: new Map(),
    subtreeDependencies: new Map(),
    transitiveDependencies: new Map(),
  };

  // Merge parentToChildren cache build + scope seeding into one pass over graph.nodes.
  for (const [pointer, nodeInfo] of graph.nodes) {
    const parent = nodeInfo.parentPointer;
    if (parent) {
      let arr = cache.parentToChildren.get(parent);
      if (!arr) {
        arr = [];
        cache.parentToChildren.set(parent, arr);
      }
      arr.push(pointer);
    }

    // Seeds each node in the graph with its local access scope(s) based on its own properties.
    // - 'read' if readOnly: true
    // - 'write' if writeOnly: true
    // - 'normal' if node is an object property
    //
    // Only non-array objects are considered for scope seeding.
    const { node } = nodeInfo;
    if (typeof node === 'object' && node !== null && !Array.isArray(node)) {
      if ('readOnly' in node && node.readOnly === true) {
        nodeInfo.scopes = new Set(['read']);
      } else if ('writeOnly' in node && node.writeOnly === true) {
        nodeInfo.scopes = new Set(['write']);
      } else {
        // Check /properties/{key} without a regex: compare the segment before the
        // last slash to the string 'properties'.
        const lastSlash = pointer.lastIndexOf('/');
        if (lastSlash > 0) {
          const prevSlash = pointer.lastIndexOf('/', lastSlash - 1);
          if (prevSlash >= 0 && pointer.slice(prevSlash + 1, lastSlash) === 'properties') {
            nodeInfo.scopes = new Set(['normal']);
          }
        }
      }
    }
  }

  propagateScopes(graph);
  annotateChildScopes(graph.nodes);

  for (const pointer of graph.nodes.keys()) {
    // Earlier iterations often already resolved this pointer while walking a
    // prior sibling's subtree (`children` recursion below), so skip the call
    // (and the `visited` Set it would allocate) when the answer is cached.
    let transitiveDependencies: Set<string> | null;
    let subtreeDependencies: Set<string> | null;
    if (cache.transitiveDependencies.has(pointer)) {
      transitiveDependencies = cache.transitiveDependencies.get(pointer) ?? null;
      subtreeDependencies = cache.subtreeDependencies.get(pointer) ?? null;
    } else {
      const result = collectPointerDependencies(cache, graph, pointer, new Set());
      transitiveDependencies = result.transitiveDependencies;
      subtreeDependencies = result.subtreeDependencies;
    }
    if (transitiveDependencies) {
      graph.transitiveDependencies.set(pointer, transitiveDependencies);
    }
    if (subtreeDependencies) {
      graph.subtreeDependencies.set(pointer, subtreeDependencies);
    }
  }

  eventBuildGraph.timeEnd();

  // functions creating data for debug scripts located in `dev/`
  // const { maxChildren, maxDepth, totalNodes } = debugTools.graph.analyzeStructure(graph);
  // const nodesForViz = debugTools.graph.exportForVisualization(graph);
  // fs.writeFileSync('dev/graph.json', JSON.stringify(nodesForViz, null, 2));

  return { graph };
}
