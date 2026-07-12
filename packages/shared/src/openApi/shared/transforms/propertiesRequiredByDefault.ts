import { childSchemaRelationships } from '../utils/schemaChildRelationships';

type NodeInfo = {
  key: string | number | null;
  node: unknown;
  parent: unknown;
  path: ReadonlyArray<string | number>;
};

/**
 * Recursively walk all schemas in the OpenAPI spec, visiting every object.
 * Calls the visitor with node info for each.
 *
 * @param key - The key of the current node
 * @param node - The current node
 * @param parent - The parent node
 * @param path - The path to the current node
 * @param visitor - Function to call for each visited node
 */
const walkSchemas = ({
  key,
  node,
  parent,
  path,
  visitor,
}: NodeInfo & {
  visitor: (nodeInfo: NodeInfo) => void;
}) => {
  if (!node || typeof node !== 'object' || node instanceof Array) return;

  const value = node as Record<string, unknown>;

  if ('type' in value || childSchemaRelationships.some(([keyword]) => keyword in value)) {
    visitor({ key, node, parent, path });
  }

  for (const [k, v] of Object.entries(value)) {
    if (typeof v === 'object' && v !== null) {
      if (v instanceof Array) {
        v.forEach((item, index) =>
          walkSchemas({
            key: index,
            node: item,
            parent: v,
            path: [...path, k, index],
            visitor,
          }),
        );
      } else {
        walkSchemas({
          key: k,
          node: v,
          parent: node,
          path: [...path, k],
          visitor,
        });
      }
    }
  }
};

/**
 * Applies the properties required by default transform
 *
 * @param spec - The OpenAPI spec object to transform
 */
export function propertiesRequiredByDefaultTransform({ spec }: { spec: unknown }) {
  walkSchemas({
    key: null,
    node: spec,
    parent: null,
    path: [],
    visitor: (nodeInfo) => {
      if (
        nodeInfo.node &&
        typeof nodeInfo.node === 'object' &&
        'type' in nodeInfo.node &&
        nodeInfo.node.type === 'object' &&
        'properties' in nodeInfo.node &&
        nodeInfo.node.properties &&
        typeof nodeInfo.node.properties === 'object' &&
        !('required' in nodeInfo.node)
      ) {
        const propKeys = Object.keys(nodeInfo.node.properties as Record<string, unknown>);
        if (propKeys.length) {
          (nodeInfo.node as Record<string, unknown>).required = propKeys;
        }
      }
    },
  });
}
