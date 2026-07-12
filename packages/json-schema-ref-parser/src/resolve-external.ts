import type { $RefParser } from '.';
import { getResolvedInput } from '.';
import type { $RefParserOptions } from './options';
import { newFile, parseFile } from './parse';
import Pointer from './pointer';
import $Ref from './ref';
import type $Refs from './refs';
import { fileResolver } from './resolvers/file';
import { urlResolver } from './resolvers/url';
import type { JSONSchema } from './types';
import { isHandledError } from './util/errors';
import * as url from './util/url';

/**
 * Crawls the JSON schema, finds all external JSON references, and resolves their values.
 * This method does not mutate the JSON schema. The resolved values are added to {@link $RefParser#$refs}.
 *
 * NOTE: We only care about EXTERNAL references here. INTERNAL references are only relevant when dereferencing.
 *
 * @returns
 * The promise resolves once all JSON references in the schema have been resolved,
 * including nested references that are contained in externally-referenced files.
 */
export async function resolveExternal(parser: $RefParser, options: $RefParserOptions) {
  const promises = crawl(parser.schema, {
    $refs: parser.$refs,
    options: options.parse,
    path: `${parser.$refs._root$Ref.path}#`,
  });
  await Promise.all(promises);
}

/**
 * Recursively crawls the given value, and resolves any external JSON references.
 *
 * @param obj - The value to crawl. If it's not an object or array, it will be ignored.
 * @returns An array of promises. There will be one promise for each JSON reference in `obj`.
 * If `obj` does not contain any JSON references, then the array will be empty.
 * If any of the JSON references point to files that contain additional JSON references,
 * then the corresponding promise will internally reference an array of promises.
 */
function crawl<S extends object = JSONSchema>(
  obj: string | Buffer | S | undefined | null,
  {
    $refs,
    external = false,
    options,
    path,
    seen = new Set(),
  }: {
    $refs: $Refs<S>;
    /** Whether `obj` was found in an external document. */
    external?: boolean;
    options: $RefParserOptions['parse'];
    /** The full path of `obj`, possibly with a JSON Pointer in the hash. */
    path: string;
    seen?: Set<unknown>;
  },
): ReadonlyArray<Promise<unknown>> {
  let promises: Array<Promise<unknown>> = [];

  if (obj && typeof obj === 'object' && !ArrayBuffer.isView(obj) && !seen.has(obj)) {
    seen.add(obj);

    if ($Ref.isExternal$Ref(obj)) {
      promises.push(
        resolve$Ref<S>(obj, {
          $refs,
          options,
          path,
          seen,
        }),
      );
    }

    for (const [key, value] of Object.entries(obj)) {
      promises = promises.concat(
        crawl(value, {
          $refs,
          external,
          options,
          path: Pointer.join(path, key),
          seen,
        }),
      );
    }
  }

  return promises;
}

/**
 * Resolves the given JSON Reference, and then crawls the resulting value.
 *
 * @param $ref - The JSON Reference to resolve
 * @param path - The full path of `$ref`, possibly with a JSON Pointer in the hash
 * @param $refs
 * @param options
 *
 * @returns
 * The promise resolves once all JSON references in the object have been resolved,
 * including nested references that are contained in externally-referenced files.
 */
async function resolve$Ref<S extends object = JSONSchema>(
  $ref: S,
  {
    $refs,
    options,
    path,
    seen,
  }: {
    $refs: $Refs<S>;
    options: $RefParserOptions['parse'];
    path: string;
    seen: Set<unknown>;
  },
): Promise<unknown> {
  const resolvedPath = url.resolve(path, ($ref as JSONSchema).$ref!);
  const withoutHash = url.stripHash(resolvedPath);

  // If this ref points back to an input source we've already merged, avoid re-importing
  // by checking if the path (without hash) matches a known source in parser and we can serve it internally later.
  // We keep normal flow but ensure cache hit if already added.
  // Do we already have this $ref?
  const ref = $refs._$refs[withoutHash];
  if (ref) {
    // We've already parsed this $ref, so crawl it to resolve its own externals
    const promises = crawl(ref.value as S, {
      $refs,
      external: true,
      options,
      path: `${withoutHash}#`,
      seen,
    });
    return Promise.all(promises);
  }

  // Parse the $referenced file/url
  const file = newFile(resolvedPath);

  // Add a new $Ref for this file, even though we don't have the value yet.
  // This ensures that we don't simultaneously read & parse the same file multiple times
  const $refAdded = $refs._add(file.url);

  try {
    const resolvedInput = getResolvedInput({ pathOrUrlOrSchema: resolvedPath });

    $refAdded.pathType = resolvedInput.type;

    let promises: ReadonlyArray<Promise<unknown>> = [];

    if (resolvedInput.type !== 'json') {
      const resolver = resolvedInput.type === 'file' ? fileResolver : urlResolver;
      await resolver.handler({ file });
      const parseResult = await parseFile(file, options);
      $refAdded.value = parseResult.result;
      promises = crawl<JSONSchema>(parseResult.result, {
        $refs,
        external: true,
        options,
        path: `${withoutHash}#`,
        seen,
      });
    }

    return Promise.all(promises);
  } catch (error) {
    if (isHandledError(error)) {
      $refAdded.value = error;
    }
    throw error;
  }
}
