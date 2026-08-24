import type { ResolvedRequestOptions } from '../bundle';
import { createClient } from '../bundle/client';

type MockFetch = ((...args: any[]) => any) & {
  preconnect?: any;
};

describe('buildUrl', () => {
  const client = createClient();

  const scenarios: {
    options: Parameters<typeof client.buildUrl>[0];
    url: string;
  }[] = [
    {
      options: {
        url: '',
      },
      url: '/',
    },
    {
      options: {
        url: '/foo',
      },
      url: '/foo',
    },
    {
      options: {
        path: {
          fooId: 1,
        },
        url: '/foo/{fooId}',
      },
      url: '/foo/1',
    },
    {
      options: {
        path: {
          fooId: 1,
        },
        query: {
          bar: 'baz',
        },
        url: '/foo/{fooId}',
      },
      url: '/foo/1?bar=baz',
    },
    {
      options: {
        query: {
          bar: [],
          foo: [],
        },
        url: '/',
      },
      url: '/',
    },
    {
      options: {
        query: {
          bar: [],
          foo: ['abc', 'def'],
        },
        url: '/',
      },
      url: '/?foo=abc&foo=def',
    },
  ];

  it.each(scenarios)('returns $url', ({ options, url }) => {
    expect(client.buildUrl(options)).toBe(url);
  });

  it('uses baseUrl from client config by default', () => {
    const clientWithBase = createClient({ baseUrl: 'https://example.com' });
    expect(clientWithBase.buildUrl({ url: '/foo' })).toBe('https://example.com/foo');
  });

  it('allows overriding baseUrl from client config', () => {
    const clientWithBase = createClient({ baseUrl: 'https://example.com' });
    expect(clientWithBase.buildUrl({ baseUrl: 'https://other.com', url: '/foo' })).toBe(
      'https://other.com/foo',
    );
  });
});

