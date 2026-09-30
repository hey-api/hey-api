import { QueryClient, useInfiniteQuery, useMutation, useQuery } from '@tanstack/solid-query';
import type { AxiosError } from 'axios';
import { createSignal } from 'solid-js';
import { expectTypeOf, it } from 'vitest';

import {
  addPetMutation as addPetAxiosMutation,
  getPetOptions as getPetAxiosOptions,
  listPetsInfiniteOptions as listPetsAxiosInfiniteOptions,
} from '../__snapshots__/axios/@tanstack/solid-query.gen';
import {
  addPetMutation,
  getPetGetQueryData,
  getPetOptions,
  getPetSetQueryData,
  listPetsInfiniteOptions,
  listPetsOptions,
} from '../__snapshots__/fetch/@tanstack/solid-query.gen';
import type { Options } from '../__snapshots__/fetch/sdk.gen';
import type { AddPetData, ApiError, Pet } from '../__snapshots__/fetch/types.gen';

it('infers Solid 2 query data, errors, and selected data through an accessor', () => {
  const [petId] = createSignal(1);
  const query = useQuery(() => getPetOptions({ path: { petId: petId() } }));
  // Solid Query v6 suspends pending data reads instead of returning undefined.
  expectTypeOf(query.data).toEqualTypeOf<Pet>();
  expectTypeOf(query.error).toEqualTypeOf<ApiError | null>();
  expectTypeOf(query.isPending).toEqualTypeOf<boolean>();

  const selected = useQuery(() => ({
    ...listPetsOptions(),
    select: (pets) => pets.map((pet) => pet.name),
  }));
  expectTypeOf(selected.data).toEqualTypeOf<Array<string>>();

  const axiosQuery = useQuery(() => getPetAxiosOptions({ path: { petId: petId() } }));
  expectTypeOf(axiosQuery.data).toEqualTypeOf<Pet>();
  expectTypeOf(axiosQuery.error).toEqualTypeOf<AxiosError<ApiError> | null>();

  // @ts-expect-error A required path parameter cannot be omitted.
  getPetOptions();
  // @ts-expect-error The generated request preserves the parameter type.
  getPetOptions({ path: { petId: '1' } });
});

it('infers infinite query pages without requiring initialData', () => {
  const query = useInfiniteQuery(() => ({
    ...listPetsInfiniteOptions({ query: { limit: 10 } }),
    getNextPageParam: (_lastPage, pages) => pages.length + 1,
    initialPageParam: 1,
  }));
  expectTypeOf(query.data.pages).toEqualTypeOf<Array<Array<Pet>>>();
  expectTypeOf(query.isPending).toEqualTypeOf<boolean>();

  const axiosQuery = useInfiniteQuery(() => ({
    ...listPetsAxiosInfiniteOptions(),
    getNextPageParam: () => undefined,
    initialPageParam: { query: { page: 1 } },
  }));
  expectTypeOf(axiosQuery.data.pages).toEqualTypeOf<Array<Array<Pet>>>();
});

it('infers mutation variables and callbacks', () => {
  const mutation = useMutation(() => ({
    ...addPetMutation(),
    onSuccess: (data, variables) => {
      expectTypeOf(data).toEqualTypeOf<Pet>();
      expectTypeOf(variables).toEqualTypeOf<Options<AddPetData>>();
    },
  }));
  expectTypeOf(mutation.error).toEqualTypeOf<ApiError | null>();
  mutation.mutate({ body: { id: 1, name: 'Milo' } });
  // @ts-expect-error A mutation requires a request body.
  mutation.mutate({});

  const axiosMutation = useMutation(() => addPetAxiosMutation());
  expectTypeOf(axiosMutation.error).toEqualTypeOf<AxiosError<ApiError> | null>();
});

it('preserves query client and cache helper types', () => {
  const client = new QueryClient();
  const options = { path: { petId: 1 } };
  expectTypeOf(client.fetchQuery(getPetOptions(options))).toEqualTypeOf<Promise<Pet>>();
  expectTypeOf(client.getQueryData(getPetOptions(options).queryKey)).toEqualTypeOf<
    Pet | undefined
  >();
  expectTypeOf(getPetGetQueryData(client, options)).toEqualTypeOf<Pet | undefined>();
  getPetSetQueryData(client, options, (previous) => {
    expectTypeOf(previous).toEqualTypeOf<Pet | undefined>();
    return { id: 1, name: 'Milo' };
  });
  // @ts-expect-error Cache updates must match the response schema.
  getPetSetQueryData(client, options, { id: '1', name: 'Milo' });
});
