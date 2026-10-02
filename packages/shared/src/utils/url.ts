import type { IR } from '../ir/types';

const parseUrlRegExp =
  /^(([^:/?#]+):)?((\/\/)?([^:/?#]*)(:?([^/?#]*)))?([^?#]*)(\?([^#]*))?(#(.*))?/;

interface Url {
  host: string;
  path: string;
  port: string;
  protocol: string;
}

/**
 * Resolve the base URL value based on the plugin configuration.
 *
 * The `baseUrl` config option can be:
 * - `false` to disable using the base URL
 * - a string to use as the base URL
 * - a number to pick a server from the IR `servers` array
 */
function resolveBaseUrl(baseUrl: string | number | boolean, ir: IR.Model): string | undefined {
  if (baseUrl === false) return;
  if (typeof baseUrl === 'string') return baseUrl;
  const servers = ir.servers ?? [];
  return servers[typeof baseUrl === 'number' ? baseUrl : 0]?.url;
}

/**
 * Resolve the base URL string if it's a valid URL or path.
 */
export function getBaseUrl(config: string | number | boolean, ir: IR.Model): string | undefined {
  const baseUrl = resolveBaseUrl(config, ir);
  if (baseUrl === undefined) return;
  if (baseUrl.includes('{')) return;
  const url = parseUrl(baseUrl);
  if (url.protocol && url.host) return baseUrl;
  // '/' would turn request paths into protocol-relative URLs ('//path')
  if (baseUrl === '/') return;
  if (baseUrl.startsWith('/')) {
    return baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  }
  return baseUrl;
}

export function parseUrl(value: string): Url {
  const errorResponse: Url = {
    host: '',
    path: '',
    port: '',
    protocol: '',
  };

  parseUrlRegExp.lastIndex = 0;
  const match = value.match(parseUrlRegExp);

  if (!match) {
    return errorResponse;
  }

  const host = match[5] || '';

  // value is a relative file system path
  if (host === '.' || host === '..') {
    return errorResponse;
  }

  const path = match[8] || '';
  const protocol = match[2] || '';

  // value is probably a Windows file system path
  if (protocol.length === 1) {
    return errorResponse;
  }

  return {
    host,
    path: path === '/' ? '' : path,
    port: match[7] || '',
    protocol,
  };
}
