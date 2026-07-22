import type { HttpClient } from '@angular/common/http';
import { HttpContext, HttpHeaders } from '@angular/common/http';

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
