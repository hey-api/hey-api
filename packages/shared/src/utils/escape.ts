import { EOL } from 'node:os';

// Matches the first point (if any) that needs rewriting: a comment-terminator
// pair (`*/` or `/*`) or a line break.
const commentEscapeNeeded = /\*\/|\/\*|\r?\n/;

/**
 * Core idea: instead of three separate full-string `.replace` passes (one
 * per comment-terminator pair, plus one regex+callback pass for line
 * normalization/trimming), find the index of the first character that
 * starts any of those patterns. If none is found, the string is returned
 * untouched. Otherwise walk from that index once: unescaped runs are copied
 * in bulk via `slice` (tracked with `runStart`), each terminator pair
 * collapses to a single asterisk (both characters consumed together), and
 * each line break consumes the rest of that line in one step — normalizing
 * it to `EOL` and trimming the following line's content — so no line is
 * scanned twice.
 */
export function escapeComment(value: string): string {
  const match = commentEscapeNeeded.exec(value);
  if (match === null) return value;

  let result = value.slice(0, match.index);
  let runStart = match.index;
  const len = value.length;

  for (let i = match.index; i < len; i++) {
    const code = value.charCodeAt(i);
    let replacement: string;
    let consumed: number;

    // 42 = '*', 47 = '/', 13 = '\r', 10 = '\n'
    if (code === 42 && value.charCodeAt(i + 1) === 47) {
      // `*/`
      replacement = '*';
      consumed = 2;
    } else if (code === 47 && value.charCodeAt(i + 1) === 42) {
      // `/*`
      replacement = '*';
      consumed = 2;
    } else if (code === 13 && value.charCodeAt(i + 1) === 10) {
      // `\r\n` followed by the rest of that line
      const lineEnd = value.indexOf('\n', i + 2);
      const line = lineEnd === -1 ? value.slice(i + 2) : value.slice(i + 2, lineEnd);
      replacement = EOL + line.trim();
      consumed = (lineEnd === -1 ? len : lineEnd) - i;
    } else if (code === 10) {
      // `\n` followed by the rest of that line
      const lineEnd = value.indexOf('\n', i + 1);
      const line = lineEnd === -1 ? value.slice(i + 1) : value.slice(i + 1, lineEnd);
      replacement = EOL + line.trim();
      consumed = (lineEnd === -1 ? len : lineEnd) - i;
    } else {
      continue;
    }

    if (runStart !== i) result += value.slice(runStart, i);
    result += replacement;
    i += consumed - 1;
    runStart = i + 1;
  }

  if (runStart !== len) result += value.slice(runStart);
  return result;
}
