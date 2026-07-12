type Obj = Record<string, unknown> | Set<string> | ReadonlyArray<string | undefined>;

function hasName(obj: Obj, value: string): boolean {
  if (obj instanceof Set) {
    return obj.has(value);
  }
  if (obj instanceof Array) {
    return obj.includes(value);
  }
  return value in obj;
}

export function getUniqueComponentName({
  base,
  components,
  extraComponents,
}: {
  base: string;
  /**
   * Input components.
   */
  components: Obj;
  /**
   * Temporary input components, waiting to be inserted for example.
   */
  extraComponents?: Obj;
}): string {
  let index = 2;
  let name = base;
  while (hasName(components, name) || (extraComponents && hasName(extraComponents, name))) {
    name = `${base}${index}`;
    index += 1;
  }
  return name;
}

export function isPathRootSchema(path: ReadonlyArray<string | number>) {
  return (
    (path.length === 3 && path[0] === 'components' && path[1] === 'schemas') ||
    (path.length === 2 && path[0] === 'definitions')
  );
}

export function specToSchemasPointerNamespace(spec: unknown): string {
  if (spec && typeof spec === 'object') {
    if ('swagger' in spec) {
      // #/definitions/SchemaName
      return '#/definitions/';
    }

    if ('openapi' in spec) {
      // #/components/schemas/SchemaName
      return '#/components/schemas/';
    }
  }

  return '';
}
