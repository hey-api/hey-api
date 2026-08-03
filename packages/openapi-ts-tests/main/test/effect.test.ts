import fs from 'node:fs';

import { Context, Effect, Layer, Schema, Stream } from 'effect';
import {
  FetchHttpClient,
  HttpClient,
  HttpClientError,
  HttpClientRequest,
  HttpClientResponse,
} from 'effect/unstable/http';
import { HttpApiClient } from 'effect/unstable/httpapi';

import {
  ClientError,
  createClient as createEffectClient,
  ResponseError,
} from '../../../openapi-ts/dist/clients/effect';
import { makeClient as makeSwaggerClient } from './__snapshots__/2.0.x/plugins/@hey-api/effect/no-content/effect.gen';
import {
  Api as EdgeApi,
  makeClient as makeEdgeClient,
} from './__snapshots__/3.1.x/plugins/@hey-api/effect/effect-edge-cases/effect.gen';
import {
  ClosedIntersectionSchema,
  ClosedObjectSchema,
  ConstrainedConstSchema,
  ConstrainedEnumSchema,
  ConstrainedIntersectionSchema,
  ConstrainedUnionSchema,
  DictionaryWithPropertiesAndAdditionalPropertiesSchema,
  DictionaryWithStringSchema,
  FileResponsePathParamsSchema,
  FileSchema,
  type FilterSchema,
  ModelWithPatternSchema,
  NestedDictionarySchema,
  RecursiveBinarySchema,
  RecursiveUploadDataSchema,
  ReversedClosedIntersectionSchema,
  TimeFormatsSchema,
} from './__snapshots__/3.1.x/plugins/@hey-api/effect/effect-edge-cases/effect-schema.gen';
import { FooSchema as ConstFooSchema } from './__snapshots__/3.1.x/plugins/effect-schema/schema-const/effect-schema.gen';
import { deleteFoo } from './__snapshots__/3.1.x/plugins/effect-schema/sdk/sdk.gen';

it('keeps the standard Effect client lazy and uses the HttpClient service', async () => {
  let requests = 0;
  const httpClient = HttpClient.make((request, url) =>
    Effect.sync(() => {
      requests++;
      expect(request.headers.authorization).toBe('Bearer token');
      expect(url.toString()).toBe('https://api.example.com/pets');
      return HttpClientResponse.fromWeb(
        request,
        new Response(JSON.stringify({ id: 1 }), {
          headers: {
            'content-type': 'application/json',
          },
          status: 200,
        }),
      );
    }),
  );
  const client = createEffectClient({
    baseUrl: 'https://api.example.com',
    responseStyle: 'data',
    transformClient: HttpClient.mapRequest(HttpClientRequest.bearerToken('token')),
  });
  const program = client.get<{ 200: { id: number } }>({
    url: '/pets',
  });

  expect(requests).toBe(0);
  await expect(
    Effect.runPromise(
      program.pipe(Effect.provide(Layer.succeed(HttpClient.HttpClient, httpClient))),
    ),
  ).resolves.toEqual({ id: 1 });
  expect(requests).toBe(1);
});

it('fails standard Effect requests with tagged response and validation errors', async () => {
  const httpClient = HttpClient.make((request) =>
    Effect.succeed(
      HttpClientResponse.fromWeb(
        request,
        new Response(JSON.stringify({ message: 'missing' }), {
          headers: {
            'content-type': 'application/json',
          },
          status: 404,
        }),
      ),
    ),
  );
  const client = createEffectClient({
    baseUrl: 'https://api.example.com',
    responseStyle: 'data',
  });
  const responseError = await Effect.runPromise(
    client
      .get<never, { 404: { message: string } }>({
        url: '/missing',
      })
      .pipe(Effect.flip, Effect.provide(Layer.succeed(HttpClient.HttpClient, httpClient))),
  );
  expect(responseError).toBeInstanceOf(ResponseError);
  if (responseError instanceof ResponseError) {
    expect(responseError.data).toEqual({ message: 'missing' });
    expect(responseError.response.status).toBe(404);
  }

  const validationError = await Effect.runPromise(
    client
      .get({
        requestValidator: async () => {
          throw new Error('invalid');
        },
        url: '/never-sent',
      })
      .pipe(Effect.flip, Effect.provide(Layer.succeed(HttpClient.HttpClient, httpClient))),
  );
  expect(validationError).toBeInstanceOf(ClientError);
  if (validationError instanceof ClientError) {
    expect(validationError.stage).toBe('request');
  }
});

