import { Logger, Project } from '@hey-api/codegen-core';

import type { AnyConfig } from '../../config/shared';
import { Context } from '../context';

const createContext = (): Context =>
  new Context({
    config: {
      input: [],
      logs: {},
      output: {},
      parser: {
        hooks: {},
      },
      pluginOrder: ['my-plugin'],
      plugins: {
        'my-plugin': {
          config: { name: 'my-plugin' },
          dependencies: new Set(),
        },
      },
    } as unknown as AnyConfig,
    dependencies: {},
    logger: new Logger(),
    project: new Project({ root: '/root' }),
    spec: {},
  });

describe('Context.registerPlugins', () => {
  it('throws a descriptive error when a plugin is missing a handler', () => {
    const context = createContext();

    expect(() => context.registerPlugins()).toThrowError(/missing a valid "handler" function/);
  });
});