describe('zero-length body handling', () => {
  const client = createClient({ baseUrl: 'https://example.com' });

  it('returns empty Blob for zero-length application/octet-stream response', async () => {
    const mockResponse = new Response(null, {
      headers: {
        'Content-Length': '0',
        'Content-Type': 'application/octet-stream',
      },
      status: 200,
    });

    const mockFetch: MockFetch = vi.fn().mockResolvedValue(mockResponse);

    const result = await client.request({
      fetch: mockFetch,
      method: 'GET',
      url: '/test',
    });

    expect(result.data).toBeInstanceOf(Blob);
    expect((result.data as Blob).size).toBe(0);
  });

  it('returns empty ArrayBuffer for zero-length response with arrayBuffer parseAs', async () => {
    const mockResponse = new Response(null, {
      headers: {
        'Content-Length': '0',
      },
      status: 200,
    });

    const mockFetch: MockFetch = vi.fn().mockResolvedValue(mockResponse);

    const result = await client.request({
      fetch: mockFetch,
      method: 'GET',
      parseAs: 'arrayBuffer',
      url: '/test',
    });

    expect(result.data).toBeInstanceOf(ArrayBuffer);
    expect((result.data as ArrayBuffer).byteLength).toBe(0);
  });

  it('returns empty string for zero-length text response', async () => {
    const mockResponse = new Response(null, {
      headers: {
        'Content-Length': '0',
        'Content-Type': 'text/plain',
      },
      status: 200,
    });

    const mockFetch: MockFetch = vi.fn().mockResolvedValue(mockResponse);

    const result = await client.request({
      fetch: mockFetch,
      method: 'GET',
      url: '/test',
    });

    expect(result.data).toBe('');
  });

  it('returns empty object for zero-length JSON response', async () => {
    const mockResponse = new Response(null, {
      headers: {
        'Content-Length': '0',
        'Content-Type': 'application/json',
      },
      status: 200,
    });

    const mockFetch: MockFetch = vi.fn().mockResolvedValue(mockResponse);

    const result = await client.request({
      fetch: mockFetch,
      method: 'GET',
      url: '/test',
    });

    expect(result.data).toEqual({});
  });

  it('returns empty FormData for zero-length multipart/form-data response', async () => {
    const mockResponse = new Response(null, {
      headers: {
        'Content-Length': '0',
        'Content-Type': 'multipart/form-data',
      },
      status: 200,
    });

    const mockFetch: MockFetch = vi.fn().mockResolvedValue(mockResponse);

    const result = await client.request({
      fetch: mockFetch,
      method: 'GET',
      url: '/test',
    });

    expect(result.data).toBeInstanceOf(FormData);
    expect([...(result.data as FormData).entries()]).toHaveLength(0);
  });

  it('returns stream body for zero-length stream response', async () => {
    const mockBody = new ReadableStream();
    const mockResponse = new Response(mockBody, {
      headers: {
        'Content-Length': '0',
      },
      status: 200,
    });

    const mockFetch: MockFetch = vi.fn().mockResolvedValue(mockResponse);

    const result = await client.request({
      fetch: mockFetch,
      method: 'GET',
      parseAs: 'stream',
      url: '/test',
    });

    expect(result.data).toBe(mockBody);
  });

  it('handles non-zero content correctly for comparison', async () => {
    const blobContent = new Blob(['test data']);
    const mockResponse = new Response(blobContent, {
      headers: {
        'Content-Type': 'application/octet-stream',
      },
      status: 200,
    });

    const mockFetch: MockFetch = vi.fn().mockResolvedValue(mockResponse);

    const result = await client.request({
      fetch: mockFetch,
      method: 'GET',
      url: '/test',
    });

    expect(result.data).toBeInstanceOf(Blob);
    expect((result.data as Blob).size).toBeGreaterThan(0);
  });

  it('returns empty object for empty JSON response without Content-Length header (status 200)', async () => {
    // Simulates a server returning an empty body with status 200 and no Content-Length header
    // This is the scenario described in the issue where response.json() throws
    const mockResponse = new Response('', {
      headers: {
        'Content-Type': 'application/json',
      },
      status: 200,
    });

    const mockFetch: MockFetch = vi.fn().mockResolvedValue(mockResponse);

    const result = await client.request({
      fetch: mockFetch,
      method: 'GET',
      url: '/test',
    });

    expect(result.data).toEqual({});
  });

  it('returns empty object for empty response without Content-Length header and no Content-Type (defaults to JSON)', async () => {
    // Tests the auto-detection behavior when no Content-Type is provided
    const mockResponse = new Response('', {
      status: 200,
    });

    const mockFetch: MockFetch = vi.fn().mockResolvedValue(mockResponse);

    const result = await client.request({
      fetch: mockFetch,
      method: 'GET',
      url: '/test',
    });

    // When parseAs is 'auto' and no Content-Type header exists, it should handle empty body gracefully
    expect(result.data).toBeDefined();
  });
});

describe('unserialized request body handling', () => {
  const client = createClient({ baseUrl: 'https://example.com' });

  const scenarios = [
    { body: 0, textValue: '0' },
    { body: false, textValue: 'false' },
    { body: 'test string', textValue: 'test string' },
    { body: '', textValue: '' },
  ];

  it.each(scenarios)('handles plain text body with $body value', async ({ body, textValue }) => {
    const mockResponse = new Response(JSON.stringify({ success: true }), {
      headers: {
        'Content-Type': 'application/json',
      },
      status: 200,
    });

    const mockFetch: MockFetch = vi.fn().mockResolvedValueOnce(mockResponse);

    const result = await client.post({
      body,
      bodySerializer: null,
      fetch: mockFetch,
      headers: {
        'Content-Type': 'text/plain',
      },
      url: '/test',
    });

    expect(mockFetch).toHaveBeenCalledWith(
      expect.objectContaining({
        body: expect.any(ReadableStream),
      }),
    );

    await expect(result.request!.text()).resolves.toEqual(textValue);
    expect(result.request!.headers.get('Content-Type')).toEqual('text/plain');
  });
});

