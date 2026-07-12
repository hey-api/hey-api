import type { Parser } from '../../../config/parser/types';
import { applyNaming } from '../../../utils/naming/naming';
import { getSchemasObject } from '../utils/transforms';
import { specToSchemasPointerNamespace } from './utils';

type SchemaNameConfig = Parser['transforms']['schemaName'];

/**
 * Recursively walks the entire spec object and replaces all $ref strings
 * according to the provided rename mapping.
 */
const rewriteRefs = (node: unknown, renameMap: Record<string, string>) => {
  if (node instanceof Array) {
    node.forEach((item) => rewriteRefs(item, renameMap));
  } else if (node && typeof node === 'object') {
    for (const [key, value] of Object.entries(node)) {
      if (key === '$ref' && typeof value === 'string' && value in renameMap) {
        (node as Record<string, unknown>)[key] = renameMap[value];
      } else {
        rewriteRefs(value, renameMap);
      }
    }
  }
};

/**
 * Renames schema component keys and updates all $ref pointers throughout
 * the spec. Handles collisions by skipping renames when the target name
 * already exists or conflicts with another rename.
 */
export function schemaNameTransform({ config, spec }: { config: SchemaNameConfig; spec: unknown }) {
  if (!config) {
    return;
  }

  const schemasObj = getSchemasObject(spec);
  if (!schemasObj) {
    return;
  }

  const schemasPointerNamespace = specToSchemasPointerNamespace(spec);
  if (!schemasPointerNamespace) {
    return;
  }

  const renameMap: Record<string, string> = {};
  const newNames = new Set<string>();
  const namingConfig = { name: config };

  for (const oldName of Object.keys(schemasObj)) {
    const newName = applyNaming(oldName, namingConfig);

    if (newName === oldName || newName in schemasObj || newNames.has(newName)) {
      continue;
    }

    renameMap[`${schemasPointerNamespace}${oldName}`] = `${schemasPointerNamespace}${newName}`;
    newNames.add(newName);
  }

  for (const [oldPointer, newPointer] of Object.entries(renameMap)) {
    const oldName = oldPointer.slice(schemasPointerNamespace.length);
    const newName = newPointer.slice(schemasPointerNamespace.length);
    const schema = schemasObj[oldName];

    delete schemasObj[oldName];
    schemasObj[newName] = schema;
  }

  if (Object.keys(renameMap).length) {
    rewriteRefs(spec, renameMap);
  }
}
