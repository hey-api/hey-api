import { getValidRequestBody, toRequestInit } from '../../client-core/bundle/utils';

describe('getValidRequestBody', () => {
  const noBodySerializer = [
    { body: '' },
    { body: 0 },
    { body: false },
    { body: 'test string' },
    { body: null },
    { body: undefined },
  ].map(({ body }) => ({
    expectedBody: body,
    options: { body, bodySerializer: null, serializedBody: 'ignore' },
  }));

  const hasBodySerializer = [
    { body: '', expectedBody: null },
    { body: 0, expectedBody: 0 },
    { body: false, expectedBody: false },
    { body: '{"key":"value"}', expectedBody: '{"key":"value"}' },
    { body: null, expectedBody: null },
    { body: undefined, expectedBody: undefined },
  ].map(({ body, expectedBody }) => ({
    expectedBody,
    options: { body, bodySerializer: () => {} },
  }));

  const hasBodySerializerAndSerializedBodyProperty = [
    { body: '', expectedBody: null, serializedBody: '' },
    { body: 0, expectedBody: 0, serializedBody: 0 },
    { body: false, expectedBody: false, serializedBody: false },
    {
      body: {},
      expectedBody: '{"key":"value"}',
      serializedBody: '{"key":"value"}',
    },
    { body: null, expectedBody: 'foo', serializedBody: 'foo' },
    { body: undefined, expectedBody: undefined, serializedBody: undefined },
  ].map(({ body, expectedBody, serializedBody }) => ({
    expectedBody,
    options: { body, bodySerializer: () => {}, serializedBody },
  }));

  it.each(noBodySerializer)(
    'returns $expectedBody when unserialized body value is $options.body',
    ({ expectedBody, options }) => {
      expect(getValidRequestBody(options)).toBe(expectedBody);
    },
  );

  it.each(hasBodySerializer)(
    'evaluates body and returns $expectedBody when serialized value is $options.body',
    ({ expectedBody, options }) => {
      expect(getValidRequestBody(options)).toBe(expectedBody);
    },
  );

  it.each(hasBodySerializerAndSerializedBodyProperty)(
    'evaluates serializedBody and returns $expectedBody when value is $options.serializedBody',
    ({ expectedBody, options }) => {
      expect(getValidRequestBody(options)).toBe(expectedBody);
    },
  );
});

describe('toRequestInit', () => {
  it('keeps standard RequestInit fields', () => {
    const signal = new AbortController().signal;
    const headers = new Headers({ 'content-type': 'application/json' });
    const init = toRequestInit({
      body: '{"a":1}',
      headers,
      method: 'POST',
      redirect: 'follow',
      signal,
    });
    expect(init).toEqual({
      body: '{"a":1}',
      headers,
      method: 'POST',
      redirect: 'follow',
      signal,
    });
  });

  it('drops non-standard keys that break Deno and Bun', () => {
    const init = toRequestInit({
      baseUrl: 'http://localhost',
      bodySerializer: () => {},
      client: {},
      fetch: globalThis.fetch,
      method: 'GET',
      parseAs: 'json',
      path: {},
      querySerializer: () => {},
      requestValidator: () => {},
      responseValidator: () => {},
      serializedBody: 'x',
      throwOnError: true,
      url: '/anything',
    });
    expect(init).toEqual({ method: 'GET' });
    expect(Object.keys(init)).not.toContain('client');
  });

  it('omits keys whose value is undefined', () => {
    const init = toRequestInit({ body: undefined, method: 'GET' });
    expect(Object.keys(init)).toEqual(['method']);
  });

  it('constructs a valid Request when a runtime rejects non-standard init (Deno/Bun)', () => {
    const NativeRequest = globalThis.Request;
    class StrictRequest extends NativeRequest {
      constructor(input: RequestInfo | URL, init?: RequestInit) {
        if (init && 'client' in init) {
          throw new TypeError(
            "Failed to construct 'Request': Argument 2 `client` must be a Deno.HttpClient",
          );
        }
        super(input, init);
      }
    }
    globalThis.Request = StrictRequest as unknown as typeof Request;
    try {
      const leaky = {
        client: {},
        fetch: globalThis.fetch,
        headers: new Headers(),
        method: 'GET',
      };
      expect(() => new Request('http://localhost/anything', toRequestInit(leaky))).not.toThrow();
    } finally {
      globalThis.Request = NativeRequest;
    }
  });
});
