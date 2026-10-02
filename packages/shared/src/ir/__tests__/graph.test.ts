import type { IrTopLevelKind } from '../graph';
import { matchIrPointerToGroup } from '../graph';

describe('matchIrPointerToGroup', () => {
  const cases: Array<
    [string, IrTopLevelKind | undefined, { kind?: IrTopLevelKind; matched: boolean }]
  > = [
    ['#/components/schemas/Foo', undefined, { kind: 'schema', matched: true }],
    ['#/components/schemas/Foo', 'schema', { kind: 'schema', matched: true }],
    ['#/components/schemas/Foo', 'parameter', { matched: false }],
    ['#/components/parameters/Bar', undefined, { kind: 'parameter', matched: true }],
    ['#/components/parameters/Bar', 'parameter', { kind: 'parameter', matched: true }],
    ['#/components/parameters/Bar', 'schema', { matched: false }],
    ['#/components/requestBodies/Baz', undefined, { kind: 'requestBody', matched: true }],
    ['#/components/requestBodies/Baz', 'requestBody', { kind: 'requestBody', matched: true }],
    ['#/components/requestBodies/Baz', 'schema', { matched: false }],
    ['#/servers/0', undefined, { kind: 'server', matched: true }],
    ['#/servers/foo', undefined, { kind: 'server', matched: true }],
    ['#/paths/~1users/get', undefined, { kind: 'operation', matched: true }],
    ['#/paths/~1users/post', 'operation', { kind: 'operation', matched: true }],
    ['#/paths/~1users/query', 'operation', { kind: 'operation', matched: true }],
    ['#/webhooks/foo/get', undefined, { kind: 'webhook', matched: true }],
    ['#/webhooks/foo/patch', 'webhook', { kind: 'webhook', matched: true }],
    ['#/webhooks/foo/query', 'webhook', { kind: 'webhook', matched: true }],
    ['#/not/a/top/level', undefined, { matched: false }],
    ['#/components/unknown/Foo', undefined, { matched: false }],
  ];

  for (const [pointer, kind, expected] of cases) {
    it(`matches ${pointer} with kind=${kind}`, () => {
      const result = matchIrPointerToGroup(pointer, kind as IrTopLevelKind);
      expect(result.matched).toBe(expected.matched);
      if (expected.matched) {
        expect(result.kind).toBe(expected.kind);
      } else {
        expect(result.kind).toBeUndefined();
      }
    });
  }
});