it('validates generated object headers before serializing them', async () => {
  let requests = 0;
  const httpClient = HttpClient.make((request) =>
    Effect.sync(() => {
      requests++;
      expect(request.headers['x-foo-bar']).toBe('{"prop":"value"}');
      return HttpClientResponse.fromWeb(request, new Response(null, { status: 204 }));
    }),
  );
  const client = createEffectClient({
    baseUrl: 'https://api.example.com',
    responseStyle: 'data',
  });
  const provideHttpClient = Effect.provide(Layer.succeed(HttpClient.HttpClient, httpClient));

  await Effect.runPromise(
    deleteFoo({
      client,
      headers: {
        'x-Foo-Bar': {
          prop: 'value',
        },
      },
      path: {
        BarParam: 'bar',
        'api-version': '1',
        foo_param: 'foo',
      },
    }).pipe(provideHttpClient),
  );

  const validationError = await Effect.runPromise(
    deleteFoo({
      client,
      headers: {
        'x-Foo-Bar': {
          // @ts-expect-error exercise runtime validation
          prop: 1,
        },
      },
      path: {
        BarParam: 'bar',
        'api-version': '1',
        foo_param: 'foo',
      },
    }).pipe(Effect.flip, provideHttpClient),
  );

  expect(validationError).toBeInstanceOf(ClientError);
  expect(requests).toBe(1);
});

it('reports request construction failures in the typed error channel', async () => {
  const httpClient = HttpClient.make(() => Effect.die('request should not execute'));
  const client = createEffectClient({
    baseUrl: 'https://api.example.com',
  });
  const provideHttpClient = Effect.provide(Layer.succeed(HttpClient.HttpClient, httpClient));

  const serializationError = await Effect.runPromise(
    client
      .get({
        query: {
          search: 'value',
        },
        querySerializer: () => {
          throw new Error('cannot serialize');
        },
        url: '/search',
      })
      .pipe(Effect.flip, provideHttpClient),
  );
  const headerError = await Effect.runPromise(
    client
      .get({
        headers: {
          '\n': 'invalid',
        },
        url: '/headers',
      })
      .pipe(Effect.flip, provideHttpClient),
  );

  expect(serializationError).toBeInstanceOf(ClientError);
  expect(headerError).toBeInstanceOf(ClientError);
  if (serializationError instanceof ClientError) {
    expect(serializationError.stage).toBe('request');
  }
  if (headerError instanceof ClientError) {
    expect(headerError.stage).toBe('request');
  }
});

