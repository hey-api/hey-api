/**
 * Returns the reusable component name from `$ref`.
 */
export function refToName($ref: string): string {
  const path = jsonPointerToPath($ref);
  const name = path[path.length - 1]!;
  return name;
}

const jsonPointerSegmentEscapeNeeded = /[~/]/;

/**
 * Encodes a path segment for use in a JSON Pointer (RFC 6901).
 *
 * - Replaces all '~' with '~0'.
 * - Replaces all '/' with '~1'.
 *
 * This ensures that path segments containing these characters are safely
 * represented in JSON Pointer strings.
 *
 * Core idea: rather than always running two full-string `.replaceAll`
 * passes, find the index of the first character that needs escaping. If
 * there is none, the input is returned as-is with zero allocation. If there
 * is one, only that point onward needs a char-by-char scan — the untouched
 * prefix is reused verbatim via `slice`, and the loop copies unescaped runs
 * in bulk (via a pending start index) instead of appending one character at
 * a time.
 *
 * @param segment - The path segment (string or number) to encode.
 * @returns The encoded segment as a string.
 */
export function encodeJsonPointerSegment(segment: string | number): string {
  const str = typeof segment === 'string' ? segment : String(segment);

  const match = jsonPointerSegmentEscapeNeeded.exec(str);
  if (match === null) return str;

  let result = str.slice(0, match.index);
  let runStart = match.index;

  for (let i = match.index, len = str.length; i < len; i++) {
    let escape: string;
    switch (str.charCodeAt(i)) {
      case 126: // ~
        escape = '~0';
        break;
      case 47: // /
        escape = '~1';
        break;
      default:
        continue;
    }
    if (runStart !== i) result += str.slice(runStart, i);
    result += escape;
    runStart = i + 1;
  }

  if (runStart !== str.length) result += str.slice(runStart);
  return result;
}

/**
 * Converts a JSON Pointer string (RFC 6901) to an array of path segments.
 *
 * - Removes the leading '#' if present.
 * - Splits the pointer on '/'.
 * - Decodes '~1' to '/' and '~0' to '~' in each segment.
 * - Returns an empty array for the root pointer ('#' or '').
 *
 * @param pointer - The JSON Pointer string to convert (e.g., '#/components/schemas/Foo').
 * @returns An array of decoded path segments.
 */
export function jsonPointerToPath(pointer: string): ReadonlyArray<string> {
  let clean = pointer.trim();
  if (clean.startsWith('#')) {
    clean = clean.slice(1);
  }
  if (clean.startsWith('/')) {
    clean = clean.slice(1);
  }
  if (!clean) {
    return [];
  }
  // fast path: if the pointer doesn't contain '~', we can skip the decoding step entirely
  if (!clean.includes('~')) {
    return clean.split('/');
  }
  return clean.split('/').map((part) => part.replaceAll('~1', '/').replaceAll('~0', '~'));
}

/**
 * Normalizes a JSON Pointer string to a canonical form.
 *
 * - Ensures the pointer starts with '#'.
 * - Removes trailing slashes (except for root).
 * - Collapses multiple consecutive slashes into one.
 * - Trims whitespace from the input.
 *
 * @param pointer - The JSON Pointer string to normalize.
 * @returns The normalized JSON Pointer string.
 */
export function normalizeJsonPointer(pointer: string): string {
  let normalized = pointer.trim();
  if (!normalized.startsWith('#')) {
    normalized = `#${normalized}`;
  }
  // Remove trailing slashes (except for root)
  if (normalized.length > 1 && normalized.endsWith('/')) {
    normalized = normalized.slice(0, -1);
  }
  // Collapse multiple slashes
  normalized = normalized.replace(/\/+/g, '/');
  return normalized;
}

/**
 * Encode path as JSON Pointer (RFC 6901).
 *
 * @param path
 * @returns
 */
export function pathToJsonPointer(path: ReadonlyArray<string | number>): string {
  const len = path.length;
  if (len === 0) return '#';
  let segments = encodeJsonPointerSegment(path[0]!);
  for (let i = 1; i < len; i++) {
    segments += '/';
    segments += encodeJsonPointerSegment(path[i]!);
  }
  return `#/${segments}`;
}

/**
 * Checks if a $ref or path points to a top-level component (not a deep path reference).
 *
 * Top-level component references:
 * - OpenAPI 3.x: #/components/{type}/{name} (3 segments)
 * - OpenAPI 2.0: #/definitions/{name} (2 segments)
 *
 * Deep path references (4+ segments for 3.x, 3+ for 2.0) should be inlined
 * because they don't have corresponding registered symbols.
 *
 * @param refOrPath - The $ref string or path array to check
 * @returns true if the ref points to a top-level component, false otherwise
 */
export function isTopLevelComponent(refOrPath: string | ReadonlyArray<string | number>): boolean {
  if (typeof refOrPath !== 'string') {
    // OpenAPI 3.x: #/components/{type}/{name} = 3 segments
    if (refOrPath[0] === 'components') {
      return refOrPath.length === 3;
    }
    // OpenAPI 2.0: #/definitions/{name} = 2 segments
    if (refOrPath[0] === 'definitions') {
      return refOrPath.length === 2;
    }
    return false;
  }

  // OpenAPI 3.x: #/components/{type}/{name} — exactly one slash after the type segment
  if (refOrPath.startsWith('#/components/')) {
    // '#/components/'.length === 13
    const typeEnd = refOrPath.indexOf('/', 13);
    if (typeEnd === -1) {
      // there is no slash after the type segment, missing name segment
      return false;
    }
    const nameStart = typeEnd + 1;
    return nameStart < refOrPath.length && refOrPath.indexOf('/', nameStart) === -1;
  }
  // OpenAPI 2.0: #/definitions/{name} — no slash after the name
  if (refOrPath.startsWith('#/definitions/')) {
    // '#/definitions/'.length === 14
    const nameStart = 14;
    return nameStart < refOrPath.length && refOrPath.indexOf('/', nameStart) === -1;
  }
  return false;
}

export function resolveRef<T>({ $ref, spec }: { $ref: string; spec: Record<string, any> }): T {
  const path = jsonPointerToPath($ref);

  let current = spec;

  for (const part of path) {
    const segment = part as keyof typeof current;
    if (current[segment] === undefined) {
      throw new Error(`Reference not found: ${$ref}`);
    }
    current = current[segment];
  }

  return current as T;
}
