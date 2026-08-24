import { describe, expect, it, vi } from 'vitest';

import { createSseClient } from '../src/client/core/serverSentEvents.gen';

describe('generated SSE client retries', () => {
  it('reports whether each bounded attempt will be retried', async () => {
    const errors = [new Error('first failure'), new Error('second failure')];
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockRejectedValueOnce(errors[0])
      .mockRejectedValueOnce(errors[1]);
    const onSseError = vi.fn();
    const sleep = vi.fn(async () => {});
    const { stream } = createSseClient({
      fetch: fetchMock,
      onSseError,
      sseDefaultRetryDelay: 0,
      sseMaxRetryAttempts: 2,
      sseSleepFn: sleep,
      url: 'http://localhost/sse',
    });

    const result = await stream.next();

    expect(result.done).toBe(true);
    expect(onSseError.mock.calls).toEqual([
      [errors[0], { attempt: 1, willRetry: true }],
      [errors[1], { attempt: 2, willRetry: false }],
    ]);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(sleep).toHaveBeenCalledOnce();
    expect(onSseError.mock.invocationCallOrder[0]).toBeLessThan(sleep.mock.invocationCallOrder[0]!);
  });

  it('reports an unbounded retry before a later success', async () => {
    const error = new Error('temporary failure');
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockRejectedValueOnce(error)
      .mockResolvedValueOnce(new Response('data: ok\n\n'));
    const onSseError = vi.fn();
    const sleep = vi.fn(async () => {});
    const { stream } = createSseClient({
      fetch: fetchMock,
      onSseError,
      sseDefaultRetryDelay: 0,
      sseSleepFn: sleep,
      url: 'http://localhost/sse',
    });

    const result = await stream.next();

    expect(result.value).toBe('ok');
    expect(onSseError).toHaveBeenCalledWith(error, {
      attempt: 1,
      willRetry: true,
    });
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(sleep).toHaveBeenCalledOnce();
  });

  it('reports an abort-triggered error without retrying or sleeping', async () => {
    const controller = new AbortController();
    const error = new Error('aborted');
    const fetchMock = vi.fn<typeof fetch>(async () => {
      controller.abort();
      throw error;
    });
    const onSseError = vi.fn();
    const sleep = vi.fn(async () => {});
    const { stream } = createSseClient({
      fetch: fetchMock,
      onSseError,
      signal: controller.signal,
      sseSleepFn: sleep,
      url: 'http://localhost/sse',
    });

    const result = await stream.next();

    expect(result.done).toBe(true);
    expect(onSseError).toHaveBeenCalledWith(error, {
      attempt: 1,
      willRetry: false,
    });
    expect(fetchMock).toHaveBeenCalledOnce();
    expect(sleep).not.toHaveBeenCalled();
  });

  it('supports a disabled retry policy without an error callback', async () => {
    const fetchMock = vi.fn<typeof fetch>().mockRejectedValue(new Error('failure'));
    const { stream } = createSseClient({
      fetch: fetchMock,
      sseMaxRetryAttempts: 0,
      url: 'http://localhost/sse',
    });

    const result = await stream.next();

    expect(result.done).toBe(true);
    expect(fetchMock).toHaveBeenCalledOnce();
  });
});