it('validates string formats and URI inputs', () => {
  const decodePattern = Schema.decodeUnknownSync(ModelWithPatternSchema);
  const decodeFile = Schema.decodeUnknownSync(FileSchema);
  const decodeTimeFormats = Schema.decodeUnknownSync(TimeFormatsSchema);

  expect(() => decodePattern({ key: 'valid', modified: 'not-a-date', name: 'valid' })).toThrow();
  expect(
    decodePattern({
      key: 'valid',
      modified: '2026-07-30T12:34:56Z',
      name: 'valid',
    }).modified,
  ).toBe('2026-07-30T12:34:56Z');
  expect(() =>
    decodeFile({
      file: 'not a URI',
      mime: 'text/plain',
    }),
  ).toThrow();
  expect(
    decodeFile({
      file: 'https://example.com/file.txt',
      mime: 'text/plain',
    }).file,
  ).toBe('https://example.com/file.txt');
  expect(
    decodeTimeFormats({
      dateTime: '1990-12-31t23:59:60z',
      time: '20:20:39+00:00',
    }),
  ).toEqual({
    dateTime: '1990-12-31t23:59:60z',
    time: '20:20:39+00:00',
  });
  expect(
    decodeTimeFormats({
      dateTime: '1999-01-01T00:59:60+01:00',
      time: '22:59:60-01:00',
    }),
  ).toEqual({
    dateTime: '1999-01-01T00:59:60+01:00',
    time: '22:59:60-01:00',
  });
  expect(() =>
    decodeTimeFormats({
      dateTime: '2026-07-30T20:20:39Z',
      time: '20:20',
    }),
  ).toThrow();
  expect(() =>
    decodeTimeFormats({
      dateTime: '2026-07-30T20:20:39',
      time: '20:20:39Z',
    }),
  ).toThrow();
  expect(() =>
    decodeTimeFormats({
      dateTime: '1990-12-31T22:59:60Z',
      time: '23:59:60Z',
    }),
  ).toThrow();
  expect(() =>
    decodeTimeFormats({
      dateTime: '1990-12-31T23:59:60Z',
      time: '23:58:60Z',
    }),
  ).toThrow();
  expect(() =>
    decodeTimeFormats({
      dateTime: '1990-07-31T23:59:60Z',
      time: '23:59:60Z',
    }),
  ).toThrow();
});

it('exposes server-sent events as an Effect Stream', async () => {
  const httpClient = HttpClient.make((request) =>
    Effect.succeed(
      HttpClientResponse.fromWeb(
        request,
        new Response('data: {"id":1}\n\ndata: {"id":2}\n\n', {
          headers: {
            'content-type': 'text/event-stream',
          },
          status: 200,
        }),
      ),
    ),
  );
  const client = createEffectClient({
    baseUrl: 'https://api.example.com',
  });
  const events = await Effect.runPromise(
    Stream.runCollect(
      client.sse.get<{ 200: { id: number } }>({
        url: '/events',
      }),
    ).pipe(Effect.provide(Layer.succeed(HttpClient.HttpClient, httpClient))),
  );

  expect(Array.from(events)).toEqual([{ id: 1 }, { id: 2 }]);
});

it('supports the documented authenticated and custom client layers', () => {
  class GeneratedClient extends Context.Service<
    GeneratedClient,
    Effect.Success<ReturnType<typeof makeEdgeClient>>
  >()('GeneratedClient') {}

  const customHttpClient = Layer.effect(HttpClient.HttpClient)(
    Effect.map(HttpClient.HttpClient, (client) =>
      HttpClient.mapRequest(client, HttpClientRequest.setHeader('X-Client-Version', '1')),
    ),
  ).pipe(Layer.provide(FetchHttpClient.layer));

  const layer = Layer.effect(GeneratedClient)(
    makeEdgeClient({
      baseUrl: 'https://api.example.com',
      transformClient: HttpClient.mapRequest(HttpClientRequest.bearerToken('token')),
    }),
  ).pipe(Layer.provide(customHttpClient));

  const classifyError = (error: unknown) =>
    Schema.isSchemaError(error)
      ? 'schema'
      : HttpClientError.isHttpClientError(error)
        ? 'http'
        : 'declared';

  expect(layer).toBeDefined();
  expect(classifyError(new Error())).toBe('declared');
  expect(
    Effect.runSync(
      Schema.decodeUnknownEffect(DictionaryWithStringSchema)({
        validated: 'value',
      }),
    ),
  ).toEqual({ validated: 'value' });

  const buildUrl = HttpApiClient.urlBuilder(EdgeApi, {
    baseUrl: 'https://api.example.com',
  });
  expect(buildUrl.default_2.untagged()).toBe('https://api.example.com/untagged');
});

