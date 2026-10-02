import type { Graph, NodeInfo } from '../../../../graph';
import { pruneSchemaByScope } from '../readWrite';

const graphWithNode = (pointer: string, scopes: NodeInfo['scopes']): Graph => ({
  nodeDependencies: new Map(),
  nodes: new Map([[pointer, { key: null, node: {}, parentPointer: null, scopes }]]),
  subtreeDependencies: new Map(),
  transitiveDependencies: new Map(),
});

describe('pruneSchemaByScope', () => {
  it('keeps a $ref sibling on an otherwise-empty schema when the referenced node is not exclusively the excluded scope', () => {
    const graph = graphWithNode('#/components/schemas/Foo', new Set(['read', 'write']));
    const schema = { $ref: '#/components/schemas/Foo', type: 'object' };

    const shouldRemove = pruneSchemaByScope(graph, schema, 'writeOnly');

    expect(shouldRemove).toBe(false);
    expect(schema).toEqual({ $ref: '#/components/schemas/Foo', type: 'object' });
  });

  it('still removes a $ref that is exclusively the excluded scope', () => {
    const graph = graphWithNode('#/components/schemas/Bar', new Set(['write']));
    const schema = { $ref: '#/components/schemas/Bar', type: 'object' };

    const shouldRemove = pruneSchemaByScope(graph, schema, 'writeOnly');

    expect(shouldRemove).toBe(true);
  });

  it('removes a genuinely empty schema with no $ref', () => {
    const graph: Graph = {
      nodeDependencies: new Map(),
      nodes: new Map(),
      subtreeDependencies: new Map(),
      transitiveDependencies: new Map(),
    };
    const schema = { type: 'object' };

    const shouldRemove = pruneSchemaByScope(graph, schema, 'writeOnly');

    expect(shouldRemove).toBe(true);
  });
});
