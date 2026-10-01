import path from 'node:path';

import { createClient } from '../index';

describe('TanStack React Query', () => {
  it('generates JSON mutation hooks while excluding SSE mutation hooks', async () => {
    const [context] = await createClient({
      dryRun: true,
      input: path.resolve(import.meta.dirname, '../../../../specs/3.1.x/sse-post.yaml'),
      logs: { level: 'silent' },
      output: 'output',
      plugins: [
        '@hey-api/client-fetch',
        {
          name: '@tanstack/react-query',
          useMutation: true,
        },
      ],
    });

    const files = context!.gen.render();
    const query = files.find((file) => file.path.endsWith('react-query.gen.ts'))?.content;
    const sdk = files.find((file) => file.path.endsWith('sdk.gen.ts'))?.content;

    expect(query).toContain('export const useCreateEventMutation =');
    expect(query).toContain('export const createEventMutation =');
    expect(query).toContain('export const listEventsOptions =');
    expect(query).not.toContain('subscribeToEventStream');
    expect(query).not.toContain('useSubscribeToEventStream');
    expect(sdk).toContain('export const subscribeToEventStream =');
  });
});
