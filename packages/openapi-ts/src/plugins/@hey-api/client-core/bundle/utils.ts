import type { BodySerializer, QuerySerializer } from './bodySerializer';
import {
  type ArraySeparatorStyle,
  serializeArrayParam,
  serializeObjectParam,
  serializePrimitiveParam,
} from './pathSerializer';

export interface PathSerializer {
  path: Record<string, unknown>;
  url: string;
}

export const PATH_PARAM_RE: RegExp = /\{[^{}]+\}/g;

export const defaultPathSerializer = ({ path, url: _url }: PathSerializer): string => {
  let url = _url;
  const matches = _url.match(PATH_PARAM_RE);
  if (matches) {
    for (const match of matches) {
      let explode = false;
      let name = match.substring(1, match.length - 1);
      let style: ArraySeparatorStyle = 'simple';

      if (name.endsWith('*')) {
        explode = true;
        name = name.substring(0, name.length - 1);
      }

      if (name.startsWith('.')) {
        name = name.substring(1);
        style = 'label';
      } else if (name.startsWith(';')) {
        name = name.substring(1);
        style = 'matrix';
      }

      const value = path[name];

      if (value === undefined || value === null) {
        continue;
      }

      if (Array.isArray(value)) {
        url = url.replace(match, serializeArrayParam({ explode, name, style, value }));
        continue;
      }

      if (typeof value === 'object') {
        url = url.replace(
          match,
          serializeObjectParam({
            explode,
            name,
            style,
            value: value as Record<string, unknown>,
            valueOnly: true,
          }),
        );
        continue;
      }

      if (style === 'matrix') {
        url = url.replace(
          match,
          `;${serializePrimitiveParam({
            name,
            value: value as string,
          })}`,
        );
        continue;
      }

      const replaceValue = encodeURIComponent(
        style === 'label' ? `.${value as string}` : (value as string),
      );
      url = url.replace(match, replaceValue);
    }
  }
  return url;
};

export const getUrl = ({
  baseUrl,
  path,
  query,
  querySerializer,
  url: _url,
}: {
  baseUrl?: string;
  path?: Record<string, unknown>;
  query?: Record<string, unknown>;
  querySerializer: QuerySerializer;
  url: string;
}): string => {
  const pathUrl = _url.startsWith('/') ? _url : `/${_url}`;
  let url = (baseUrl ?? '') + pathUrl;
  if (path) {
    url = defaultPathSerializer({ path, url });
  }
  let search = query ? querySerializer(query) : '';
  if (search.startsWith('?')) {
    search = search.substring(1);
  }
  if (search) {
    url += `?${search}`;
  }
  return url;
};

const STANDARD_REQUEST_INIT_KEYS = [
  'body',
  'cache',
  'credentials',
  'duplex',
  'headers',
  'integrity',
  'keepalive',
  'method',
  'mode',
  'priority',
  'redirect',
  'referrer',
  'referrerPolicy',
  'signal',
  'window',
] as const;

/**
 * Returns a `RequestInit` containing only standard fields, dropping any
 * non-standard keys (e.g. internal client options such as `client`, `fetch`,
 * `baseUrl`, serializers and validators) that are otherwise spread into the
 * init.
 *
 * Node, undici and browsers ignore unknown `RequestInit` keys, but Deno and
 * Bun validate the init strictly and throw (e.g. Deno treats `client` as a
 * `Deno.HttpClient`). Sanitizing here keeps the generated client portable
 * across runtimes; it is a no-op on Node and in the browser.
 */
export const toRequestInit = (init: Record<PropertyKey, unknown>): RequestInit => {
  const result: Record<string, unknown> = {};
  for (const key of STANDARD_REQUEST_INIT_KEYS) {
    if (init[key] !== undefined) {
      result[key] = init[key];
    }
  }
  return result as RequestInit;
};

export function getValidRequestBody(options: {
  body?: unknown;
  bodySerializer?: BodySerializer | null;
  serializedBody?: unknown;
}): unknown {
  const hasBody = options.body !== undefined;
  const isSerializedBody = hasBody && options.bodySerializer;

  if (isSerializedBody) {
    if ('serializedBody' in options) {
      const hasSerializedBody =
        options.serializedBody !== undefined && options.serializedBody !== '';

      return hasSerializedBody ? options.serializedBody : null;
    }

    // not all clients implement a serializedBody property (i.e., client-axios)
    return options.body !== '' ? options.body : null;
  }

  // plain/text body
  if (hasBody) {
    return options.body;
  }

  // no body was provided
  return undefined;
}
