import type { FileInfo, Plugin } from '../types';
import { ParserError } from '../util/errors';

export const jsonParser: Plugin = {
  canHandle: (file: FileInfo) => file.extension === '.json',
  async handler(file: FileInfo): Promise<object | undefined> {
    let data = file.data;
    if (Buffer.isBuffer(data)) {
      data = data.toString();
    }

    if (typeof data !== 'string') {
      // data is already a JavaScript value (object, array, number, null, NaN, etc.)
      return data as object;
    }

    if (!data.trim().length) {
      // this mirrors the YAML behavior
      return;
    }

    try {
      return JSON.parse(data);
      // oxlint-disable-next-line no-unused-vars
    } catch (error: any) {
      try {
        // find the first curly brace
        const firstCurlyBrace = data.indexOf('{');
        // remove any characters before the first curly brace
        data = data.slice(firstCurlyBrace);
        return JSON.parse(data);
      } catch (error: any) {
        throw new ParserError(error.message, file.url);
      }
    }
  },
  name: 'json',
};
