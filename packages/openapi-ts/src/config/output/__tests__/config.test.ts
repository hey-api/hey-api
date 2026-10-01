import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { getOutput } from '../config';

describe('getOutput', () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'openapi-ts-test-'));
  });

  afterEach(() => {
    if (fs.existsSync(tmpDir)) {
      fs.rmSync(tmpDir, { force: true, recursive: true });
    }
  });

  describe('module resolution detection', () => {
    it('should set module.extension when moduleResolution is NodeNext', () => {
      const tsconfigPath = path.join(tmpDir, 'tsconfig.json');
      fs.writeFileSync(
        tsconfigPath,
        JSON.stringify({
          compilerOptions: {
            moduleResolution: 'nodenext',
          },
        }),
      );

      const output = getOutput({
        output: {
          path: tmpDir,
          tsConfigPath: tsconfigPath,
        },
      });

      expect(output.module.extension).toBe('.js');
    });

    it('should set module.extension when moduleResolution is Node16', () => {
      const tsconfigPath = path.join(tmpDir, 'tsconfig.json');
      fs.writeFileSync(
        tsconfigPath,
        JSON.stringify({
          compilerOptions: {
            moduleResolution: 'node16',
          },
        }),
      );

      const output = getOutput({
        output: {
          path: tmpDir,
          tsConfigPath: tsconfigPath,
        },
      });

      expect(output.module.extension).toBe('.js');
    });

    it('should set module.extension when module is NodeNext (implicit moduleResolution)', () => {
      const tsconfigPath = path.join(tmpDir, 'tsconfig.json');
      fs.writeFileSync(
        tsconfigPath,
        JSON.stringify({
          compilerOptions: {
            module: 'nodenext',
          },
        }),
      );

      const output = getOutput({
        output: {
          path: tmpDir,
          tsConfigPath: tsconfigPath,
        },
      });

      expect(output.module.extension).toBe('.js');
    });

    it('should set module.extension when module is Node16 (implicit moduleResolution)', () => {
      const tsconfigPath = path.join(tmpDir, 'tsconfig.json');
      fs.writeFileSync(
        tsconfigPath,
        JSON.stringify({
          compilerOptions: {
            module: 'node16',
          },
        }),
      );

      const output = getOutput({
        output: {
          path: tmpDir,
          tsConfigPath: tsconfigPath,
        },
      });

      expect(output.module.extension).toBe('.js');
    });

    it('should not set module.extension for other module types', () => {
      const tsconfigPath = path.join(tmpDir, 'tsconfig.json');
      fs.writeFileSync(
        tsconfigPath,
        JSON.stringify({
          compilerOptions: {
            module: 'esnext',
          },
        }),
      );

      const output = getOutput({
        output: {
          path: tmpDir,
          tsConfigPath: tsconfigPath,
        },
      });

      expect(output.module.extension).toBeUndefined();
    });

    it('should not override explicit module.extension setting', () => {
      const tsconfigPath = path.join(tmpDir, 'tsconfig.json');
      fs.writeFileSync(
        tsconfigPath,
        JSON.stringify({
          compilerOptions: {
            module: 'nodenext',
          },
        }),
      );

      const output = getOutput({
        output: {
          module: {
            extension: '.ts',
          },
          path: tmpDir,
          tsConfigPath: tsconfigPath,
        },
      });

      expect(output.module.extension).toBe('.ts');
    });

    it('should work when both module and moduleResolution are set', () => {
      const tsconfigPath = path.join(tmpDir, 'tsconfig.json');
      fs.writeFileSync(
        tsconfigPath,
        JSON.stringify({
          compilerOptions: {
            module: 'nodenext',
            moduleResolution: 'nodenext',
          },
        }),
      );

      const output = getOutput({
        output: {
          path: tmpDir,
          tsConfigPath: tsconfigPath,
        },
      });

      expect(output.module.extension).toBe('.js');
    });

    it('should handle missing tsconfig gracefully', () => {
      const output = getOutput({
        output: {
          path: tmpDir,
        },
      });

      expect(output.module.extension).toBeUndefined();
    });

    it('should enable gitAttributes by default', () => {
      const output = getOutput({
        output: {
          path: tmpDir,
        },
      });

      expect(output.gitAttributes).toBe(true);
    });

    it('should allow disabling gitAttributes', () => {
      const output = getOutput({
        output: {
          gitAttributes: false,
          path: tmpDir,
        },
      });

      expect(output.gitAttributes).toBe(false);
    });
  });
});
