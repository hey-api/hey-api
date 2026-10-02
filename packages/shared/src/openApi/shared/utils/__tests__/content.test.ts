import { describe, expect, it } from 'vitest';

import type { IRMediaType } from '../../../../ir/mediaType';
import { selectContent } from '../content';

const content = (mediaType: string, type?: IRMediaType) => ({ mediaType, type });

describe('selectContent', () => {
  it('returns undefined for empty contents', () => {
    expect(selectContent({ contents: [], preferred: undefined })).toBeUndefined();
  });

  it('prefers JSON by default', () => {
    const contents = [content('text/plain', 'text'), content('application/json', 'json')];
    expect(selectContent({ contents, preferred: undefined })).toBe(contents[1]);
  });

  it('falls back to the first entry when no JSON exists', () => {
    const contents = [content('text/plain', 'text'), content('application/xml', undefined)];
    expect(selectContent({ contents, preferred: undefined })).toBe(contents[0]);
  });

  it('honors an ordered preference', () => {
    const contents = [
      content('application/json', 'json'),
      content('multipart/form-data', 'form-data'),
      content('text/plain', 'text'),
    ];
    expect(
      selectContent({ contents, preferred: ['application/octet-stream', 'multipart/form-data'] }),
    ).toBe(contents[1]);
  });

  it('matches strings ignoring parameters and casing', () => {
    const contents = [
      content('application/json', 'json'),
      content('Text/Plain; charset=utf-8', 'text'),
    ];
    expect(selectContent({ contents, preferred: ['text/plain'] })).toBe(contents[1]);
  });

  it('matches regular expressions against the raw media type', () => {
    const contents = [content('application/json', 'json'), content('application/xml', undefined)];
    expect(selectContent({ contents, preferred: [/xml/] })).toBe(contents[1]);
  });

  it('falls back to the default rule when nothing matches', () => {
    const contents = [content('text/plain', 'text'), content('application/json', 'json')];
    expect(selectContent({ contents, preferred: ['application/pdf'] })).toBe(contents[1]);
  });
});
