import type { IR } from '@hey-api/shared';

import type { HeyApiTypeScriptPlugin } from '../../types';
import { resolveItemsWithKeys } from '../enum';

const makePlugin = (
  nameConflictResolver?: NonNullable<
    HeyApiTypeScriptPlugin['Instance']['context']['config']['output']
  >['nameConflictResolver'],
): HeyApiTypeScriptPlugin['Instance'] =>
  ({
    config: {
      enums: {
        case: 'SCREAMING_SNAKE_CASE',
        enabled: true,
        mode: 'typescript',
      },
    },
    context: {
      config: {
        output: {
          nameConflictResolver,
        },
      },
    },
  }) as unknown as HeyApiTypeScriptPlugin['Instance'];

const makeItem = (key: string) => ({ key, schema: {} as IR.SchemaObject });

describe('resolveItemsWithKeys', () => {
  it('assigns unique keys even when a renamed key collides with a different base name', () => {
    // Etc/GMT+1 and Etc/GMT-1 both normalize to the base key ETC_GMT_1; the
    // second occurrence would naively rename to ETC_GMT_12, which collides
    // with Etc/GMT+12's own natural (non-colliding) key.
    const items = [makeItem('Etc/GMT+1'), makeItem('Etc/GMT+12'), makeItem('Etc/GMT-1')];

    const resolved = resolveItemsWithKeys(items, makePlugin());
    const keys = resolved.map(({ key }) => key);

    expect(new Set(keys).size).toBe(keys.length);
    expect(keys).toEqual(['ETC_GMT_1', 'ETC_GMT_12', 'ETC_GMT_13']);
  });

  it('assigns the base key with no suffix when there is no collision', () => {
    const items = [makeItem('foo'), makeItem('bar')];

    const resolved = resolveItemsWithKeys(items, makePlugin());

    expect(resolved.map(({ key }) => key)).toEqual(['FOO', 'BAR']);
  });

  it('still resolves collisions correctly with a custom nameConflictResolver', () => {
    const items = [makeItem('Etc/GMT+1'), makeItem('Etc/GMT+12'), makeItem('Etc/GMT-1')];
    const nameConflictResolver = ({ attempt, baseName }: { attempt: number; baseName: string }) =>
      `${baseName}_${attempt + 1}`;

    const resolved = resolveItemsWithKeys(items, makePlugin(nameConflictResolver));
    const keys = resolved.map(({ key }) => key);

    expect(new Set(keys).size).toBe(keys.length);
  });
});
