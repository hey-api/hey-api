import fs from 'node:fs';

import { xSync } from 'tinyexec';

import { ConfigError } from '../../../error';
import { postprocessOutput } from '../postprocess';

vi.mock('tinyexec');
vi.mock('node:fs');

const mockXSync = vi.mocked(xSync);
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

  it('should not call xSync when postProcess is empty', () => {
    postprocessOutput(baseConfig, noopPostProcessors, '');
    expect(mockXSync).not.toHaveBeenCalled();
  });

  it('should not call xSync when output directory does not exist', () => {
    mockExistsSync.mockReturnValue(false);

    postprocessOutput(
      { ...baseConfig, postProcess: [{ args: ['{{path}}'], command: 'prettier' }] },
      noopPostProcessors,
      '',
    );

    expect(mockXSync).not.toHaveBeenCalled();
  });

  it('should not call xSync when output directory is empty', () => {
    mockReaddirSync.mockReturnValue([] as any);

    postprocessOutput(
      { ...baseConfig, postProcess: [{ args: ['{{path}}'], command: 'prettier' }] },
      noopPostProcessors,
      '',
    );

    expect(mockXSync).not.toHaveBeenCalled();
  });

  it('should call xSync with command and resolved args', () => {
    mockXSync.mockReturnValue({ exitCode: 0 } as any);

    postprocessOutput(
      { ...baseConfig, postProcess: [{ args: ['fmt', '{{path}}'], command: 'dprint' }] },
      noopPostProcessors,
      '',
    );

    expect(mockXSync).toHaveBeenCalledWith('dprint', ['fmt', '/output']);
  });

  it('should replace {{path}} placeholder in args', () => {
    mockXSync.mockReturnValue({ exitCode: 0 } as any);

    postprocessOutput(
      { path: '/my/output', postProcess: [{ args: ['{{path}}', '--write'], command: 'prettier' }] },
      noopPostProcessors,
      '',
    );

    expect(mockXSync).toHaveBeenCalledWith('prettier', ['/my/output', '--write']);
  });

  it('should throw ConfigError when the process fails to spawn (e.g., ENOENT)', () => {
    const spawnError = new Error('spawnSync oxfmt ENOENT');
    mockXSync.mockImplementation(() => {
      throw spawnError;
    });

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
    mockXSync.mockImplementation(() => {
      throw spawnError;
    });

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
    mockXSync.mockImplementation(() => {
      throw spawnError;
    });

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

  it('should throw ConfigError when the process exits with a non-zero exit code', () => {
    mockXSync.mockReturnValue({ exitCode: 1, stderr: '' } as any);

    expect(() =>
      postprocessOutput(
        { ...baseConfig, postProcess: [{ args: ['{{path}}'], command: 'prettier' }] },
        noopPostProcessors,
        '',
      ),
    ).toThrow(ConfigError);
  });

  it('should include exit code in error message', () => {
    mockXSync.mockReturnValue({ exitCode: 1, stderr: '' } as any);

    expect(() =>
      postprocessOutput(
        { ...baseConfig, postProcess: [{ args: ['{{path}}'], command: 'prettier' }] },
        noopPostProcessors,
        '',
      ),
    ).toThrow('Post-processor "prettier" exited with code 1');
  });

  it('should include stderr output in error message when process fails', () => {
    mockXSync.mockReturnValue({
      exitCode: 2,
      stderr: 'error: file not found',
    } as any);

    expect(() =>
      postprocessOutput(
        { ...baseConfig, postProcess: [{ args: ['{{path}}'], command: 'biome' }] },
        noopPostProcessors,
        '',
      ),
    ).toThrow('Post-processor "biome" exited with code 2:\nerror: file not found');
  });

  it('should not throw when the process is killed by a signal (undefined exit code)', () => {
    mockXSync.mockReturnValue({ exitCode: undefined, killed: true } as any);

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
    expect(mockXSync).not.toHaveBeenCalled();
  });

  it('should resolve and run string preset processors', () => {
    mockXSync.mockReturnValue({ exitCode: 0 } as any);

    const processors = {
      prettier: { args: ['--write', '{{path}}'], command: 'prettier', name: 'Prettier' },
    };

    postprocessOutput({ ...baseConfig, postProcess: ['prettier'] }, processors, '');

    expect(mockXSync).toHaveBeenCalledWith('prettier', ['--write', '/output']);
  });

  it('should stop processing and throw on first failure', () => {
    const spawnError = new Error('ENOENT');
    mockXSync.mockImplementation(() => {
      throw spawnError;
    });

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

    expect(mockXSync).toHaveBeenCalledTimes(1);
  });
});
