import fs from 'node:fs';
import path from 'node:path';

export function getFilePaths(dirPath: string): Array<string> {
  let filePaths: Array<string> = [];
  const files = fs.readdirSync(dirPath);

  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      filePaths = filePaths.concat(getFilePaths(filePath));
    } else {
      filePaths.push(filePath);
    }
  }

  return filePaths;
}

export function getSpecsPath(): string {
  return path.join(import.meta.dirname, '..', '..', 'specs');
}