describe('serialized request body handling', () => {
  const client = createClient({ baseUrl: 'https://example.com' });

  const scenarios = [
    {
      body: '',
      expectBodyValue: false,
      expectContentHeader: false,
      serializedBody: '',
      textValue: '',
    },
    {
      body: 0,
      expectBodyValue: true,
      expectContentHeader: true,
      serializedBody: 0,
      textValue: '0',
    },
    {
      body: false,
      expectBodyValue: true,
      expectContentHeader: true,
      serializedBody: false,
      textValue: 'false',
    },
    {
      body: {},
      expectBodyValue: true,
      expectContentHeader: true,
      serializedBody: '{"key":"value"}',
      textValue: '{"key":"value"}',
    },
  ];

  it.each(scenarios)(
    'handles $serializedBody serializedBody value',
    async ({ body, expectBodyValue, expectContentHeader, serializedBody, textValue }) => {
      const mockResponse = new Response(JSON.stringify({ success: true }), {
        headers: {
          'Content-Type': 'application/json',
        },
        status: 200,
      });

      const mockFetch: MockFetch = vi.fn().mockResolvedValueOnce(mockResponse);

      const result = await client.post({
        body,
        bodySerializer: () => serializedBody,
        fetch: mockFetch,
        headers: {
          'Content-Type': 'application/json',
        },
        url: '/test',
      });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.objectContaining({
          body: expectBodyValue ? expect.any(ReadableStream) : null,
        }),
      );

      await expect(result.request!.text()).resolves.toEqual(textValue);
      expect(result.request!.headers.get('Content-Type')).toEqual(
        expectContentHeader ? 'application/json' : null,
      );
    },
  );
});

describe('request interceptor', () => {
  const client = createClient({ baseUrl: 'https://example.com' });

  const scenarios = [
    {
      body: 'test string',
      bodySerializer: null,
      contentType: 'text/plain',
      expectedSerializedValue: undefined,
      expectedValue: async (request: Request) => await request.text(),
    },
    {
      body: { key: 'value' },
      bodySerializer: (body: unknown) => JSON.stringify(body),
      contentType: 'application/json',
      expectedSerializedValue: '{"key":"value"}',
      expectedValue: async (request: Request) => await request.json(),
    },
  ];

  it.each(scenarios)(
    'exposes $contentType serialized and raw body values',
    async ({ body, bodySerializer, contentType, expectedSerializedValue }) => {
      const mockResponse = new Response(JSON.stringify({ success: true }), {
        headers: {
          'Content-Type': 'application/json',
        },
        status: 200,
      });

      const mockFetch: MockFetch = vi.fn().mockResolvedValueOnce(mockResponse);

      const mockRequestInterceptor = vi
        .fn()
        .mockImplementation((request: Request, options: ResolvedRequestOptions) => {
          expect(options.serializedBody).toBe(expectedSerializedValue);
          expect(options.body).toBe(body);

          return request;
        });

      const interceptorId = client.interceptors.request.use(mockRequestInterceptor);

      await client.post({
        body,
        bodySerializer,
        fetch: mockFetch,
        headers: {
          'Content-Type': contentType,
        },
        url: '/test',
      });

      expect(mockRequestInterceptor).toHaveBeenCalledOnce();

      client.interceptors.request.eject(interceptorId);
    },
  );
});

