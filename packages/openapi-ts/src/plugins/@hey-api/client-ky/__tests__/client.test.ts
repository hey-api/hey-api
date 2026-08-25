import type { KyInstance } from 'ky';
import ky, { HTTPError } from 'ky';

import type { ResolvedRequestOptions } from '../bundle';
import { createClient } from '../bundle/client';

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

    const mockKy = vi.fn().mockResolvedValue(mockResponse);

    const result = await client.request({
      ky: mockKy as Partial<KyInstance> as KyInstance,
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

    const mockKy = vi.fn().mockResolvedValue(mockResponse);

    const result = await client.request({
      ky: mockKy as Partial<KyInstance> as KyInstance,
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

    const mockKy = vi.fn().mockResolvedValue(mockResponse);

    const result = await client.request({
      ky: mockKy as Partial<KyInstance> as KyInstance,
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

    const mockKy = vi.fn().mockResolvedValue(mockResponse);

    const result = await client.request({
      ky: mockKy as Partial<KyInstance> as KyInstance,
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

    const mockKy = vi.fn().mockResolvedValue(mockResponse);

    const result = await client.request({
      ky: mockKy as Partial<KyInstance> as KyInstance,
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

    const mockKy = vi.fn().mockResolvedValue(mockResponse);

    const result = await client.request({
      ky: mockKy as Partial<KyInstance> as KyInstance,
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

    const mockKy = vi.fn().mockResolvedValue(mockResponse);

    const result = await client.request({
      ky: mockKy as Partial<KyInstance> as KyInstance,
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

    const mockKy = vi.fn().mockResolvedValue(mockResponse);

    const result = await client.request({
      ky: mockKy as Partial<KyInstance> as KyInstance,
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

    const mockKy = vi.fn().mockResolvedValue(mockResponse);

    const result = await client.request({
      ky: mockKy as Partial<KyInstance> as KyInstance,
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

    const mockKy = vi.fn().mockResolvedValueOnce(mockResponse);

    const result = await client.post({
      body,
      bodySerializer: null,
      headers: {
        'Content-Type': 'text/plain',
      },
      ky: mockKy as Partial<KyInstance> as KyInstance,
      url: '/test',
    });

    expect(mockKy).toHaveBeenCalledWith(
      expect.objectContaining({
        body: expect.any(ReadableStream),
      }),
      expect.any(Object),
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

      const mockKy = vi.fn().mockResolvedValueOnce(mockResponse);

      const result = await client.post({
        body,
        bodySerializer: () => serializedBody,
        headers: {
          'Content-Type': 'application/json',
        },
        ky: mockKy as Partial<KyInstance> as KyInstance,
        url: '/test',
      });

      expect(mockKy).toHaveBeenCalledWith(
        expect.objectContaining({
          body: expectBodyValue ? expect.any(ReadableStream) : null,
        }),
        expect.any(Object),
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

      const mockKy = vi.fn().mockResolvedValueOnce(mockResponse);

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
        headers: {
          'Content-Type': contentType,
        },
        ky: mockKy as Partial<KyInstance> as KyInstance,
        url: '/test',
      });

      expect(mockRequestInterceptor).toHaveBeenCalledOnce();

      client.interceptors.request.eject(interceptorId);
    },
  );
});

describe('response interceptor', () => {
  const client = createClient({ baseUrl: 'https://example.com' });

  it('allows response transformation', async () => {
    const mockResponse = new Response(JSON.stringify({ success: true }), {
      headers: {
        'Content-Type': 'application/json',
      },
      status: 200,
    });

    const mockKy = vi.fn().mockResolvedValue(mockResponse);

    const mockResponseInterceptor = vi.fn().mockImplementation((response: Response) => {
      expect(response).toBe(mockResponse);
      return response;
    });

    const interceptorId = client.interceptors.response.use(mockResponseInterceptor);

    await client.get({
      ky: mockKy as Partial<KyInstance> as KyInstance,
      url: '/test',
    });

    expect(mockResponseInterceptor).toHaveBeenCalledOnce();

    client.interceptors.response.eject(interceptorId);
  });
});

describe('error handling', () => {
  const client = createClient({ baseUrl: 'https://example.com' });

  it('handles HTTP errors with throwOnError: false', async () => {
    const errorResponse = new Response(JSON.stringify({ message: 'Not found' }), {
      headers: {
        'Content-Type': 'application/json',
      },
      status: 404,
    });

    const mockKy = vi.fn().mockRejectedValue(
      new HTTPError(errorResponse, new Request('https://example.com/test'), {
        method: 'GET',
      } as any),
    );

    const result = await client.get({
      ky: mockKy as Partial<KyInstance> as KyInstance,
      throwOnError: false,
      url: '/test',
    });

    expect(result.error).toEqual({ message: 'Not found' });
    expect(result.response!.status).toBe(404);
  });

  it('throws HTTP errors with throwOnError: true', async () => {
    const errorResponse = new Response(JSON.stringify({ message: 'Not found' }), {
      headers: {
        'Content-Type': 'application/json',
      },
      status: 404,
    });

    const mockKy = vi.fn().mockRejectedValue(
      new HTTPError(errorResponse, new Request('https://example.com/test'), {
        method: 'GET',
      } as any),
    );

    await expect(
      client.get({
        ky: mockKy as Partial<KyInstance> as KyInstance,
        throwOnError: true,
        url: '/test',
      }),
    ).rejects.toEqual({ message: 'Not found' });
  });

  it('handles text error responses', async () => {
    const errorResponse = new Response('Internal Server Error', {
      status: 500,
    });

    const mockKy = vi.fn().mockRejectedValue(
      new HTTPError(errorResponse, new Request('https://example.com/test'), {
        method: 'GET',
      } as any),
    );

    const result = await client.get({
      ky: mockKy as Partial<KyInstance> as KyInstance,
      throwOnError: false,
      url: '/test',
    });

    expect(result.error).toBe('Internal Server Error');
    expect(result.response!.status).toBe(500);
  });
});

describe('error interceptor', () => {
  const client = createClient({ baseUrl: 'https://example.com' });

  it('allows error transformation', async () => {
    const errorResponse = new Response(JSON.stringify({ message: 'Not found' }), {
      headers: {
        'Content-Type': 'application/json',
      },
      status: 404,
    });

    const mockKy = vi.fn().mockRejectedValue(
      new HTTPError(errorResponse, new Request('https://example.com/test'), {
        method: 'GET',
      } as any),
    );

    const mockErrorInterceptor = vi
      .fn()
      .mockImplementation((error: any) => ({ transformed: true, ...error }));

    const interceptorId = client.interceptors.error.use(mockErrorInterceptor);

    const result = await client.get({
      ky: mockKy as Partial<KyInstance> as KyInstance,
      throwOnError: false,
      url: '/test',
    });

    expect(mockErrorInterceptor).toHaveBeenCalledOnce();
    expect(result.error).toEqual({ message: 'Not found', transformed: true });

    client.interceptors.error.eject(interceptorId);
  });
});

describe('retry configuration', () => {
  const client = createClient({ baseUrl: 'https://example.com' });

  it('passes retry configuration to ky', async () => {
    const mockResponse = new Response(JSON.stringify({ success: true }), {
      headers: {
        'Content-Type': 'application/json',
      },
      status: 200,
    });

    const mockKy = vi.fn().mockResolvedValue(mockResponse);

    await client.get({
      ky: mockKy as Partial<KyInstance> as KyInstance,
      retry: {
        limit: 3,
        methods: ['get', 'post'],
        statusCodes: [408, 429, 500],
      },
      url: '/test',
    });

    expect(mockKy).toHaveBeenCalledWith(
      expect.any(Request),
      expect.objectContaining({
        retry: {
          limit: 3,
          methods: ['get', 'post'],
          statusCodes: [408, 429, 500],
        },
      }),
    );
  });

  it('omits retry when unset so ky instance defaults survive', async () => {
    const mockResponse = new Response(JSON.stringify({ success: true }), {
      headers: {
        'Content-Type': 'application/json',
      },
      status: 200,
    });

    const mockKy = vi.fn().mockResolvedValue(mockResponse);

    await client.get({
      ky: mockKy as Partial<KyInstance> as KyInstance,
      url: '/test',
    });

    expect(mockKy.mock.calls[0]![1]).not.toHaveProperty('retry');
  });

  it('passes kyOptions.retry to ky when top-level retry is unset', async () => {
    const mockResponse = new Response(JSON.stringify({ success: true }), {
      headers: {
        'Content-Type': 'application/json',
      },
      status: 200,
    });

    const mockKy = vi.fn().mockResolvedValue(mockResponse);

    await client.get({
      ky: mockKy as Partial<KyInstance> as KyInstance,
      kyOptions: {
        retry: { limit: 5, retryOnTimeout: true },
      },
      url: '/test',
    });

    expect(mockKy).toHaveBeenCalledWith(
      expect.any(Request),
      expect.objectContaining({
        retry: { limit: 5, retryOnTimeout: true },
      }),
    );
  });

  it('prefers top-level retry over kyOptions.retry', async () => {
    const mockResponse = new Response(JSON.stringify({ success: true }), {
      headers: {
        'Content-Type': 'application/json',
      },
      status: 200,
    });

    const mockKy = vi.fn().mockResolvedValue(mockResponse);

    await client.get({
      ky: mockKy as Partial<KyInstance> as KyInstance,
      kyOptions: {
        retry: { limit: 5 },
      },
      retry: 3,
      url: '/test',
    });

    expect(mockKy).toHaveBeenCalledWith(
      expect.any(Request),
      expect.objectContaining({
        retry: 3,
      }),
    );
  });

  it('prefers per-request kyOptions.retry over client-level retry', async () => {
    const mockResponse = new Response(JSON.stringify({ success: true }), {
      headers: {
        'Content-Type': 'application/json',
      },
      status: 200,
    });

    const mockKy = vi.fn().mockResolvedValue(mockResponse);

    const clientWithRetry = createClient({
      baseUrl: 'https://example.com',
      retry: 2,
    });

    await clientWithRetry.get({
      ky: mockKy as Partial<KyInstance> as KyInstance,
      kyOptions: {
        retry: { limit: 5 },
      },
      url: '/test',
    });

    expect(mockKy).toHaveBeenCalledWith(
      expect.any(Request),
      expect.objectContaining({
        retry: { limit: 5 },
      }),
    );
  });

  it('falls back to client-level retry when request does not specify one', async () => {
    const mockResponse = new Response(JSON.stringify({ success: true }), {
      headers: {
        'Content-Type': 'application/json',
      },
      status: 200,
    });

    const mockKy = vi.fn().mockResolvedValue(mockResponse);

    const clientWithRetry = createClient({
      baseUrl: 'https://example.com',
      kyOptions: {
        retry: { limit: 4 },
      },
    });

    await clientWithRetry.get({
      ky: mockKy as Partial<KyInstance> as KyInstance,
      url: '/test',
    });

    expect(mockKy).toHaveBeenCalledWith(
      expect.any(Request),
      expect.objectContaining({
        retry: { limit: 4 },
      }),
    );
  });
});

describe('redirect configuration', () => {
  const client = createClient({ baseUrl: 'https://example.com' });

  it('omits redirect when unset so ky instance defaults survive', async () => {
    const mockResponse = new Response(JSON.stringify({ success: true }), {
      headers: {
        'Content-Type': 'application/json',
      },
      status: 200,
    });

    const mockKy = vi.fn().mockResolvedValue(mockResponse);

    await client.get({
      ky: mockKy as Partial<KyInstance> as KyInstance,
      url: '/test',
    });

    expect(mockKy.mock.calls[0]![1]).not.toHaveProperty('redirect');
  });

  it('passes redirect to ky when set', async () => {
    const mockResponse = new Response(JSON.stringify({ success: true }), {
      headers: {
        'Content-Type': 'application/json',
      },
      status: 200,
    });

    const mockKy = vi.fn().mockResolvedValue(mockResponse);

    await client.get({
      ky: mockKy as Partial<KyInstance> as KyInstance,
      redirect: 'error',
      url: '/test',
    });

    expect(mockKy).toHaveBeenCalledWith(
      expect.any(Request),
      expect.objectContaining({
        redirect: 'error',
      }),
    );
  });
});

describe('setConfig kyOptions merging', () => {
  it('merges kyOptions instead of replacing them', async () => {
    const mockResponse = new Response(JSON.stringify({ success: true }), {
      headers: {
        'Content-Type': 'application/json',
      },
      status: 200,
    });

    const mockKy = vi.fn().mockResolvedValue(mockResponse);

    const client = createClient({
      baseUrl: 'https://example.com',
      kyOptions: { context: { foo: 'bar' } },
    });

    client.setConfig({
      kyOptions: { fetch: globalThis.fetch },
    });

    expect(client.getConfig().kyOptions).toEqual({
      context: { foo: 'bar' },
      fetch: globalThis.fetch,
    });

    await client.get({
      ky: mockKy as Partial<KyInstance> as KyInstance,
      url: '/test',
    });

    expect(mockKy).toHaveBeenCalledWith(
      expect.any(Request),
      expect.objectContaining({
        context: { foo: 'bar' },
        fetch: globalThis.fetch,
      }),
    );
  });
});

describe('responseStyle configuration', () => {
  const client = createClient({
    baseUrl: 'https://example.com',
    responseStyle: 'data',
  });

  it('returns only data when responseStyle is "data"', async () => {
    const mockResponse = new Response(JSON.stringify({ result: 'success' }), {
      headers: {
        'Content-Type': 'application/json',
      },
      status: 200,
    });

    const mockKy = vi.fn().mockResolvedValue(mockResponse);

    const result = await client.get({
      ky: mockKy as Partial<KyInstance> as KyInstance,
      url: '/test',
    });

    expect(result).toEqual({ result: 'success' });
    expect(result).not.toHaveProperty('response');
    expect(result).not.toHaveProperty('request');
  });

  it('returns undefined for errors when responseStyle is "data"', async () => {
    const errorResponse = new Response(JSON.stringify({ message: 'Not found' }), {
      headers: {
        'Content-Type': 'application/json',
      },
      status: 404,
    });

    const mockKy = vi.fn().mockRejectedValue(
      new HTTPError(errorResponse, new Request('https://example.com/test'), {
        method: 'GET',
      } as any),
    );

    const result = await client.get({
      ky: mockKy as Partial<KyInstance> as KyInstance,
      throwOnError: false,
      url: '/test',
    });

    expect(result).toBeUndefined();
  });
});

describe('issue #3805: custom ky instance defaults should not be overridden by undefined values', () => {
  it('custom ky instance option should not be overridden', async () => {
    // Here we create a custom ky with "credentials" and underlying "fetch" being mocked
    const mockFetch = vi.fn().mockResolvedValue(new Response());
    const customKy = ky.create({
      credentials: 'include',
      fetch: mockFetch,
    });

    const client = createClient({ baseUrl: 'https://example.com', ky: customKy });

    await client.get({
      url: '/test',
    });

    // Verify that the Request object has credentials from ky.create
    const mockFetchCall = mockFetch.mock.calls[0];
    expect(mockFetchCall).toBeDefined();
    expect(mockFetchCall![0]).toBeInstanceOf(Request);
    expect(mockFetchCall![0].credentials).toBe('include');
  });
});
