import { MinHeap } from '../utils/minHeap';
import type { Graph } from './types/graph';
import type { GetPointerPriorityFn, WalkFn, WalkOptions } from './types/walk';

/**
 * Walk the nodes of the graph in declaration (insertion) order.
 * This is a cheap alternative to `walkTopological` when dependency ordering
 * is not required and the caller only wants nodes in the order they were
 * added to the graph.
 */
const walkDeclarations: WalkFn = (graph, callback, options) => {
  if (options?.preferGroups && options.preferGroups.length) {
    // Single pass: bucket each pointer into its group (or unmatched).
    // A Set of preferGroups provides O(1) membership check; buckets are created
    // lazily on first match so no separate pre-init loop is needed.
    const preferGroupsSet = new Set(options.preferGroups);
    const buckets = new Map<string, string[]>();
    const unmatched: string[] = [];

    for (const pointer of graph.nodes.keys()) {
      if (options.matchPointerToGroup) {
        const result = options.matchPointerToGroup(pointer);
        if (result.matched) {
          if (preferGroupsSet.has(result.kind)) {
            let bucket = buckets.get(result.kind);
            if (!bucket) {
              bucket = [];
              buckets.set(result.kind, bucket);
            }
            bucket.push(pointer);
          } else {
            // kind not in preferGroups → treat as unmatched
            unmatched.push(pointer);
          }
          continue;
        }
      }
      unmatched.push(pointer);
    }

    // emit in group order, then unmatched in declaration order
    const emittedGroups = new Set<string>();
    for (const kind of options.preferGroups) {
      if (emittedGroups.has(kind)) continue;
      emittedGroups.add(kind);
      const pointers = buckets.get(kind);
      if (pointers) {
        for (const pointer of pointers) {
          callback(pointer, graph.nodes.get(pointer)!);
        }
      }
    }
    for (const pointer of unmatched) {
      callback(pointer, graph.nodes.get(pointer)!);
    }
    return;
  }

  // fallback: simple declaration order, no need to materialise an array
  for (const [pointer, node] of graph.nodes) {
    callback(pointer, node);
  }
};

// Graph is built once per codegen run and never mutated afterward.
// `walkTopological` can be invoked once per plugin's `plugin.forEach()` call,
// and on a large spec this Kahn's-algorithm computation is expensive.
//
// We memoize the computed topological order per (graph, getPointerPriority,
// matchPointerToGroup, preferGroups) identity.
type TopologicalCacheKey = string;
const topologicalOrderCache = new WeakMap<Graph, Map<TopologicalCacheKey, Array<string>>>();
// Stable per-reference ids for functions/arrays used as part of the cache
// key, since neither Maps nor WeakMaps can be keyed on a tuple directly.
const referenceIds = new WeakMap<object, number>();
let nextReferenceId = 0;
function referenceId(value: object | undefined): number {
  if (value === undefined) return 0;
  let id = referenceIds.get(value);
  if (id === undefined) {
    id = ++nextReferenceId;
    referenceIds.set(value, id);
  }
  return id;
}

function computeTopologicalOrder<T extends string = string>(
  graph: Graph,
  options: WalkOptions<T> | undefined,
): Array<string> {
  let cacheForGraph = topologicalOrderCache.get(graph);
  const cacheKey: TopologicalCacheKey = `${referenceId(options?.getPointerPriority)}:${referenceId(options?.matchPointerToGroup)}:${referenceId(options?.preferGroups)}`;
  if (cacheForGraph) {
    const cached = cacheForGraph.get(cacheKey);
    if (cached) return cached;
  } else {
    cacheForGraph = new Map();
    topologicalOrderCache.set(graph, cacheForGraph);
  }

  const order = computeTopologicalOrderUncached(graph, options);
  cacheForGraph.set(cacheKey, order);
  return order;
}

/**
 * Computes the topological order (dependencies before dependents) of the
 * graph's nodes. Nodes in cycles are grouped together and emitted in
 * arbitrary order within the group.
 */