describe('error interceptor for fetch exceptions', () => {
  it('intercepts AbortError when fetch is aborted', async () => {
    const client = createClient({ baseUrl: 'https://example.com' });

    const abortError = new DOMException('The operation was aborted', 'AbortError');
    const mockFetch: MockFetch = vi.fn().mockRejectedValue(abortError);

    const mockErrorInterceptor = vi.fn().mockImplementation((error) => {
      expect(error).toBe(abortError);
      return { message: 'Request was aborted', type: 'abort' };
    });

    const interceptorId = client.interceptors.error.use(mockErrorInterceptor);

    const result = await client.get({
      fetch: mockFetch,
      url: '/test',
    });

    expect(mockErrorInterceptor).toHaveBeenCalledOnce();
    expect(result.error).toEqual({
      message: 'Request was aborted',
      type: 'abort',
    });

    client.interceptors.error.eject(interceptorId);
  });

  it('intercepts network errors', async () => {
    const client = createClient({ baseUrl: 'https://example.com' });

    const networkError = new TypeError('Failed to fetch');
    const mockFetch: MockFetch = vi.fn().mockRejectedValue(networkError);

    const mockErrorInterceptor = vi.fn().mockImplementation((error) => {
      expect(error).toBe(networkError);
      return { message: 'Network error occurred', type: 'network' };
    });

    const interceptorId = client.interceptors.error.use(mockErrorInterceptor);

    const result = await client.get({
      fetch: mockFetch,
      url: '/test',
    });

    expect(mockErrorInterceptor).toHaveBeenCalledOnce();
    expect(result.error).toEqual({
      message: 'Network error occurred',
      type: 'network',
    });

    client.interceptors.error.eject(interceptorId);
  });

  it('throws AbortError when throwOnError is true', async () => {
    const client = createClient({ baseUrl: 'https://example.com' });

    const abortError = new DOMException('The operation was aborted', 'AbortError');
    const mockFetch: MockFetch = vi.fn().mockRejectedValue(abortError);

    const mockErrorInterceptor = vi.fn().mockImplementation(() => ({
      message: 'Request was aborted',
      type: 'abort',
    }));

    const interceptorId = client.interceptors.error.use(mockErrorInterceptor);

    await expect(
      client.get({
        fetch: mockFetch,
        throwOnError: true,
        url: '/test',
      }),
    ).rejects.toEqual({ message: 'Request was aborted', type: 'abort' });

    expect(mockErrorInterceptor).toHaveBeenCalledOnce();

    client.interceptors.error.eject(interceptorId);
  });

  it('handles fetch exceptions without error interceptor', async () => {
    const client = createClient({ baseUrl: 'https://example.com' });

    const abortError = new DOMException('The operation was aborted', 'AbortError');
    const mockFetch: MockFetch = vi.fn().mockRejectedValue(abortError);

    const result = await client.get({
      fetch: mockFetch,
      url: '/test',
    });

    expect(result.error).toBe(abortError);
  });
});

describe('request validator', () => {
  it('receives expected parameters', async () => {
    const client = createClient({ baseUrl: 'https://example.com' });

    const mockHeaders = new Headers();
    mockHeaders.append('content-length', '0');
    mockHeaders.append('set-cookie', 'a=b');
    mockHeaders.append('set-cookie', '1=2');
    const mockResponse = new Response(null, {
      headers: mockHeaders,
      status: 200,
    });
    const mockFetch: MockFetch = vi.fn().mockRejectedValue(mockResponse);
    const mockRequestValidator = vi.fn();
    const body = {
      testBody: new ReadableStream(),
      testBodyDate: new Date(),
    };
    const headers = {
      testHeader: 'header',
      testHeaderArr: ['123', 'abc'],
      testHeaderBlob: new Blob([]),
    };
    const path = {
      testPath: 'path',
      testPathUrl: new URL('https://heyapi.dev/'),
    };
    const query = {
      testQuery: 123,
      testQueryRegex: /something/,
    };
    await client.request({
      body,
      fetch: mockFetch,
      headers,
      method: 'GET',
      path,
      query,
      async requestValidator(data) {
        mockRequestValidator(data);
      },
      url: '/test',
    });

    expect(mockRequestValidator).toHaveBeenCalledExactlyOnceWith(
      // path, query, headers and body must retain their full shape and must not be serialized
      expect.objectContaining({
        body: expect.objectContaining(body),
        headers: expect.objectContaining(headers),
        path: expect.objectContaining(path),
        query: expect.objectContaining(query),
      }),
    );
  });
});
