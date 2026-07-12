import type { IR } from '../../../ir/types';

export function mergeParametersObjects({
  source,
  target,
}: {
  source: IR.ParametersObject | undefined;
  target: IR.ParametersObject | undefined;
}): IR.ParametersObject | undefined {
  const result = { ...target };

  if (source) {
    if (source.cookie) {
      if (result.cookie) {
        result.cookie = {
          ...result.cookie,
          ...source.cookie,
        };
      } else {
        result.cookie = source.cookie;
      }
    }

    if (source.header) {
      if (result.header) {
        result.header = {
          ...result.header,
          ...source.header,
        };
      } else {
        result.header = source.header;
      }
    }

    if (source.path) {
      if (result.path) {
        result.path = {
          ...result.path,
          ...source.path,
        };
      } else {
        result.path = source.path;
      }
    }

    if (source.query) {
      if (result.query) {
        result.query = {
          ...result.query,
          ...source.query,
        };
      } else {
        result.query = source.query;
      }
    }
  }

  if (!Object.keys(result).length) {
    return;
  }

  return result;
}
