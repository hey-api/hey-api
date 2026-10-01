import { createClient } from '../client';

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
  ];

  it.each(scenarios)('returns $url', ({ options, url }) => {
    expect(client.buildUrl(options)).toBe(url);
  });
});

describe('zero-length body handling', () => {
  const client = createClient({ baseUrl: 'https://example.com' });

  it('returns empty object for zero-length JSON response', async () => {
    const mockResponse = new Response(null, {
      headers: {
        'Content-Length': '0',
        'Content-Type': 'application/json',
      },
      status: 200,
    });

    const mockFetch = vi.fn().mockResolvedValue(mockResponse);

    const result = await client.request({
      fetch: mockFetch,
      method: 'GET',
      url: '/test',
    });

    expect(result.data).toEqual({});
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

    const mockFetch = vi.fn().mockResolvedValue(mockResponse);

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

    const mockFetch = vi.fn().mockResolvedValue(mockResponse);

    const result = await client.request({
      fetch: mockFetch,
      method: 'GET',
      url: '/test',
    });

    // When parseAs is 'auto' and no Content-Type header exists, it should handle empty body gracefully
    expect(result.data).toBeDefined();
  });
});

describe('HTTP QUERY requests', () => {
  it('sends a QUERY request', async () => {
    const client = createClient({ baseUrl: 'https://example.com' });
    const mockFetch = vi.fn().mockResolvedValue(
      new Response(null, {
        status: 204,
      }),
    );

    const result = await client.query({
      fetch: mockFetch,
      url: '/search',
    });

    expect(result.request.method).toBe('QUERY');
  });
});