function computeTopologicalOrderUncached<T extends string = string>(
  graph: Graph,
  options: WalkOptions<T> | undefined,
): Array<string> {
  // stable Kahn's algorithm that respects declaration order as a tiebreaker.
  const pointers = Array.from(graph.nodes.keys());

  // composite decl index: group priority then base insertion order
  const declIndex = new Map<string, number>();

  // dependency sets, in-degree, reverse adjacency, and initial heap — all
  // built in a single pass over pointers to avoid repeated iteration.
  // `depsOf` omits the entry entirely for dependency-free nodes (the common
  // case — e.g. leaf schemas/properties) instead of storing an empty Set, to
  // avoid allocating one per leaf on graphs with hundreds of thousands of
  // nodes.
  const depsOf = new Map<string, Set<string>>();
  const inDegree = new Map<string, number>();
  const dependents = new Map<string, Set<string>>();
  const heap = new MinHeap();

  for (let index = 0, len = pointers.length; index < len; index++) {
    const pointer = pointers[index] as string;
    const priority = options?.getPointerPriority?.(pointer) ?? 10;
    const declPriority = priority * 1_000_000 + index;
    declIndex.set(pointer, declPriority);

    const raw = graph.subtreeDependencies?.get(pointer);
    let deps: Set<string> | undefined;
    if (raw && raw.size) {
      for (const rawPointer of raw) {
        if (rawPointer === pointer) continue; // ignore self-dependencies for ordering
        if (!graph.nodes.has(rawPointer)) continue;
        (deps ??= new Set()).add(rawPointer);
      }
    }

    if (deps) {
      depsOf.set(pointer, deps);
      inDegree.set(pointer, deps.size);
      for (const d of deps) {
        let dep = dependents.get(d);
        if (!dep) {
          dep = new Set();
          dependents.set(d, dep);
        }
        dep.add(pointer);
      }
    } else {
      inDegree.set(pointer, 0);
      heap.push(pointer, declPriority);
    }
  }

  const emitted = new Set<string>();
  const order: Array<string> = [];

  while (!heap.isEmpty()) {
    const cur = heap.pop()!;
    if (emitted.has(cur)) continue;
    emitted.add(cur);
    order.push(cur);

    const deps = dependents.get(cur);
    if (!deps) continue;

    for (const dep of deps) {
      const v = (inDegree.get(dep) ?? 0) - 1;
      inDegree.set(dep, v);
      if (v === 0) {
        heap.push(dep, declIndex.get(dep)!);
      }
    }
  }

  // emit remaining nodes (cycles) in declaration order. Cycles are rare, so
  // skip building/sorting a `remaining` array entirely in the common case
  // where everything was already emitted by the heap-driven pass above.
  if (emitted.size < pointers.length) {
    const remaining: Array<string> = [];
    for (let i = 0, len = pointers.length; i < len; i++) {
      const pointer = pointers[i] as string;
      if (!emitted.has(pointer)) remaining.push(pointer);
    }
    remaining.sort((a, b) => declIndex.get(a)! - declIndex.get(b)!);
    for (const pointer of remaining) {
      emitted.add(pointer);
      order.push(pointer);
    }
  }

  // prefer specified groups when safe
  let finalOrder = order;
  if (options?.preferGroups && options.preferGroups.length) {
    // build group priority map (lower = earlier)
    const groupPriority = new Map<string, number>();
    for (let i = 0; i < options.preferGroups.length; i++) {
      const k = options.preferGroups[i];
      if (k) {
        groupPriority.set(k, i);
      }
    }

    const getGroup: GetPointerPriorityFn = (pointer) => {
      if (options.matchPointerToGroup) {
        const result = options.matchPointerToGroup(pointer);
        if (result.matched) {
          return groupPriority.has(result.kind)
            ? groupPriority.get(result.kind)!
            : options.preferGroups!.length;
        }
      }
      return options.preferGroups!.length;
    };

    // Memoize getGroup results since matchPointerToGroup can be expensive.
    const groupCache = new Map<string, number>();
    const getCachedGroup = (pointer: string): number => {
      let g = groupCache.get(pointer);
      if (g === undefined) {
        g = getGroup(pointer);
        groupCache.set(pointer, g);
      }
      return g;
    };

    // `order` is already topologically sorted; `Array.prototype.sort` is
    // guaranteed stable (ES2019+), so sorting by group alone preserves
    // relative order within a group without needing a separate original-index
    // map as an explicit tiebreaker.
    const proposed = [...order].sort((a, b) => getCachedGroup(a) - getCachedGroup(b));

    // build quick lookup of original index and proposed index
    const proposedIndex = new Map<string, number>();
    for (let i = 0; i < proposed.length; i++) {
      proposedIndex.set(proposed[i]!, i);
    }

    // only validate edges where group(dep) > group(node)
    const violated = (() => {
      for (const [node, deps] of depsOf) {
        for (const dep of deps) {
          const gDep = getCachedGroup(dep);
          const gNode = getCachedGroup(node);
          if (gDep <= gNode) continue; // not a crossing edge, cannot be violated by grouping
          const pDep = proposedIndex.get(dep)!;
          const pNode = proposedIndex.get(node)!;
          if (pDep >= pNode) {
            return true;
          }
        }
      }
      return false;
    })();

    if (!violated) {
      finalOrder = proposed;
    }
  }

  return finalOrder;
}

/**
 * Walks the nodes of the graph in topological order (dependencies before dependents).
 * Calls the callback for each node pointer in order.
 * Nodes in cycles are grouped together and emitted in arbitrary order within the group.
 *
 * @param graph - The dependency graph
 * @param callback - Function to call for each node pointer
 */
const walkTopological: WalkFn = (graph, callback, options) => {
  const finalOrder = computeTopologicalOrder(graph, options);
  for (const pointer of finalOrder) {
    callback(pointer, graph.nodes.get(pointer)!);
  }
};

export const walk: WalkFn = (graph, callback, options) => {
  if (options?.order === 'topological') {
    return walkTopological(graph, callback, options);
  }
  return walkDeclarations(graph, callback, options);
};
