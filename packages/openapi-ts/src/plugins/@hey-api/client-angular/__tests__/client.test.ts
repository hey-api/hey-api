import type { HttpClient } from '@angular/common/http';
import { HttpContext, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { createClient } from '../bundle/client';

describe('AbortSignal', () => {
  it('does not start an HTTP request when the signal is already aborted', async () => {
    const controller = new AbortController();
    const reason = new DOMException('The operation was aborted', 'AbortError');
    const transformedError = { message: 'Request was aborted', type: 'abort' };
    controller.abort(reason);
    const request = vi.fn();
    const errorInterceptor = vi.fn(() => transformedError);
    const client = createClient({
      baseUrl: 'https://example.com',
      httpClient: { request } as unknown as HttpClient,
      signal: controller.signal,
    });
    client.interceptors.error.use(errorInterceptor);

    const result = await client.get({ url: '/test' });

    expect(request).not.toHaveBeenCalled();
    expect(errorInterceptor).toHaveBeenCalledWith(
      reason,
      undefined,
      expect.anything(),
      expect.objectContaining({ url: '/test' }),
    );
    expect(result).toMatchObject({ error: transformedError });
  });

  it('unsubscribes from an in-flight HTTP request when the signal is aborted', async () => {
    const controller = new AbortController();
    const reason = new DOMException('The operation was aborted', 'AbortError');
    const subscribed = vi.fn();
    const teardown = vi.fn();
    const request = vi.fn(
      () =>
        new Observable(() => {
          subscribed();
          return teardown;
        }),
    );
    const client = createClient({ baseUrl: 'https://example.com' });

    const result = client.get({
      httpClient: { request } as unknown as HttpClient,
      signal: controller.signal,
      throwOnError: true,
      url: '/test',
    });
    await vi.waitFor(() => expect(subscribed).toHaveBeenCalledOnce());

    controller.abort(reason);

    await expect(result).rejects.toBe(reason);
    expect(teardown).toHaveBeenCalledOnce();
  });

  it('preserves a regular HTTP error when the signal is not aborted', async () => {
    const controller = new AbortController();
    const error = { message: 'Request failed', type: 'http' };
    const response = new HttpErrorResponse({ error, status: 500 });
    const teardown = vi.fn();
    const request = vi.fn(
      () =>
        new Observable((subscriber) => {
          subscriber.error(response);
          return teardown;
        }),
    );
    const errorInterceptor = vi.fn(() => ({ message: 'Transformed request error', type: 'http' }));
    const client = createClient({ baseUrl: 'https://example.com' });
    client.interceptors.error.use(errorInterceptor);

    const result = client.get({
      httpClient: { request } as unknown as HttpClient,
      signal: controller.signal,
      throwOnError: true,
      url: '/test',
    });

    await expect(result).rejects.toEqual({ message: 'Transformed request error', type: 'http' });
    expect(controller.signal.aborted).toBe(false);
    expect(errorInterceptor).toHaveBeenCalledWith(
      error,
      response,
      expect.anything(),
      expect.objectContaining({ url: '/test' }),
    );
    expect(teardown).toHaveBeenCalledOnce();
  });

  it('does not react when the signal is aborted after a successful response', async () => {
    const controller = new AbortController();
    const errorInterceptor = vi.fn((error) => error);
    const request = vi.fn(() => of(new HttpResponse({ body: { success: true } })));
    const client = createClient({ baseUrl: 'https://example.com' });
    client.interceptors.error.use(errorInterceptor);

    const result = await client.get({
      httpClient: { request } as unknown as HttpClient,
      signal: controller.signal,
      throwOnError: true,
      url: '/test',
    });
    controller.abort();

    expect(result.data).toEqual({ success: true });
    expect(errorInterceptor).not.toHaveBeenCalled();
  });
});

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

describe('unserialized request body handling', () => {
  const client = createClient({ baseUrl: 'https://example.com' });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const scenarios = [{ body: 0 }, { body: false }, { body: 'test string' }, { body: '' }];

  it.each(scenarios)('handles plain text body with $body value', async ({ body }) => {
    const spy = vi.spyOn(HttpHeaders.prototype, 'delete');

    const request = client.requestOptions({
      body,
      bodySerializer: null,
      httpClient: vi.fn() as Partial<HttpClient> as HttpClient,
      url: '/test',
    });

    expect(request).toMatchObject(
      expect.objectContaining({
        body,
      }),
    );

    expect(spy).toHaveBeenCalledTimes(0);
  });
});

describe('context', () => {
  const client = createClient({ baseUrl: 'https://example.com' });

  it('forwards a provided HttpContext to the resulting HttpRequest', () => {
    const context = new HttpContext();

    const request = client.requestOptions({
      context,
      httpClient: vi.fn() as Partial<HttpClient> as HttpClient,
      url: '/test',
    });

    expect(request.context).toBe(context);
  });
});

describe('requestOptions serialized request body handling', () => {
  const client = createClient({ baseUrl: 'https://example.com' });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const scenarios = [
    {
      body: '',
      expectBodyValue: false,
      expectDeleteHeader: 1,
      serializedBody: '',
    },
    {
      body: 0,
      expectBodyValue: true,
      expectDeleteHeader: 0,
      serializedBody: 0,
    },
    {
      body: false,
      expectBodyValue: true,
      expectDeleteHeader: 0,
      serializedBody: false,
    },
    {
      body: {},
      expectBodyValue: true,
      expectDeleteHeader: 0,
      serializedBody: '{"key":"value"}',
    },
  ];

  it.each(scenarios)(
    'handles $serializedBody serializedBody value',
    async ({ body, expectBodyValue, expectDeleteHeader, serializedBody }) => {
      const spy = vi.spyOn(HttpHeaders.prototype, 'delete');

      const request = client.requestOptions({
        body,
        bodySerializer: () => serializedBody,
        httpClient: vi.fn() as Partial<HttpClient> as HttpClient,
        url: '/test',
      });

      expect(request).toMatchObject(
        expect.objectContaining({
          body: expectBodyValue ? serializedBody : null,
        }),
      );

      expect(spy).toHaveBeenCalledTimes(expectDeleteHeader);
    },
  );
});
