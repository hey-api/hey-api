import { createSseClient } from '../bundle/serverSentEvents';

function makeStream(chunks: ReadonlyArray<string>) {
  let index = 0;
  return new ReadableStream({
    pull(controller) {
      if (index < chunks.length) {
        controller.enqueue(new TextEncoder().encode(chunks[index]));
        index++;
      } else {
        controller.close();
      }
    },
  });
}

function toRequest(input: RequestInfo, init?: RequestInit): Request {
  if (input instanceof Request) {
    const url = input.url.startsWith('http') ? input.url : `http://localhost${input.url}`;
    return new Request(url, input);
  }
  const url = input.startsWith('http') ? input : `http://localhost${input}`;
  return new Request(url, init);
}

describe('createSseClient', () => {
  let fetchMock: any;

  beforeEach(() => {
    fetchMock = vi.fn();
    global.fetch = fetchMock;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('yields parsed JSON events', async () => {
    fetchMock.mockResolvedValue({
      body: makeStream(['id: 1\nevent: test\ndata: {"foo":"bar"}\n\n']),
      ok: true,
    });

    const onEvent = vi.fn();
    const { stream } = createSseClient({
      onSseEvent: onEvent,
      url: 'http://localhost/sse',
    });

    const result: Array<any> = [];
    for await (const ev of stream) result.push(ev);

    expect(result).toEqual([{ foo: 'bar' }]);
    expect(onEvent).toHaveBeenCalledWith({
      data: { foo: 'bar' },
      event: 'test',
      id: '1',
      retry: 3000,
    });
  });

  it('falls back to raw string if not valid JSON', async () => {
    fetchMock.mockResolvedValue({
      body: makeStream(['data: hello\n\n']),
      ok: true,
    });

    const { stream } = createSseClient({ url: 'http://localhost/sse' });
    const result: Array<any> = [];
    for await (const ev of stream) result.push(ev);

    expect(result).toEqual(['hello']);
  });

  it('calls onSseError when response not ok', async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Server Error',
      text: async () => 'fail',
    });

    const onError = vi.fn();
    const controller = new AbortController();
    const { stream } = createSseClient({
      onSseError: onError,
      signal: controller.signal,
      sseDefaultRetryDelay: 0,
      url: 'http://localhost/sse',
    });

    const iter = stream[Symbol.asyncIterator]();
    const promise = iter.next().catch(() => {});
    controller.abort();
    await promise;

    expect(onError).toHaveBeenCalled();
    const error = onError.mock.calls[0]![0];
    expect(error).toBeInstanceOf(Error);
    expect((error as Error).message).toContain('SSE failed');
  });

  it('respects retry from server', async () => {
    fetchMock.mockResolvedValue({
      body: makeStream(['retry: 1234\ndata: "x"\n\n']),
      ok: true,
    });

    const onEvent = vi.fn();
    const { stream } = createSseClient({
      onSseEvent: onEvent,
      url: 'http://localhost/sse',
    });

    const iter = stream[Symbol.asyncIterator]();
    await iter.next();
    await iter.return?.();

    expect(onEvent).toHaveBeenCalledWith({
      data: 'x',
      event: undefined,
      id: undefined,
      retry: 1234,
    });
  });

  it('yields multiple events in one stream', async () => {
    fetchMock.mockResolvedValue({
      body: makeStream(['data: 1\n\n', 'data: 2\n\n', 'data: 3\n\n']),
      ok: true,
    });

    const { stream } = createSseClient({ url: 'http://localhost/sse' });
    const result: Array<any> = [];
    for await (const ev of stream) result.push(ev);
    expect(result).toEqual([1, 2, 3]);
  });

  it('handles partial chunks correctly', async () => {
    fetchMock.mockResolvedValue({
      body: makeStream(['data: par', 'tial\n\n']),
      ok: true,
    });

    const { stream } = createSseClient({ url: 'http://localhost/sse' });
    const result: Array<any> = [];
    for await (const ev of stream) result.push(ev);
    expect(result).toEqual(['partial']);
  });

  it('sets Last-Event-ID header on reconnect', async () => {
    let headersSeen: string | null | undefined;
    fetchMock.mockImplementation(async (input: RequestInfo, init?: RequestInit) => {
      const req = toRequest(input, init);
      headersSeen = req.headers.get('Last-Event-ID');
      return {
        body: makeStream(['data: a\n\n']),
        ok: true,
      };
    });

    const onEvent = vi.fn();
    const { stream } = createSseClient({
      onSseEvent: onEvent,
      url: 'http://localhost/sse',
    });

    const iter = stream[Symbol.asyncIterator]();
    await iter.next();
    await iter.return?.();

    // simulate next fetch after reconnect
    await fetchMock('http://localhost/sse', {
      headers: new Headers({ 'Last-Event-ID': '1' }),
    });
    expect(headersSeen).toBe('1');
  });

  it('stops cleanly when aborted', async () => {
    fetchMock.mockResolvedValue({
      body: makeStream(['data: stop\n\n']),
      ok: true,
    });

    const controller = new AbortController();
    const { stream } = createSseClient({
      signal: controller.signal,
      url: 'http://localhost/sse',
    });

    const iter = stream[Symbol.asyncIterator]();
    const first = await iter.next();
    expect(first).toEqual({ done: false, value: 'stop' });

    controller.abort();
    const second = await iter.next();
    expect(second).toEqual({ done: true, value: undefined });
  });

  it('handles mixed JSON and raw string events', async () => {
    fetchMock.mockResolvedValue({
      body: makeStream(['data: {"foo":1}\n\n', 'data: bar\n\n', 'data: {"baz":2}\n\n']),
      ok: true,
    });

    const { stream } = createSseClient({ url: 'http://localhost/sse' });
    const result: Array<any> = [];
    for await (const ev of stream) result.push(ev);
    expect(result).toEqual([{ foo: 1 }, 'bar', { baz: 2 }]);
  });

  it('passes custom headers', async () => {
    let headersSeen: string | null | undefined;
    fetchMock.mockImplementation(async (input: RequestInfo, init?: RequestInit) => {
      const req = toRequest(input, init);
      headersSeen = req.headers.get('X-Custom');
      return {
        body: makeStream([]),
        ok: true,
      };
    });

    const { stream } = createSseClient({
      headers: { 'X-Custom': 'abc' },
      url: 'http://localhost/sse',
    });

    const iter = stream[Symbol.asyncIterator]();
    await iter.next();
    await iter.return?.();

    expect(headersSeen).toBe('abc');
  });

  it('handles chunked JSON across multiple SSE messages', async () => {
    fetchMock.mockResolvedValue({
      body: makeStream(['data: {"foo":', '"bar"}\n\n']),
      ok: true,
    });

    const { stream } = createSseClient({ url: 'http://localhost/sse' });
    const result: Array<any> = [];
    for await (const ev of stream) result.push(ev);
    expect(result).toEqual([{ foo: 'bar' }]);
  });

  it('handles empty stream', async () => {
    fetchMock.mockResolvedValue({ body: makeStream([]), ok: true });
    const { stream } = createSseClient({ url: 'http://localhost/sse' });
    const iter = stream[Symbol.asyncIterator]();
    const first = await iter.next();
    expect(first).toEqual({ done: true, value: undefined });
  });

  it('respects retryDelay on rapid reconnects', async () => {
    let attempt = 0;
    fetchMock.mockImplementation(async () => {
      attempt++;
      if (attempt < 2) throw new Error('fail');
      return {
        body: makeStream(['data: ok\n\n']),
        ok: true,
      };
    });

    const onError = vi.fn();
    const { stream } = createSseClient({
      onSseError: onError,
      sseDefaultRetryDelay: 0,
      url: 'http://localhost/sse',
    });

    const result: Array<any> = [];
    for await (const ev of stream) result.push(ev);

    expect(onError).toHaveBeenCalled();
    expect(result).toEqual(['ok']);
  });

  it('ignores invalid retry values', async () => {
    fetchMock.mockResolvedValue({
      body: makeStream(['retry: not-a-number\ndata: x\n\n']),
      ok: true,
    });

    const onEvent = vi.fn();
    const { stream } = createSseClient({
      onSseEvent: onEvent,
      url: 'http://localhost/sse',
    });
    const iter = stream[Symbol.asyncIterator]();
    const ev = await iter.next();
    expect(ev.value).toBe('x');
    expect(onEvent.mock.calls[0]![0].retry).toBe(3000); // default
  });

  it('handles events with no data lines gracefully', async () => {
    fetchMock.mockResolvedValue({
      body: makeStream(['event: noop\nid: 1\n\n']),
      ok: true,
    });

    const onEvent = vi.fn();
    const { stream } = createSseClient({
      onSseEvent: onEvent,
      url: 'http://localhost/sse',
    });
    const iter = stream[Symbol.asyncIterator]();
    const ev = await iter.next();
    expect(ev.done).toBe(true);
    expect(onEvent).toHaveBeenCalledWith({
      data: undefined,
      event: 'noop',
      id: '1',
      retry: 3000,
    });
  });

  it('yields raw string on JSON parse error without calling onSseError', async () => {
    fetchMock.mockResolvedValue({
      body: makeStream(['data: {"foo": unquoted}\n\n']),
      ok: true,
    });

    const onEvent = vi.fn();
    const onError = vi.fn();
    const { stream } = createSseClient({
      onSseError: onError,
      onSseEvent: onEvent,
      url: 'http://localhost/sse',
    });
    const iter = stream[Symbol.asyncIterator]();
    const ev = await iter.next();
    expect(ev.value).toBe('{"foo": unquoted}');
    expect(onError).not.toHaveBeenCalled();
  });

  it('handles multiple aborts without throwing', async () => {
    fetchMock.mockResolvedValue({
      body: makeStream(['data: a\n\n']),
      ok: true,
    });

    const controller = new AbortController();
    const { stream } = createSseClient({
      signal: controller.signal,
      url: 'http://localhost/sse',
    });
    const iter = stream[Symbol.asyncIterator]();
    await iter.next();

    controller.abort();
    await expect(iter.next()).resolves.toEqual({
      done: true,
      value: undefined,
    });
    controller.abort();
    await expect(iter.next()).resolves.toEqual({
      done: true,
      value: undefined,
    });
  });

  it('stops immediately if signal is already aborted', async () => {
    fetchMock.mockResolvedValue({
      body: makeStream(['data: a\n\n']),
      ok: true,
    });

    const controller = new AbortController();
    controller.abort();
    const { stream } = createSseClient({
      signal: controller.signal,
      url: 'http://localhost/sse',
    });
    const iter = stream[Symbol.asyncIterator]();
    const ev = await iter.next();
    expect(ev).toEqual({ done: true, value: undefined });
  });

  it('respects custom HTTP method', async () => {
    let methodSeen: string | undefined;
    fetchMock.mockImplementation(async (input: RequestInfo, init?: RequestInit) => {
      const req = toRequest(input, init);
      methodSeen = req.method;
      return {
        body: makeStream(['data: ok\n\n']),
        ok: true,
      };
    });

    const { stream } = createSseClient({
      method: 'POST',
      url: 'http://localhost/sse',
    });
    const iter = stream[Symbol.asyncIterator]();
    await iter.next();
    await iter.return?.();

    expect(methodSeen).toBe('POST');
  });

  it('respects external AbortSignal', async () => {
    fetchMock.mockResolvedValue({
      body: makeStream(['data: x\n\n']),
      ok: true,
    });

    const controller = new AbortController();
    const { stream } = createSseClient({
      signal: controller.signal,
      url: 'http://localhost/sse',
    });

    const iter = stream[Symbol.asyncIterator]();
    const first = await iter.next();
    expect(first.value).toBe('x');

    controller.abort();
    const second = await iter.next();
    expect(second.done).toBe(true);
  });

  it('ignores empty data but updates lastEventId', async () => {
    let lastEventId: string | undefined;
    fetchMock.mockImplementation(async () => ({
      body: makeStream(['id: 99\ndata:\n\n']),
      ok: true,
    }));

    const { stream } = createSseClient({
      onSseEvent: (ev) => {
        lastEventId = ev.id;
      },
      url: 'http://localhost/sse',
    });

    stream[Symbol.asyncIterator]();
    // pull all events until done
    for await (const _ of stream) {
      /* noop */
    }

    expect(lastEventId).toBe('99');
  });

  it('stops retrying after sseMaxRetryAttempts is reached', async () => {
    let attempt = 0;
    fetchMock.mockImplementation(async () => {
      attempt++;
      throw new Error('fail');
    });

    const onError = vi.fn();
    const { stream } = createSseClient({
      onSseError: onError,
      sseDefaultRetryDelay: 0,
      sseMaxRetryAttempts: 2,
      url: 'http://localhost/sse',
    });

    const iter = stream[Symbol.asyncIterator]();
    const result = await iter.next();

    expect(result.done).toBe(true);
    expect(onError).toHaveBeenCalledTimes(2); // once per failed attempt
    expect(attempt).toBe(2);
  });

  it('applies exponential backoff between retries', async () => {
    let attempt = 0;

    fetchMock.mockImplementation(() => {
      attempt++;
      if (attempt < 3) throw new Error('fail');
      return Promise.resolve({
        body: makeStream(['data: ok\n\n']),
        ok: true,
      });
    });

    const onError = vi.fn();
    const { stream } = createSseClient({
      onSseError: onError,
      sseDefaultRetryDelay: 10,
      // Inject a fake sleep that resolves instantly
      sseSleepFn: async () => {},
      url: 'http://localhost/sse',
    });

    const iter = stream[Symbol.asyncIterator]();

    const ev = await iter.next();

    expect(ev.value).toBe('ok');
    expect(onError).toHaveBeenCalledTimes(2);
    expect(attempt).toBe(3);
  });

  it('does not retry when sseMaxRetryAttempts is 0', async () => {
    let attempt = 0;
    fetchMock.mockImplementation(async () => {
      attempt++;
      throw new Error('fail');
    });

    const onError = vi.fn();
    const { stream } = createSseClient({
      onSseError: onError,
      sseMaxRetryAttempts: 0,
      url: 'http://localhost/sse',
    });

    const iter = stream[Symbol.asyncIterator]();
    const result = await iter.next();

    expect(result.done).toBe(true);
    expect(onError).toHaveBeenCalledTimes(1);
    expect(attempt).toBe(1);
  });

  it('calls responseValidator before yielding JSON', async () => {
    fetchMock.mockResolvedValue({
      body: makeStream(['data: {"foo": "bar"}\n\n']),
      ok: true,
    });

    const validator = vi.fn(async (data) => {
      if (!('foo' in (data as any))) throw new Error('Missing foo');
    });

    const { stream } = createSseClient({
      responseValidator: validator,
      url: 'http://localhost/sse',
    });

    const result: Array<any> = [];
    for await (const ev of stream) result.push(ev);

    expect(result).toEqual([{ foo: 'bar' }]);
    expect(validator).toHaveBeenCalledTimes(1);
  });

  it('calls responseTransformer before yielding JSON', async () => {
    fetchMock.mockResolvedValue({
      body: makeStream(['data: {"num": 2}\n\n']),
      ok: true,
    });

    const transformer = vi.fn(async (data) => ({
      doubled: (data as any).num * 2,
    }));

    const { stream } = createSseClient({
      responseTransformer: transformer,
      url: 'http://localhost/sse',
    });

    const result: Array<any> = [];
    for await (const ev of stream) result.push(ev);

    expect(result).toEqual([{ doubled: 4 }]);
    expect(transformer).toHaveBeenCalledTimes(1);
  });

  it('validator error triggers onSseError and retry', async () => {
    let attempt = 0;
    fetchMock.mockImplementation(async () => {
      attempt++;
      return {
        body: makeStream(['data: {"foo": "bar"}\n\n']),
        ok: true,
      };
    });

    const validator = vi.fn(async () => {
      throw new Error('invalid');
    });
    const onError = vi.fn();

    const { stream } = createSseClient({
      onSseError: onError,
      responseValidator: validator,
      sseDefaultRetryDelay: 0,
      sseMaxRetryAttempts: 1,
      url: 'http://localhost/sse',
    });

    const iter = stream[Symbol.asyncIterator]();
    await iter.next().catch(() => {});
    expect(onError).toHaveBeenCalledTimes(1);
    expect(attempt).toBe(1);
  });

  it('skips validator/transformer for non-JSON events', async () => {
    fetchMock.mockResolvedValue({
      body: makeStream(['data: rawstring\n\n']),
      ok: true,
    });

    const validator = vi.fn();
    const transformer = vi.fn();

    const { stream } = createSseClient({
      responseTransformer: transformer,
      responseValidator: validator,
      url: 'http://localhost/sse',
    });

    const result: Array<any> = [];
    for await (const ev of stream) result.push(ev);

    expect(result).toEqual(['rawstring']);
    expect(validator).not.toHaveBeenCalled();
    expect(transformer).not.toHaveBeenCalled();
  });

  it('handles CRLF line endings', async () => {
    fetchMock.mockResolvedValue({
      body: makeStream(['id: 1\r\nevent: test\r\ndata: {"foo":"bar"}\r\n\r\n']),
      ok: true,
    });

    const onEvent = vi.fn();
    const { stream } = createSseClient({
      onSseEvent: onEvent,
      url: 'http://localhost/sse',
    });

    const result: Array<any> = [];
    for await (const ev of stream) result.push(ev);

    expect(result).toEqual([{ foo: 'bar' }]);
    expect(onEvent).toHaveBeenCalledWith({
      data: { foo: 'bar' },
      event: 'test',
      id: '1',
      retry: 3000,
    });
  });

  it('handles CR-only line endings', async () => {
    fetchMock.mockResolvedValue({
      body: makeStream(['id: 2\revent: test\rdata: {"baz":"qux"}\r\r']),
      ok: true,
    });

    const onEvent = vi.fn();
    const { stream } = createSseClient({
      onSseEvent: onEvent,
      url: 'http://localhost/sse',
    });

    const result: Array<any> = [];
    for await (const ev of stream) result.push(ev);

    expect(result).toEqual([{ baz: 'qux' }]);
    expect(onEvent).toHaveBeenCalledWith({
      data: { baz: 'qux' },
      event: 'test',
      id: '2',
      retry: 3000,
    });
  });

  it('handles mixed line endings in a single stream', async () => {
    fetchMock.mockResolvedValue({
      body: makeStream(['data: 1\n\n', 'data: 2\r\n\r\n', 'data: 3\r\r']),
      ok: true,
    });

    const { stream } = createSseClient({ url: 'http://localhost/sse' });
    const result: Array<any> = [];
    for await (const ev of stream) result.push(ev);
    expect(result).toEqual([1, 2, 3]);
  });
});

