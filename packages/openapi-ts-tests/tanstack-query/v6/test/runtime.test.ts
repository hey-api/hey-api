import { QueryClient } from '@tanstack/solid-query';

import {
  addPetMutation as addPetAxiosMutation,
  getPetOptions as getPetAxiosOptions,
} from '../__snapshots__/axios/@tanstack/solid-query.gen';
import { createClient as createAxiosClient } from '../__snapshots__/axios/client';
import {
  addPetMutation,
  getPetGetQueryData,
  getPetOptions,
  getPetSetQueryData,
  listPetsInfiniteOptions,
} from '../__snapshots__/fetch/@tanstack/solid-query.gen';
import { createClient } from '../__snapshots__/fetch/client';

const pet = { id: 1, name: 'Milo' };

describe('Solid Query v6 runtime', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
  });

  afterEach(() => {
    queryClient.clear();
  });

  it('fetches and updates typed cache entries with a custom Fetch client', async () => {
    const fetch = vi.fn<typeof globalThis.fetch>().mockResolvedValue(Response.json(pet));
    const client = createClient({ baseUrl: 'https://example.com', fetch });
    const options = { client, path: { petId: 1 } };

    expect(getPetGetQueryData(queryClient, options)).toBeUndefined();
    await expect(queryClient.fetchQuery(getPetOptions(options))).resolves.toEqual(pet);
    expect(getPetGetQueryData(queryClient, options)).toEqual(pet);
    expect(queryClient.getQueryState(getPetOptions(options).queryKey)?.data).toEqual(pet);
    const request = fetch.mock.calls[0]![0] as Request;
    expect(request.url).toBe('https://example.com/pets/1');

    getPetSetQueryData(queryClient, options, (previous) => ({ ...previous!, name: 'Luna' }));
    expect(getPetGetQueryData(queryClient, options)).toEqual({ ...pet, name: 'Luna' });
    expect(getPetOptions(options).meta).toEqual({ operationId: 'getPet' });
    expect(getPetOptions(options).queryKey[0].tags).toEqual(['pets']);
  });

  it('merges scalar and object page parameters with the original query', async () => {
    const fetch = vi
      .fn<typeof globalThis.fetch>()
      .mockImplementation(async () => Response.json([pet]));
    const client = createClient({ baseUrl: 'https://example.com', fetch });
    const options = listPetsInfiniteOptions({ client, query: { limit: 10 } });

    const data = await queryClient.fetchInfiniteQuery({
      ...options,
      getNextPageParam: () => ({ query: { page: 2 } }),
      initialPageParam: 1,
      pages: 2,
    });

    expect(data.pages).toEqual([[pet], [pet]]);
    expect(fetch.mock.calls.map(([request]) => (request as Request).url)).toEqual([
      'https://example.com/pets?limit=10&page=1',
      'https://example.com/pets?limit=10&page=2',
    ]);
    expect(options.queryKey[0]._infinite).toBe(true);
    expect(options.meta).toEqual({ operationId: 'listPets' });
  });

  it('executes mutation options and forwards variables', async () => {
    const fetch = vi.fn<typeof globalThis.fetch>().mockResolvedValue(Response.json(pet));
    const client = createClient({ baseUrl: 'https://example.com', fetch });
    const options = addPetMutation({ client });
    const mutation = queryClient.getMutationCache().build(queryClient, options);

    await expect(mutation.execute({ body: pet })).resolves.toEqual(pet);
    const request = fetch.mock.calls[0]![0] as Request;
    expect(request.method).toBe('POST');
    await expect(request.json()).resolves.toEqual(pet);
    expect(options.mutationKey).toEqual([
      { _id: 'addPet', baseUrl: 'https://example.com', tags: ['pets'] },
    ]);
    expect(options.meta).toEqual({ operationId: 'addPet' });
  });

  it('propagates API errors to the query cache', async () => {
    const error = { message: 'Pet not found' };
    const fetch = vi
      .fn<typeof globalThis.fetch>()
      .mockResolvedValue(Response.json(error, { status: 404 }));
    const client = createClient({ baseUrl: 'https://example.com', fetch });
    const options = getPetOptions({ client, path: { petId: 1 } });

    await expect(queryClient.fetchQuery(options)).rejects.toEqual(error);
    expect(queryClient.getQueryState(options.queryKey)?.error).toEqual(error);
  });

  it('forwards cancellation to the Fetch request', async () => {
    let signal: AbortSignal | undefined;
    const fetch = vi.fn<typeof globalThis.fetch>().mockImplementation((input) => {
      signal = (input as Request).signal;
      return new Promise((_resolve, reject) => {
        signal!.addEventListener('abort', () => reject(signal!.reason), { once: true });
      });
    });
    const client = createClient({ baseUrl: 'https://example.com', fetch });
    const options = getPetOptions({ client, path: { petId: 1 } });
    const result = queryClient.fetchQuery(options);
    const rejection = expect(result).rejects.toThrow();

    await vi.waitFor(() => expect(fetch).toHaveBeenCalledOnce());
    await queryClient.cancelQueries({ queryKey: options.queryKey });
    await rejection;
    expect(signal?.aborted).toBe(true);
  });

  it('fetches and mutates with a custom Axios client', async () => {
    const adapter = vi.fn().mockImplementation(async (config) => ({
      config,
      data: pet,
      headers: {},
      status: 200,
      statusText: 'OK',
    }));
    const client = createAxiosClient({ adapter, baseURL: 'https://example.com' });

    await expect(
      queryClient.fetchQuery(getPetAxiosOptions({ client, path: { petId: 1 } })),
    ).resolves.toEqual(pet);
    const mutation = queryClient
      .getMutationCache()
      .build(queryClient, addPetAxiosMutation({ client }));
    await expect(mutation.execute({ body: pet })).resolves.toEqual(pet);
    expect(adapter).toHaveBeenCalledTimes(2);
  });
});
