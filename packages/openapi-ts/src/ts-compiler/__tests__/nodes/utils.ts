import fs from 'node:fs';
import path from 'node:path';

import { ts } from '../../index';
import type { TsNode } from '../../nodes/base';
import type { TsSourceFile } from '../../nodes/structure/source-file';
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

export async function assertNodePrintedMatchesSnapshot(node: TsNode, filename: string) {
  const result = ts.createPrinter().format(node);

  const caller = getCallerFile();
  const relPath = path
    .relative(path.join(process.cwd(), 'src', 'ts-compiler', '__tests__'), caller)
    .replace(/\.test\.ts$/, '');
  const outputPath = path.join(tmpDir, relPath, filename);
  const outputDir = path.dirname(outputPath);

  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(outputPath, result);

  const snapshotPath = path.join(snapshotsDir, relPath, filename);
  await expect(result).toMatchFileSnapshot(snapshotPath);
}

export async function assertPrintedMatchesSnapshot(file: TsSourceFile, filename: string) {
  const result = ts.createPrinter().format(file);

  const caller = getCallerFile();
  const relPath = path
    .relative(path.join(process.cwd(), 'src', 'ts-compiler', '__tests__'), caller)
    .replace(/\.test\.ts$/, '');
  const outputPath = path.join(tmpDir, relPath, filename);
  const outputDir = path.dirname(outputPath);

  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(outputPath, result);

  const snapshotPath = path.join(snapshotsDir, relPath, filename);
  await expect(result).toMatchFileSnapshot(snapshotPath);
}
