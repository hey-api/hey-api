import { getResponseType, isResponseTypeSupported } from '../response-type';

describe('getResponseType', () => {
  const scenarios: [string | null | undefined, ReturnType<typeof getResponseType>][] = [
    [undefined, undefined],
    [null, undefined],
    ['', undefined],
    [';charset=utf-8', undefined],
    ['application/json', 'json'],
    ['application/json; charset=utf-8', 'json'],
    ['application/vnd.api+json', 'json'],
    ['application/octet-stream', 'blob'],
    ['image/png', 'blob'],
    ['text/plain', 'text'],
    ['multipart/form-data', undefined],
  ];

  it.each(scenarios)('maps %s to %s', (mediaType, expected) => {
    expect(getResponseType(mediaType)).toBe(expected);
  });
});

describe('isResponseTypeSupported', () => {
  it('accepts blob and text for Angular', () => {
    expect(isResponseTypeSupported('@hey-api/client-angular', 'blob')).toBe(true);
    expect(isResponseTypeSupported('@hey-api/client-angular', 'text')).toBe(true);
  });

  it("skips Angular's default and unsupported types", () => {
    expect(isResponseTypeSupported('@hey-api/client-angular', 'json')).toBe(false);
    expect(isResponseTypeSupported('@hey-api/client-angular', 'document')).toBe(false);
    expect(isResponseTypeSupported('@hey-api/client-angular', 'stream')).toBe(false);
  });

  it('keeps every type for Axios', () => {
    for (const type of ['arraybuffer', 'blob', 'document', 'json', 'stream', 'text'] as const) {
      expect(isResponseTypeSupported('@hey-api/client-axios', type)).toBe(true);
    }
  });

  it('ignores clients that detect the response at runtime', () => {
    expect(isResponseTypeSupported('@hey-api/client-fetch', 'blob')).toBe(false);
  });
});
