export function getSchemasObject(spec: unknown): Record<string, unknown> | undefined {
  if (hasComponentsSchemasObject(spec)) {
    return (spec as any).components.schemas;
  }
  if (hasDefinitionsObject(spec)) {
    return (spec as any).definitions;
  }
  return;
}

/**
 * Checks if the given spec has a valid OpenAPI 3.x components.schemas object.
 * Returns true if present, false otherwise.
 */
export function hasComponentsSchemasObject(spec: unknown): boolean {
  return (
    typeof spec === 'object' &&
    spec !== null &&
    'components' in spec &&
    typeof (spec as any).components === 'object' &&
    (spec as any).components !== null &&
    'schemas' in (spec as any).components &&
    typeof (spec as any).components.schemas === 'object' &&
    (spec as any).components.schemas !== null
  );
}

/**
 * Checks if the given spec has a valid OpenAPI 2.0 definitions object.
 * Returns true if present, false otherwise.
 */
export function hasDefinitionsObject(spec: unknown): boolean {
  return (
    typeof spec === 'object' &&
    spec !== null &&
    'definitions' in spec &&
    typeof (spec as any).definitions === 'object' &&
    (spec as any).definitions !== null
  );
}
