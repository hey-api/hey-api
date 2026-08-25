import type { ContentPreference } from '../../../config/parser/types';
import type { IRMediaType } from '../../../ir/mediaType';

function matchesPreference(entry: string | RegExp, mediaType: string): boolean {
  if (typeof entry === 'string') {
    const bareMediaType = mediaType.split(';')[0]!.trim().toLowerCase();
    return bareMediaType === entry.trim().toLowerCase();
  }
  return entry.test(mediaType);
}

/**
 * Selects a single content entry from a `content` map. Each entry of
 * `preferred` is matched in order against the available media types; the
 * first match wins. When nothing matches, we prefer a JSON media type, then
 * the first defined entry.
 */
export function selectContent<T extends { mediaType: string; type: IRMediaType | undefined }>({
  contents,
  preferred,
}: {
  contents: ReadonlyArray<T>;
  preferred: ContentPreference | undefined;
}): T | undefined {
  for (const entry of preferred ?? []) {
    const match = contents.find((content) => matchesPreference(entry, content.mediaType));
    if (match) {
      return match;
    }
  }
  return contents.find((content) => content.type === 'json') ?? contents[0];
}