it('executes a generated Effect client request with aliased path parameters', async () => {
  const events: Array<string> = [];
  const httpClient = HttpClient.make((request, url) =>
    Effect.sync(() => {
      expect(request.method).toBe('GET');
      expect(request.headers['x-client-version']).toBe('1');
      expect(url.toString()).toBe('https://api.example.com/api/v1/file/example');
      return HttpClientResponse.fromWeb(
        request,
        new Response(new Uint8Array([1, 2, 3]), {
          headers: {
            'content-type': 'audio/mpeg',
          },
          status: 200,
        }),
      );
    }),
  );
  const result = await Effect.runPromise(
    Effect.gen(function* () {
      const client = yield* makeEdgeClient({
        baseUrl: 'https://api.example.com',
        transformClient: (client) =>
          client.pipe(
            HttpClient.mapRequest(HttpClientRequest.setHeader('X-Client-Version', '1')),
            HttpClient.tapRequest((request) =>
              Effect.sync(() => {
                events.push(`request:${request.method}`);
              }),
            ),
            HttpClient.tap((response) =>
              Effect.sync(() => {
                events.push(`response:${response.status}`);
              }),
            ),
          ),
        transformResponse: Effect.tap(() =>
          Effect.sync(() => {
            events.push('decoded');
          }),
        ),
      });
      return yield* client.files.fileResponse({
        params: {
          api_version: '1',
          id: 'example',
        },
      });
    }).pipe(Effect.provide(Layer.succeed(HttpClient.HttpClient, httpClient))),
  );

  expect(result).toEqual(new Uint8Array([1, 2, 3]));
  expect(events).toEqual(['request:GET', 'response:200', 'decoded']);
});

it('keeps named fields separate from additional properties', () => {
  const decode = Schema.decodeUnknownSync(DictionaryWithPropertiesAndAdditionalPropertiesSchema);
  const dictionary = Schema.decodeUnknownSync(DictionaryWithStringSchema)({ extra: 'value' });
  const dictionaryValue: string | undefined = dictionary.extra;
  const mixedDictionary = decode({ bar: true, extra: 'value', foo: 1 });
  const mixedDictionaryValue: string | undefined = mixedDictionary.extra;

  expect(dictionaryValue).toBe('value');
  expect(mixedDictionaryValue).toBe('value');
  expect(mixedDictionary).toEqual({
    bar: true,
    extra: 'value',
    foo: 1,
  });
  expect(() => decode({ bar: true, extra: 1, foo: 1 })).toThrow();
  expect(
    Schema.decodeUnknownSync(FileResponsePathParamsSchema)({
      api_version: '1',
      extra: 'nope',
      id: 'example',
    }),
  ).toEqual({
    api_version: '1',
    id: 'example',
  });

  const acceptsFileParams = (
    _params: Schema.Schema.Type<typeof FileResponsePathParamsSchema>,
  ) => {};
  acceptsFileParams({ api_version: '1', id: 'example' });
  // @ts-expect-error closed request objects reject excess keys
  acceptsFileParams({ api_version: '1', extra: 'nope', id: 'example' });

  const acceptsFilter = (_filter: Schema.Schema.Type<typeof FilterSchema>) => {};
  acceptsFilter({ role: 'admin' });
  // @ts-expect-error open objects do not gain a blanket index signature
  acceptsFilter({ rolle: 'admin' });
});

it('preserves exact object constants', () => {
  expect(
    Schema.decodeUnknownSync(ConstFooSchema)({
      corge: { bar: true, baz: 'grault', extra: false, foo: 1 },
    }),
  ).toEqual({
    corge: { bar: true, baz: 'grault', foo: 1 },
  });
});

