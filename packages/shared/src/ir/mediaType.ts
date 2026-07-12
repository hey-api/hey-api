const fileLikeRegExp =
  /^(application\/(pdf|rtf|msword|vnd\.(ms-|openxmlformats-officedocument\.)|zip|x-(7z|tar|rar|zip|iso)|octet-stream|gzip|x-msdownload|json\+download|xml|x-yaml|x-7z-compressed|x-tar)|text\/(yaml|css|javascript)|audio\/(mpeg|wav)|video\/(mp4|x-matroska)|image\/(vnd\.adobe\.photoshop|svg\+xml))(; ?charset=[^;]+)?$/i;
const jsonMimeRegExp = /^application\/(.*\+)?json(;.*)?$/i;
const multipartFormDataMimeRegExp = /^multipart\/form-data(;.*)?$/i;
const textMimeRegExp = /^text\/[a-z0-9.+-]+(;.*)?$/i;
const xWwwFormUrlEncodedMimeRegExp = /^application\/x-www-form-urlencoded(;.*)?$/i;
const octetStreamMimeRegExp = /^application\/octet-stream(;.*)?$/i;

export type IRMediaType = 'form-data' | 'json' | 'text' | 'url-search-params' | 'octet-stream';

export function isMediaTypeFileLike({ mediaType }: { mediaType: string }): boolean {
  fileLikeRegExp.lastIndex = 0;
  return fileLikeRegExp.test(mediaType);
}

export function mediaTypeToIrMediaType({
  mediaType,
}: {
  mediaType: string;
}): IRMediaType | undefined {
  jsonMimeRegExp.lastIndex = 0;
  if (jsonMimeRegExp.test(mediaType)) {
    return 'json';
  }

  multipartFormDataMimeRegExp.lastIndex = 0;
  if (multipartFormDataMimeRegExp.test(mediaType)) {
    return 'form-data';
  }

  textMimeRegExp.lastIndex = 0;
  if (textMimeRegExp.test(mediaType)) {
    return 'text';
  }

  xWwwFormUrlEncodedMimeRegExp.lastIndex = 0;
  if (xWwwFormUrlEncodedMimeRegExp.test(mediaType)) {
    return 'url-search-params';
  }

  octetStreamMimeRegExp.lastIndex = 0;
  if (octetStreamMimeRegExp.test(mediaType)) {
    return 'octet-stream';
  }

  return;
}
