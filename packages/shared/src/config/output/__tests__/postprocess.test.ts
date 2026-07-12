import fs from 'node:fs';

import { sync } from 'cross-spawn';

import { ConfigError } from '../../../error';
import { postprocessOutput } from '../postprocess';

vi.mock('cross-spawn');
vi.mock('node:fs');

const mockSync = vi.mocked(sync);
const mockExistsSync = vi.mocked(fs.existsSync);
const mockReaddirSync = vi.mocked(fs.readdirSync);

const baseConfig = {
  path: '/output',
  postProcess: [],
};

const noopPostProcessors = {};

describe('postprocessOutput', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockExistsSync.mockReturnValue(true);
    mockReaddirSync.mockReturnValue(['index.ts'] as any);
  });

  it('should not call sync when postProcess is empty', () => {
    postprocessOutput(baseConfig, noopPostProcessors, '');
    expect(mockSync).not.toHaveBeenCalled();
  });

  it('should not call sync when output directory does not exist', () => {
    mockExistsSync.mockReturnValue(false);

    postprocessOutput(
      { ...baseConfig, postProcess: [{ args: ['{{path}}'], command: 'prettier' }] },
      noopPostProcessors,
      '',
    );

    expect(mockSync).not.toHaveBeenCalled();
  });

  it('should not call sync when output directory is empty', () => {
    mockReaddirSync.mockReturnValue([] as any);

    postprocessOutput(
      { ...baseConfig, postProcess: [{ args: ['{{path}}'], command: 'prettier' }] },
      noopPostProcessors,
      '',
    );

    expect(mockSync).not.toHaveBeenCalled();
  });

  it('should call sync with command and resolved args', () => {
    mockSync.mockReturnValue({ error: undefined, status: 0 } as any);

    postprocessOutput(
      { ...baseConfig, postProcess: [{ args: ['fmt', '{{path}}'], command: 'dprint' }] },
      noopPostProcessors,
      '',
    );

    expect(mockSync).toHaveBeenCalledWith('dprint', ['fmt', '/output']);
  });

  it('should replace {{path}} placeholder in args', () => {
    mockSync.mockReturnValue({ error: undefined, status: 0 } as any);

    postprocessOutput(
      { path: '/my/output', postProcess: [{ args: ['{{path}}', '--write'], command: 'prettier' }] },
      noopPostProcessors,
      '',
    );

    expect(mockSync).toHaveBeenCalledWith('prettier', ['/my/output', '--write']);
  });

  it('should throw ConfigError when the process fails to spawn (e.g., ENOENT)', () => {
    const spawnError = new Error('spawnSync oxfmt ENOENT');
    mockSync.mockReturnValue({ error: spawnError, status: null } as any);

    expect(() =>
      postprocessOutput(
        { ...baseConfig, postProcess: [{ args: ['{{path}}'], command: 'oxfmt' }] },
        noopPostProcessors,
        '',
      ),
    ).toThrow(ConfigError);
  });

  it('should include the error message when the process fails to spawn', () => {
    const spawnError = new Error('spawnSync oxfmt ENOENT');
    mockSync.mockReturnValue({ error: spawnError, status: null } as any);

    expect(() =>
      postprocessOutput(
        { ...baseConfig, postProcess: [{ args: ['{{path}}'], command: 'oxfmt' }] },
        noopPostProcessors,
        '',
      ),
    ).toThrow('Post-processor "oxfmt" failed to run: spawnSync oxfmt ENOENT');
  });

  it('should throw with a custom name when the process fails to spawn', () => {
    const spawnError = new Error('spawnSync my-formatter ENOENT');
    mockSync.mockReturnValue({ error: spawnError, status: null } as any);

    expect(() =>
      postprocessOutput(
        {
          ...baseConfig,
          postProcess: [{ args: ['{{path}}'], command: 'my-formatter', name: 'My Formatter' }],
        },
        noopPostProcessors,
        '',
      ),
    ).toThrow('Post-processor "My Formatter" failed to run: spawnSync my-formatter ENOENT');
  });

  it('should throw ConfigError when the process exits with a non-zero status code', () => {
    mockSync.mockReturnValue({ error: undefined, status: 1, stderr: Buffer.from('') } as any);

    expect(() =>
      postprocessOutput(
        { ...baseConfig, postProcess: [{ args: ['{{path}}'], command: 'prettier' }] },
        noopPostProcessors,
        '',
      ),
    ).toThrow(ConfigError);
  });

  it('should include exit code in error message', () => {
    mockSync.mockReturnValue({ error: undefined, status: 1, stderr: Buffer.from('') } as any);

    expect(() =>
      postprocessOutput(
        { ...baseConfig, postProcess: [{ args: ['{{path}}'], command: 'prettier' }] },
        noopPostProcessors,
        '',
      ),
    ).toThrow('Post-processor "prettier" exited with code 1');
  });

  it('should include stderr output in error message when process fails', () => {
    mockSync.mockReturnValue({
      error: undefined,
      status: 2,
      stderr: Buffer.from('error: file not found'),
    } as any);

    expect(() =>
      postprocessOutput(
        { ...baseConfig, postProcess: [{ args: ['{{path}}'], command: 'biome' }] },
        noopPostProcessors,
        '',
      ),
    ).toThrow('Post-processor "biome" exited with code 2:\nerror: file not found');
  });

  it('should not throw when the process is killed by a signal (null status)', () => {
    mockSync.mockReturnValue({ error: undefined, signal: 'SIGTERM', status: null } as any);

    expect(() =>
      postprocessOutput(
        { ...baseConfig, postProcess: [{ args: ['{{path}}'], command: 'prettier' }] },
        noopPostProcessors,
        '',
      ),
    ).not.toThrow();
  });

  it('should skip unknown string preset processors', () => {
    postprocessOutput({ ...baseConfig, postProcess: ['unknown-preset'] }, noopPostProcessors, '');
    expect(mockSync).not.toHaveBeenCalled();
  });

  it('should resolve and run string preset processors', () => {
    mockSync.mockReturnValue({ error: undefined, status: 0 } as any);

    const processors = {
      prettier: { args: ['--write', '{{path}}'], command: 'prettier', name: 'Prettier' },
    };

    postprocessOutput({ ...baseConfig, postProcess: ['prettier'] }, processors, '');

    expect(mockSync).toHaveBeenCalledWith('prettier', ['--write', '/output']);
  });

  it('should stop processing and throw on first failure', () => {
    const spawnError = new Error('ENOENT');
    mockSync.mockReturnValue({ error: spawnError, status: null } as any);

    expect(() =>
      postprocessOutput(
        {
          ...baseConfig,
          postProcess: [
            { args: ['{{path}}'], command: 'first' },
            { args: ['{{path}}'], command: 'second' },
          ],
        },
        noopPostProcessors,
        '',
      ),
    ).toThrow('Post-processor "first" failed to run: ENOENT');

    expect(mockSync).toHaveBeenCalledTimes(1);
  });
});
