import { execSync } from 'node:child_process';

import { isExecutedDirectly, writeDebugFile } from './config';

export function getAllTags(): Array<string> {
  const tagsOutput = execSync('git tag --list', { encoding: 'utf-8' });
  return tagsOutput.split('\n').filter(Boolean);
}

export async function generateReleaseTag(): Promise<string> {
  const today = new Date().toISOString().split('T')[0]!;

  const tags = getAllTags();

  const todayTags = tags.filter(
    (tag) => tag.match(/^\d{4}-\d{2}-\d{2}(\.\d+)?$/) && tag.startsWith(today),
  );

  const maxSequence = todayTags.reduce((max, tag) => {
    if (tag === today) {
      return Math.max(max, 1);
    }

    const sequence = Number.parseInt(tag.split('.')[1]!, 10);
    if (Number.isNaN(sequence)) {
      return max;
    }

    return Math.max(max, sequence);
  }, 0);

  const tag = !maxSequence ? today : `${today}.${maxSequence + 1}`;

  writeDebugFile('RELEASE_TAG.json', () =>
    JSON.stringify({ maxSequence, tag, tags, today, todayTags }, null, 2),
  );

  return tag;
}

if (isExecutedDirectly(import.meta.url)) {
  generateReleaseTag()
    .then((tag) => {
      process.stdout.write(`${tag}\n`);
    })
    .catch((error: unknown) => {
      console.error(error);
      process.exitCode = 1;
    });
}
