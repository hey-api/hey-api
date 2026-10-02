import * as refParser from '@hey-api/json-schema-ref-parser';

import { getSpec } from '../getSpec';
import type { WatchValues } from '../types/watch';

vi.mock('@hey-api/json-schema-ref-parser', () => ({
  getResolvedInput: vi.fn(({ pathOrUrlOrSchema }: { pathOrUrlOrSchema: string }) => ({
    path: pathOrUrlOrSchema,
    schema: undefined,
    type: 'url',
  })),
  sendRequest: vi.fn(),
}));

const mockSendRequest = vi.mocked(refParser.sendRequest);

describe('getSpec', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('URL input', () => {
    it('returns error with status 500 and error message when GET request throws an exception', async () => {
      mockSendRequest.mockRejectedValueOnce(new Error('fetch failed'));

      const result = await getSpec({
        fetchOptions: undefined,
        inputPath: 'http://example.com/openapi.json',
        timeout: undefined,
        watch: { headers: new Headers() },
      });

      expect(result.error).toBe('not-ok');
      expect(result.response!.status).toBe(500);
      expect(await result.response!.text()).toBe('fetch failed');
    });

    it('returns error with status 500 and string message when non-Error is thrown during GET request', async () => {
      mockSendRequest.mockRejectedValueOnce('network unavailable');

      const result = await getSpec({
        fetchOptions: undefined,
        inputPath: 'http://example.com/openapi.json',
        timeout: undefined,
        watch: { headers: new Headers() },
      });

      expect(result.error).toBe('not-ok');
      expect(result.response!.status).toBe(500);
      expect(await result.response!.text()).toBe('network unavailable');
    });

    it('returns error when GET response has status >= 300', async () => {
      mockSendRequest.mockResolvedValueOnce({
        response: new Response(null, { status: 404, statusText: 'Not Found' }),
      });

      const result = await getSpec({
        fetchOptions: undefined,
        inputPath: 'http://example.com/openapi.json',
        timeout: undefined,
        watch: { headers: new Headers() },
      });

      expect(result.error).toBe('not-ok');
      expect(result.response!.status).toBe(404);
    });

    it('returns error with status 500 and error message when HEAD request throws an exception', async () => {
      mockSendRequest.mockRejectedValueOnce(new Error('connection refused'));

      const result = await getSpec({
        fetchOptions: undefined,
        inputPath: 'http://example.com/openapi.json',
        timeout: undefined,
        watch: { headers: new Headers(), isHeadMethodSupported: true, lastValue: 'previous' },
      });

      expect(result.error).toBe('not-ok');
      expect(result.response!.status).toBe(500);
      expect(await result.response!.text()).toBe('connection refused');
    });

    it('returns arrayBuffer on successful GET', async () => {
      const content = '{"openapi":"3.0.0"}';
      const encoder = new TextEncoder();
      const buffer = encoder.encode(content).buffer as ArrayBuffer;

      mockSendRequest.mockResolvedValueOnce({
        response: new Response(buffer, { status: 200 }),
      });

      const result = await getSpec({
        fetchOptions: undefined,
        inputPath: 'http://example.com/openapi.json',
        timeout: undefined,
        watch: { headers: new Headers() },
      });

      expect(result.error).toBeUndefined();
      expect(result.arrayBuffer).toBeDefined();
    });

    it('falls back to GET and compares content when HEAD is not supported', async () => {
      const watch: WatchValues = { headers: new Headers(), lastValue: 'v1' };

      mockSendRequest
        .mockResolvedValueOnce({ response: new Response(null, { status: 404 }) })
        .mockResolvedValueOnce({ response: new Response('v1', { status: 200 }) })
        .mockResolvedValueOnce({ response: new Response('v2', { status: 200 }) });

      const unchanged = await getSpec({
        fetchOptions: undefined,
        inputPath: 'http://example.com/openapi.json',
        timeout: undefined,
        watch,
      });

      expect(unchanged.error).toBe('not-modified');
      expect(watch.isHeadMethodSupported).toBe(false);

      const changed = await getSpec({
        fetchOptions: undefined,
        inputPath: 'http://example.com/openapi.json',
        timeout: undefined,
        watch,
      });

      expect(changed.error).toBeUndefined();
      expect(new TextDecoder().decode(changed.arrayBuffer)).toBe('v2');
      expect(mockSendRequest.mock.calls.map(([args]) => args.fetchOptions?.method)).toEqual([
        'HEAD',
        'GET',
        'GET',
      ]);
    });

    it('returns not-modified when HEAD responds with unchanged ETag', async () => {
      mockSendRequest.mockResolvedValueOnce({
        response: new Response(null, { headers: { ETag: '"abc"' }, status: 200 }),
      });

      const result = await getSpec({
        fetchOptions: undefined,
        inputPath: 'http://example.com/openapi.json',
        timeout: undefined,
        watch: {
          headers: new Headers({ 'If-None-Match': '"abc"' }),
          isHeadMethodSupported: true,
          lastValue: 'previous',
        },
      });

      expect(result.error).toBe('not-modified');
      expect(mockSendRequest).toHaveBeenCalledTimes(1);
    });

    it('returns error when HEAD fails after it was supported', async () => {
      const watch: WatchValues = {
        headers: new Headers(),
        isHeadMethodSupported: true,
        lastValue: 'previous',
      };

      mockSendRequest.mockResolvedValueOnce({
        response: new Response(null, { status: 503 }),
      });

      const result = await getSpec({
        fetchOptions: undefined,
        inputPath: 'http://example.com/openapi.json',
        timeout: undefined,
        watch,
      });

      expect(result.error).toBe('not-ok');
      expect(result.response!.status).toBe(503);
      expect(watch.isHeadMethodSupported).toBe(true);
      expect(mockSendRequest).toHaveBeenCalledTimes(1);
    });
  });
});
