import { getResolvedInput, sendRequest } from '@hey-api/json-schema-ref-parser';
import type { MaybeArray } from '@hey-api/types';

import type { Input } from './config/input/types';
import type { WatchValues } from './types/watch';

const headersEntries = (headers: Headers): Array<[string, string]> => {
  const entries: Array<[string, string]> = [];
  headers.forEach((value, key) => {
    entries.push([key, value]);
  });
  return entries;
};

const mergeHeaders = (
  ...headers: Array<
    | RequestInit['headers']
    | Record<string, MaybeArray<string | number | boolean> | null | undefined | unknown>
    | undefined
  >
): Headers => {
  const mergedHeaders = new Headers();
  for (const header of headers) {
    if (!header) {
      continue;
    }

    const iterator = header instanceof Headers ? headersEntries(header) : Object.entries(header);

    for (const [key, value] of iterator) {
      if (value === null) {
        mergedHeaders.delete(key);
      } else if (Array.isArray(value)) {
        for (const v of value) {
          mergedHeaders.append(key, v as string);
        }
      } else if (value !== undefined) {
        // assume object headers are meant to be JSON stringified, i.e., their
        // content value in OpenAPI specification is 'application/json'
        mergedHeaders.set(
          key,
          typeof value === 'object' ? JSON.stringify(value) : (value as string),
        );
      }
    }
  }
  return mergedHeaders;
};

type SpecResponse = {
  arrayBuffer: ArrayBuffer | undefined;
  error?: never;
  resolvedInput: ReturnType<typeof getResolvedInput>;
  response?: never;
};

type SpecError = {
  arrayBuffer?: never;
  error: 'not-modified' | 'not-ok';
  resolvedInput?: never;
  response: Response;
};

/**
 * @internal
 */
export async function getSpec({
  fetchOptions,
  inputPath,
  timeout,
  watch,
}: {
  fetchOptions?: RequestInit;
  inputPath: Input['path'];
  timeout: number | undefined;
  watch: WatchValues;
}): Promise<SpecResponse | SpecError> {
  const resolvedInput = getResolvedInput({ pathOrUrlOrSchema: inputPath });

  let arrayBuffer: ArrayBuffer | undefined;
  // boolean signals whether the file has **definitely** changed
  let hasChanged: boolean | undefined;
  let response: Response | undefined;

  if (resolvedInput.type === 'url') {
    // do NOT send HEAD request on first run or if unsupported
    if (watch.lastValue && watch.isHeadMethodSupported !== false) {
      try {
        const request = await sendRequest({
          fetchOptions: {
            method: 'HEAD',
            ...fetchOptions,
            headers: mergeHeaders(fetchOptions?.headers, watch.headers),
          },
          timeout,
          url: resolvedInput.path,
        });

        response = request.response;
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return {
          error: 'not-ok',
          response: new Response(message, { status: 500 }),
        };
      }

      if (!response.ok && watch.isHeadMethodSupported) {
        // assume the server is no longer running
        // do nothing, it might be restarted later
        return {
          error: 'not-ok',
          response,
        };
      }

      if (watch.isHeadMethodSupported === undefined) {
        watch.isHeadMethodSupported = response.ok;
      }

      if (response.status === 304) {
        return {
          error: 'not-modified',
          response,
        };
      }

      if (hasChanged === undefined) {
        const eTag = response.headers.get('ETag');
        if (eTag) {
          hasChanged = eTag !== watch.headers.get('If-None-Match');

          if (hasChanged) {
            watch.headers.set('If-None-Match', eTag);
          }
        }
      }

      if (hasChanged === undefined) {
        const lastModified = response.headers.get('Last-Modified');
        if (lastModified) {
          hasChanged = lastModified !== watch.headers.get('If-Modified-Since');

          if (hasChanged) {
            watch.headers.set('If-Modified-Since', lastModified);
          }
        }
      }

      // we definitely know the input has not changed
      if (hasChanged === false) {
        return {
          error: 'not-modified',
          response,
        };
      }
    }

    try {
      const request = await sendRequest({
        fetchOptions: {
          method: 'GET',
          ...fetchOptions,
        },
        timeout,
        url: resolvedInput.path,
      });

      if (request.response.status >= 300) {
        return {
          error: 'not-ok',
          response: request.response,
        };
      }

      response = request.response;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return {
        error: 'not-ok',
        response: new Response(message, { status: 500 }),
      };
    }

    if (!response.ok) {
      // assume the server is no longer running
      // do nothing, it might be restarted later
      return {
        error: 'not-ok',
        response,
      };
    }

    arrayBuffer = response.body ? await response.arrayBuffer() : new ArrayBuffer(0);

    if (hasChanged === undefined) {
      const content = new TextDecoder().decode(arrayBuffer);
      hasChanged = content !== watch.lastValue;
      watch.lastValue = content;
    }
  } else {
    // we do not support watch mode for files or raw spec data
    if (!watch.lastValue) {
      watch.lastValue = resolvedInput.type;
    } else {
      hasChanged = false;
    }
  }

  if (hasChanged === false) {
    return {
      error: 'not-modified',
      response: response!,
    };
  }

  return {
    arrayBuffer,
    resolvedInput,
  };
}
