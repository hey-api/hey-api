import type { Graph } from '../graph';

function analyzeStructure(graph: Graph) {
  let maxDepth = 0;
  let maxChildren = 0;

  const computeDepth = (pointer: string, depth: number): void => {
    maxDepth = Math.max(maxDepth, depth);

    const children = Array.from(graph.nodes.entries())
      .filter(([, nodeInfo]) => nodeInfo.parentPointer === pointer)
      .map(([childPointer]) => childPointer);

    maxChildren = Math.max(maxChildren, children.length);

    for (const childPointer of children) {
      computeDepth(childPointer, depth + 1);
    }
  };

  const totalNodes = graph.nodes.size;
  if (graph.nodes.has('#')) {
    computeDepth('#', 1);
  }

  return { maxChildren, maxDepth, totalNodes };
}

function exportForVisualization(graph: Graph) {
  const childrenMap = new Map<string, string[]>();

  for (const [pointer, nodeInfo] of graph.nodes) {
    if (!nodeInfo.parentPointer) continue;
    if (!childrenMap.has(nodeInfo.parentPointer)) {
      childrenMap.set(nodeInfo.parentPointer, []);
    }
    childrenMap.get(nodeInfo.parentPointer)!.push(pointer);
  }

  const nodes = Array.from(graph.nodes.keys()).map((pointer) => ({
    children: childrenMap.get(pointer)?.length ?? 0,
    childrenPointers: childrenMap.get(pointer) || [],
    pointer,
  }));

  return nodes;
}

export const graph = {
  analyzeStructure,
  exportForVisualization,
} as const;
