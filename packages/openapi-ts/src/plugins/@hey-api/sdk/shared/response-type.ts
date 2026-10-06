import type { PluginClientNames } from '../../../types';

/**
 * Infers `responseType` value from provided response content type. This is
 * an adapted version of `getParseAs()` from the Fetch API client.
 *
 * Used by Axios and Angular clients.
 *
 * From Axios documentation:
 * `responseType` indicates the type of data that the server will respond with
 * options are: 'arraybuffer', 'document', 'json', 'text', 'stream'
 * browser only: 'blob'
 */
export function getResponseType(
  contentType: string | null | undefined,
): 'arraybuffer' | 'blob' | 'document' | 'json' | 'stream' | 'text' | undefined {
  if (!contentType) {
    return;
  }

  const cleanContent = contentType.split(';')[0]?.trim();

  if (!cleanContent) {
    return;
  }

  if (cleanContent.startsWith('application/json') || cleanContent.endsWith('+json')) {
    return 'json';
  }

  // Axios does not handle form data out of the box
  // if (cleanContent === 'multipart/form-data') {
  //   return 'formData';
  // }

  if (
    ['application/', 'audio/', 'image/', 'video/'].some((type) => cleanContent.startsWith(type))
  ) {
    return 'blob';
  }

  if (cleanContent.startsWith('text/')) {
    return 'text';
  }

  return;
}

/**
 * `responseType` values each client understands. Clients absent from this map
 * (e.g. Fetch API) detect the response type at runtime.
 */
const supportedResponseTypes: Partial<
  Record<PluginClientNames, ReadonlyArray<NonNullable<ReturnType<typeof getResponseType>>>>
> = {
  // `json` is Angular's default, so it's omitted to keep generated code stable
  '@hey-api/client-angular': ['arraybuffer', 'blob', 'text'],
  '@hey-api/client-axios': ['arraybuffer', 'blob', 'document', 'json', 'stream', 'text'],
};

/**
 * Whether the client accepts `responseType` set to the provided value.
 */
export function isResponseTypeSupported(
  clientName: PluginClientNames,
  responseType: NonNullable<ReturnType<typeof getResponseType>>,
): boolean {
  return supportedResponseTypes[clientName]?.includes(responseType) ?? false;
}
