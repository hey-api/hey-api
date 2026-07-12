/**
 * path-to-regexp v6 (used by MSW) only allows word characters in param names.
 * So transform what's necessary: replace non-word chars with camelCase transitions,
 * preserving the original casing to stay consistent with the TypeScript plugin's types.
 */
export function sanitizeParamName(name: string): string {
  return name.replace(/\W+(.)?/g, (_, char?: string) => (char ? char.toUpperCase() : ''));
}

/**
 * Transforms an OpenAPI path template (e.g. `/users/{userId}/posts/{postId}`)
 * into an MSW path template (e.g. `/users/:userId/posts/:postId`), sanitizing
 * param names as needed to conform to path-to-regexp v6 requirements.
 *
 * Note: MSW's path-to-regexp v6 does not allow regex patterns in the path
 * (e.g. `{id:\d+}`), so this function assumes simple param names without
 * patterns.
 */
export function sanitizePath(path: string): string {
  return (
    path
      .replace(/\{([^}]+)\}/g, (_, name: string) => `\0${sanitizeParamName(name)}`)
      .replace(/:/g, String.raw`\:`)
      // oxlint-disable-next-line no-control-regex
      .replace(/\0/g, ':')
  );
}
