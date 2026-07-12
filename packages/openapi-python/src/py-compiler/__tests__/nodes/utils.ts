import fs from 'node:fs';
import path from 'node:path';

import { py } from '../../index';
import { snapshotsDir, tmpDir } from '../constants';

function getCallerFile(): string {
  const error = new Error();
  const stack = (error.stack ?? '').split('\n');
  const callerLine = stack.find((line) => line.includes('.test.ts'));
  if (!callerLine) {
    throw new Error('Could not find test file in stack trace');
  }
  const match = callerLine.match(/\(([^)]+)\)/) || callerLine.match(/at (.+):\d+:\d+/);
  if (!match?.[1]) {
    throw new Error('Could not extract file path');
  }
  return match[1];
}

function ensureInitFiles(dir: string, rootDir: string): void {
  let current = dir;
  while (current.startsWith(rootDir) && current !== rootDir) {
    const initPath = path.join(current, '__init__.py');
    if (!fs.existsSync(initPath)) {
      fs.writeFileSync(initPath, '');
    }
    current = path.dirname(current);
  }

  const rootInit = path.join(rootDir, '__init__.py');
  if (!fs.existsSync(rootInit)) {
    fs.writeFileSync(rootInit, '');
  }
}

export async function assertPrintedMatchesSnapshot(
  file: py.SourceFile,
  filename: string,
): Promise<void> {
  const result = py.createPrinter().format(file);

  const caller = getCallerFile();
  const relPath = path
    .relative(path.join(process.cwd(), 'src', 'py-compiler', '__tests__'), caller)
    .replace(/\.test\.ts$/, '');
  const outputPath = path.join(tmpDir, relPath, filename);
  const outputDir = path.dirname(outputPath);

  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(outputPath, result);

  ensureInitFiles(outputDir, tmpDir);

  const snapshotPath = path.join(snapshotsDir, relPath, filename);

  const snapshotDir = path.dirname(snapshotPath);
  fs.mkdirSync(snapshotDir, { recursive: true });
  ensureInitFiles(snapshotDir, snapshotsDir);

  await expect(result).toMatchFileSnapshot(snapshotPath);
}
