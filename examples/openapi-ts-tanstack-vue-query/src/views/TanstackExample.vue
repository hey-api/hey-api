<script lang="ts" setup>
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { computed, ref, watch } from 'vue';

import type { Pet } from '@/client';
import {
  addPetMutation,
  getPetByIdOptions,
  updatePetMutation,
} from '@/client/@tanstack/vue-query.gen';
import type { RequestOptions } from '@/client/client';
import { createClient } from '@/client/client';
import { PetSchema } from '@/client/schemas.gen';

const queryClient = useQueryClient();

const localClient = createClient({
  // set default base url for requests made by this client
  baseUrl: 'https://petstore3.swagger.io/api/v3',
  /**
   * Set default headers only for requests made by this client. This is to
   * demonstrate local clients and their configuration taking precedence over
   * internal service client.
   */
  headers: {
    Authorization: 'Bearer <token_from_local_client>',
  },
});

localClient.interceptors.request.use((request: Request, options: RequestOptions) => {
  // Middleware is great for adding authorization tokens to requests made to
  // protected paths. Headers are set randomly here to allow surfacing the
  // default headers, too.
  if (options.url === '/pet/{petId}' && options.method === 'GET' && Math.random() < 0.5) {
    request.headers.set('Authorization', 'Bearer <token_from_interceptor>');
  }
  return request;
});

const pet = ref<Pet>();
const petId = ref<number>();

const petInput = ref({ category: '', name: '' });

const addPet = useMutation({
  ...addPetMutation(),
  onError: (error) => {
    console.log(error);
  },
  onSuccess: (data) => {
    pet.value = data;
    petId.value = data.id ?? petId.value;

    if (typeof data?.id === 'number') {
      queryClient.invalidateQueries({
        queryKey: getPetByIdOptions({ path: { petId: data.id } }).queryKey,
      });
    }
  },
});

const updatePet = useMutation({
  ...updatePetMutation(),
  onError: (error) => {
    console.log(error);
  },
  onSuccess: (data) => {
    pet.value = data;
    petId.value = data.id ?? petId.value;

    if (typeof data?.id === 'number') {
      queryClient.invalidateQueries({
        queryKey: getPetByIdOptions({ path: { petId: data.id } }).queryKey,
      });
    }
  },
});

const { data, error } = useQuery(
  computed(() => ({
    ...getPetByIdOptions({
      client: localClient,
      path: {
        petId: petId.value!,
      },
    }),
    enabled: Boolean(petId.value),
  })),
);

const handleAddPet = async () => {
  if (PetSchema.required.includes('name') && !petInput.value?.name?.length) {
    return;
  }

  addPet.mutate({
    body: {
      category: {
        id: 0,
        name: petInput.value.category,
      },
      id: 0,
      name: petInput.value?.name,
      photoUrls: ['string'],
      status: 'available',
      tags: [
        {
          id: 0,
          name: 'string',
        },
      ],
    },
  });
};

function setRandomPetId() {
  // random id 1-10
  petId.value = Math.floor(Math.random() * (10 - 1 + 1) + 1);
}

const handleUpdatePet = async () => {
  updatePet.mutate({
    body: {
      category: {
        id: pet.value?.category?.id ?? 0,
        name: petInput.value.category,
      },
      id: pet.value?.id ?? 0,
      name: petInput.value.name,
      photoUrls: ['string'],
      status: 'available',
      tags: [
        {
          id: 0,
          name: 'string',
        },
      ],
    },
    // setting headers per request
    headers: {
      Authorization: 'Bearer <token_from_method>',
    },
  });
};

watch(data, () => {
  pet.value = data.value;
});

watch(error, (error) => {
  console.log(error);
});
</script>

<template>
  <div class="bg-[#18191b] py-12">
    <div class="mx-auto flex max-w-md flex-col gap-12">
      <div class="flex items-center">
        <a class="shrink-0" href="https://heyapi.dev/" target="_blank">
          <img
            alt="Hey API logo"
            class="size-16 transition duration-300 will-change-auto"
            src="https://heyapi.dev/assets/raw/logo.png"
          />
        </a>

        <h1 class="text-2xl font-bold text-white">@hey-api/openapi-ts 🤝 TanStack Vue Query</h1>
      </div>

      <div class="flex flex-col gap-2">
        <div
          class="flex max-w-60 items-center gap-3 rounded border border-[#575e64] bg-[#1f2123] p-4"
        >
          <div
            class="flex size-10 place-content-center place-items-center rounded-full bg-[#233057] text-lg font-medium text-[#9eb1ff]"
          >
            <span>
              {{ pet?.name?.slice(0, 1) || 'N' }}
            </span>
          </div>

          <div>
            <p class="text-sm font-bold text-white">Name: {{ pet?.name || 'N/A' }}</p>

            <p class="text-sm text-[#f1f7feb5]">Category: {{ pet?.category?.name || 'N/A' }}</p>
          </div>
        </div>

        <button
          class="rounded bg-[#3e63dd] p-1 text-sm font-medium text-white"
          type="button"
          @click="setRandomPetId"
        >
          Get Random Pet
        </button>
      </div>

      <form class="flex flex-col gap-3" @submit.prevent="handleAddPet">
        <div class="flex w-64 flex-col gap-1">
          <label class="font-medium text-white" for="name">Name</label>

          <input
            v-model="petInput.name"
            class="rounded border border-[#575e64] bg-[#121314] p-1 text-sm text-white placeholder:text-[#575e64]"
            name="name"
            placeholder="Kitty"
            required
          />
        </div>

        <div class="flex w-64 flex-col gap-1">
          <label class="font-medium text-white" for="category">Category</label>

          <input
            v-model="petInput.category"
            class="rounded border border-[#575e64] bg-[#121314] p-1 text-sm text-white placeholder:text-[#575e64]"
            name="category"
            placeholder="Cats"
            required
          />
        </div>

        <div class="flex gap-2">
          <button class="rounded bg-[#3e63dd] p-2 text-sm font-medium text-white" type="submit">
            Add Pet
          </button>

          <button
            class="rounded bg-[#3e63dd] p-2 text-sm font-medium text-white disabled:cursor-not-allowed"
            :disabled="!pet"
            type="button"
            @click="handleUpdatePet"
          >
            Update Pet
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