it('treats Swagger responses without bodies as empty', async () => {
  const httpClient = HttpClient.make((request) =>
    Effect.succeed(HttpClientResponse.fromWeb(request, new Response(null, { status: 204 }))),
  );
  const result = await Effect.runPromise(
    Effect.gen(function* () {
      const client = yield* makeSwaggerClient({
        baseUrl: 'https://api.example.com',
      });
      return yield* client.NoContent.callWithNoContentResponse();
    }).pipe(Effect.provide(Layer.succeed(HttpClient.HttpClient, httpClient))),
  );

  expect(result).toBeUndefined();
});

it('supports TRACE and keeps tagged and untagged operation namespaces separate', async () => {
  const httpClient = HttpClient.make((request, url) =>
    Effect.sync(() => {
      switch (url.pathname) {
        case '/literal:colon/value%3Apart':
        case '/literal:colon/value:part':
        case '/literal:colon/literal%253apercent':
          expect(request.method).toBe('GET');
          return HttpClientResponse.fromWeb(request, new Response(null, { status: 204 }));
        case '/multipart-response':
          expect(request.method).toBe('GET');
          return HttpClientResponse.fromWeb(
            request,
            new Response(new Uint8Array([1, 2, 3]), {
              headers: {
                'content-type': 'multipart/form-data',
              },
              status: 200,
            }),
          );
        case '/image':
          expect(request.method).toBe('GET');
          return HttpClientResponse.fromWeb(
            request,
            new Response(new Uint8Array([4, 5, 6]), {
              headers: {
                'content-type': 'image/png',
              },
              status: 200,
            }),
          );
        case '/text':
          expect(request.method).toBe('GET');
          return HttpClientResponse.fromWeb(
            request,
            new Response('hello', {
              headers: {
                'content-type': 'text/plain',
              },
              status: 200,
            }),
          );
        case '/trace':
          expect(request.method).toBe('TRACE');
          return HttpClientResponse.fromWeb(request, new Response(null, { status: 204 }));
        default:
          throw new Error(`Unexpected URL: ${url.toString()}`);
      }
    }),
  );
  const result = await Effect.runPromise(
    Effect.gen(function* () {
      const client = yield* makeEdgeClient({
        baseUrl: 'https://api.example.com',
      });

      expect(typeof client.default_2.untagged).toBe('function');
      expect(typeof client.default_2.then_).toBe('function');
      expect(
        yield* Effect.promise(() => Promise.resolve(client.default_2)).pipe(
          Effect.timeout('200 millis'),
        ),
      ).toBe(client.default_2);
      expect(typeof client.default.taggedDefault).toBe('function');
      expect(typeof client.untagged.taggedCollision).toBe('function');
      expect(typeof client.petStore.constructor_).toBe('function');
      expect(typeof client.petStore.proto).toBe('function');
      expect(yield* client.default_2.colonPath({ params: { id: 'value:part' } })).toBeUndefined();
      expect(
        yield* client.default_2.colonPath({ params: { id: 'literal%3apercent' } }),
      ).toBeUndefined();
      expect(yield* client.binary.imageResponse()).toEqual(new Uint8Array([4, 5, 6]));
      expect(yield* client.multipart.multipartResponse()).toEqual(new Uint8Array([1, 2, 3]));
      expect(yield* client.text.textResponse()).toBe('hello');
      return yield* client.trace.traceRequest();
    }).pipe(Effect.provide(Layer.succeed(HttpClient.HttpClient, httpClient))),
  );

  expect(result).toBeUndefined();
});

