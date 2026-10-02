import { isExecutedDirectly, writeDebugFile } from './config';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function getOrdinalSuffix(day: number): string {
  if (day >= 11 && day <= 13) return 'th';
  const lastDigit = day % 10;
  if (lastDigit === 1) return 'st';
  if (lastDigit === 2) return 'nd';
  if (lastDigit === 3) return 'rd';
  return 'th';
}

function formatReleaseName(tag: string): string {
  const [datePart, sequence] = tag.split('.');
  const [year, month, day] = datePart!.split('-').map(Number);
  const monthName = MONTHS[month! - 1]!;
  const suffix = getOrdinalSuffix(day!);
  const name = `${monthName} ${day}${suffix}, ${year}`;
  return sequence ? `${name} (${sequence})` : name;
}

if (isExecutedDirectly(import.meta.url)) {
  const tag = process.argv[2];
  if (!tag) {
    console.error('Usage: release-name.ts <tag>');
    process.exitCode = 1;
  } else {
    const name = formatReleaseName(tag);
    writeDebugFile('RELEASE_NAME.json', () => JSON.stringify({ name, tag }, null, 2));
    process.stdout.write(`${name}\n`);
  }
}
