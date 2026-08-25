import fs from 'node:fs';

import { formatReleasePackage } from './assemble';
import { isExecutedDirectly, repo, SPONSORS_TABLE_GOLD_PATH, writeDebugFile } from './config';
import { getContributorsFromPullRequests } from './contributors';
import { getDateRangeFilterFromEnv } from './date-filter';
import { getPullRequestsFromRelease } from './pull-request';
import { readAllPackageChangelogs } from './reader';
import { createReleases } from './releases';
import type { Contributor, Release } from './types';

const SPOTLIGHT_PATH = '.release/spotlight.md';

function getSponsorsBlock(): string | undefined {
  try {
    const sponsorsTable = fs.readFileSync(SPONSORS_TABLE_GOLD_PATH, 'utf-8').trim();
    if (!sponsorsTable) return;

    return [
      '## Sponsors',
      '',
      'Partners behind the future of API tooling.',
      '',
      sponsorsTable,
      '',
      '[Become a sponsor →](https://heyapi.dev/sponsors)',
      '',
    ].join('\n');
  } catch {
    return;
  }
}

function formatReleaseNotes(release: Release, contributors: Array<Contributor>): string {
  const lines: Array<string> = [];

  try {
    const content = fs.readFileSync(SPOTLIGHT_PATH, 'utf-8').trim();
    if (content)
      lines.push(
        '## Spotlight',
        '',
        content,
        '',
        '[Contribute →](https://heyapi.dev/docs/openapi/typescript/community/contributing)',
        '',
        '---',
        '',
      );
  } catch {
    // noop
  }

  for (const pkg of release.packages.filter((p) => p.hasUserFacingChanges)) {
    formatReleasePackage(pkg, lines);
    lines.push('---', '');
  }

  const sponsorsBlock = getSponsorsBlock();
  if (sponsorsBlock) lines.push(sponsorsBlock);

  lines.push('## Contributors', '');
  if (contributors.length) {
    const sortedContributors = contributors.sort((a, b) => a.github.localeCompare(b.github));
    const names = sortedContributors.map((c) => `@${c.github}`);
    if (names.length === 1) {
      lines.push(`Built with contributions from ${names[0]}.`, '');
    } else if (names.length === 2) {
      lines.push(`Built with contributions from ${names[0]} and ${names[1]}.`, '');
    } else {
      const last = names.pop();
      lines.push(`Built with contributions from ${names.join(', ')}, and ${last}.`, '');
    }
  } else {
    lines.push(
      `Be the first to contribute to the next release! [Browse open issues →](https://github.com/${repo}/issues)`,
      '',
    );
  }

  lines.push(`[View full changelog →](https://github.com/${repo}/blob/main/CHANGELOG.md)`, '');

  return lines.join('\n');
}

export async function generateReleaseNotes(): Promise<string> {
  const changelogs = readAllPackageChangelogs();
  const dateRange = getDateRangeFilterFromEnv();
  const releases = createReleases(changelogs, { dateRange });

  if (!releases.length) {
    return 'No releases found.';
  }

  const latest = releases[0];

  const pullRequests = getPullRequestsFromRelease(latest);
  const contributors = await getContributorsFromPullRequests(pullRequests);
  const notes = formatReleaseNotes(latest, contributors);

  writeDebugFile('RELEASE_NOTES.json', () =>
    JSON.stringify({ contributors, latest, notes, pullRequests, releases }, null, 2),
  );
  writeDebugFile('RELEASE_NOTES.md', () => notes);

  return notes;
}

if (isExecutedDirectly(import.meta.url)) {
  generateReleaseNotes()
    .then((notes) => {
      process.stdout.write(`${notes}\n`);
    })
    .catch((error: unknown) => {
      console.error(error);
      process.exitCode = 1;
    });
}