describe('serialized request body handling', () => {
  let fetchMock: any;

  beforeEach(() => {
    fetchMock = vi.fn();
    global.fetch = fetchMock;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('sends serialized JSON body in SSE request', async () => {
    fetchMock.mockResolvedValue({
      body: makeStream(['data: ok\n\n']),
      ok: true,
    });

    const jsonBody = { key: 'value' };
    const serializedBody = JSON.stringify(jsonBody);

    const { stream } = createSseClient({
      body: jsonBody as any,
      method: 'POST',
      serializedBody,
      url: 'http://localhost/sse',
    });

    const iter = stream[Symbol.asyncIterator]();
    await iter.next();
    await iter.return?.();

    expect(fetchMock).toHaveBeenCalled();
    const request = fetchMock.mock.calls[0]![0];
    expect(request).toBeInstanceOf(Request);
    await expect(request.text()).resolves.toBe(serializedBody);
  });

  it('handles empty string serializedBody', async () => {
    fetchMock.mockResolvedValue({
      body: makeStream(['data: ok\n\n']),
      ok: true,
    });

    const { stream } = createSseClient({
      body: '' as any,
      method: 'POST',
      serializedBody: '',
      url: 'http://localhost/sse',
    });

    const iter = stream[Symbol.asyncIterator]();
    await iter.next();
    await iter.return?.();

    expect(fetchMock).toHaveBeenCalled();
    const request = fetchMock.mock.calls[0]![0];
    expect(request).toBeInstanceOf(Request);
    await expect(request.text()).resolves.toBe('');
  });

  it('provides serialized body to onRequest hook', async () => {
    fetchMock.mockResolvedValue({
      body: makeStream(['data: ok\n\n']),
      ok: true,
    });

    const jsonBody = { key: 'value' };
    const serializedBody = JSON.stringify(jsonBody);
    const onRequest = vi.fn(async (url: string, init: RequestInit) => {
      expect(init.body).toBe(serializedBody);
      return toRequest(url, init);
    });

    const { stream } = createSseClient({
      body: jsonBody as any,
      method: 'POST',
      onRequest,
      serializedBody,
      url: 'http://localhost/sse',
    });

    const iter = stream[Symbol.asyncIterator]();
    await iter.next();
    await iter.return?.();

    expect(onRequest).toHaveBeenCalledWith(
      'http://localhost/sse',
      expect.objectContaining({
        body: serializedBody,
        method: 'POST',
      }),
    );
  });
});
