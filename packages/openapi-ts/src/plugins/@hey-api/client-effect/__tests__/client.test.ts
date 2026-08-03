import { Effect, Layer } from 'effect';
import { HttpClient, HttpClientResponse } from 'effect/unstable/http';

import { createClient } from '../bundle/client';

it('auto-parses binary responses as Blob', async () => {
  const httpClient = HttpClient.make((request) =>
    Effect.succeed(
      HttpClientResponse.fromWeb(
        request,
        new Response(new Uint8Array([1, 2, 3]), {
          headers: {
            'content-type': 'image/png',
          },
          status: 200,
        }),
      ),
    ),
  );
  const client = createClient({
    baseUrl: 'https://api.example.com',
    responseStyle: 'data',
  });

  const data = await Effect.runPromise(
    client
      .get<Blob, never, 'data'>({
        responseStyle: 'data',
        url: '/image',
      })
      .pipe(Effect.provide(Layer.succeed(HttpClient.HttpClient, httpClient))),
  );

  expect(data).toBeInstanceOf(Blob);
  await expect((data as Blob).arrayBuffer()).resolves.toEqual(new Uint8Array([1, 2, 3]).buffer);
});

it('runs JSON response handlers for unrecognised content types', async () => {
  const calls: Array<string> = [];
  const httpClient = HttpClient.make((request) =>
    Effect.succeed(
      HttpClientResponse.fromWeb(
        request,
        new Response(JSON.stringify({ value: 1 }), {
          headers: {
            'content-type': 'foo/bar',
          },
          status: 200,
        }),
      ),
    ),
  );
  const client = createClient({
    baseUrl: 'https://api.example.com',
    responseStyle: 'data',
  });

  const data = await Effect.runPromise(
    client
      .get<{ 200: { value: number } }, never, 'data'>({
        responseStyle: 'data',
        responseTransformer: async (value) => {
          calls.push('transformer');
          return { value: (value as { value: number }).value + 1 };
        },
        responseValidator: async () => {
          calls.push('validator');
        },
        url: '/json',
      })
      .pipe(Effect.provide(Layer.succeed(HttpClient.HttpClient, httpClient))),
  );

  expect(calls).toEqual(['validator', 'transformer']);
  expect(data).toEqual({ value: 2 });
});