it('keeps deeply nested dictionary output linear', () => {
  const decodeClosed = Schema.decodeUnknownSync(ClosedObjectSchema);
  const decode = Schema.decodeUnknownSync(NestedDictionarySchema);
  const value = {
    one: {
      two: {
        three: {
          four: {
            five: {
              six: {
                seven: {
                  eight: 'value',
                },
              },
            },
          },
        },
      },
    },
  };
  const source = fs.readFileSync(
    new URL(
      './__snapshots__/3.1.x/plugins/@hey-api/effect/effect-edge-cases/effect-schema.gen.ts',
      import.meta.url,
    ),
    'utf8',
  );
  const dictionaryStart = source.indexOf('export const NestedDictionarySchema');
  const dictionaryEnd = source.indexOf('\n\n', dictionaryStart);

  expect(decodeClosed({ known: 'value' })).toEqual({ known: 'value' });
  expect(decodeClosed({ extra: true, known: 'value' })).toEqual({ known: 'value' });
  expect(Schema.decodeUnknownSync(ClosedIntersectionSchema)({ a: 'a', b: 'b' })).toEqual({
    a: 'a',
    b: 'b',
  });
  expect(decode(value)).toEqual(value);
  expect(dictionaryStart).toBeGreaterThan(-1);
  expect(dictionaryEnd).toBeGreaterThan(dictionaryStart);
  expect(source.slice(dictionaryStart, dictionaryEnd).length).toBeLessThan(1_000);

  const acceptsClosed = (_value: Schema.Schema.Type<typeof ClosedObjectSchema>) => {};
  acceptsClosed({ known: 'value' });
  // @ts-expect-error closed component schemas reject excess keys
  acceptsClosed({ extra: true, known: 'value' });
});

it('keeps recursive binary and composed schema types aligned with runtime validation', () => {
  const recursive: Schema.Schema.Type<typeof RecursiveBinarySchema> = {
    file: new Uint8Array([1]),
    next: {
      file: new Uint8Array([2]),
    },
  };
  expect(Schema.decodeUnknownSync(RecursiveBinarySchema)(recursive)).toEqual(recursive);

  const file = new Blob(['content']);
  const recursiveUpload: Schema.Schema.Type<typeof RecursiveUploadDataSchema> = {
    body: {
      file,
      next: {
        file,
      },
    },
  };
  expect(Schema.decodeUnknownSync(RecursiveUploadDataSchema)(recursiveUpload)).toEqual(
    recursiveUpload,
  );
  const acceptsRecursiveUpload = (
    _value: Schema.Schema.Type<typeof RecursiveUploadDataSchema>,
  ) => {};
  // @ts-expect-error recursive request file inputs remain Blob | File, not any
  acceptsRecursiveUpload({ body: { file: 1 } });
  expect(() =>
    Schema.decodeUnknownSync(RecursiveUploadDataSchema)({ body: { file: 1 } }),
  ).toThrow();

  const decodeReversed = Schema.decodeUnknownSync(ReversedClosedIntersectionSchema);
  expect(decodeReversed({ a: 'value' })).toEqual({ a: 'value' });
  expect(decodeReversed({ a: 'value', extra: true })).toEqual({ a: 'value' });

  const acceptsReversed = (
    _value: Schema.Schema.Type<typeof ReversedClosedIntersectionSchema>,
  ) => {};
  acceptsReversed({ a: 'value' });
  // @ts-expect-error the closed allOf member requires a
  acceptsReversed({});
  // @ts-expect-error the closed allOf member rejects excess keys
  acceptsReversed({ a: 'value', extra: true });

  expect(() => Schema.decodeUnknownSync(ConstrainedUnionSchema)('x')).toThrow();
  expect(Schema.decodeUnknownSync(ConstrainedUnionSchema)('long')).toBe('long');
  expect(() => Schema.decodeUnknownSync(ConstrainedConstSchema)('x')).toThrow();
  expect(() => Schema.decodeUnknownSync(ConstrainedEnumSchema)('x')).toThrow();
  expect(Schema.decodeUnknownSync(ConstrainedEnumSchema)('long')).toBe('long');
  expect(() => Schema.decodeUnknownSync(ConstrainedIntersectionSchema)('bb')).toThrow();
  expect(Schema.decodeUnknownSync(ConstrainedIntersectionSchema)('ab')).toBe('ab');
});
