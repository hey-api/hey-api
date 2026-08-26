import { styleText } from 'node:util';

import type { IR } from '../ir/types';
import { httpMethods } from '../openApi/shared/utils/operation';

export interface PrintOptions {
  /**
   * Indentation depth for `JSON.stringify()` when printing objects.
   *
   * @default 2
   */
  depth?: number;
  /**
   * Which section of the IR to print. Use 'all' to print every section.
   *
   * @default 'all'
   */
  section?: keyof IR.Model | 'all';
  /**
   * How much detail to print.
   *
   * - `summary` → only keys, names, operationIds, status codes
   * - `full` → dump full JSON structures
   *
   * @default 'summary'
   */
  verbosity?: 'full' | 'summary';
}

const indent = (level: number) => '  '.repeat(level);

const log = (message: string, level?: number) => console.log(`${indent(level ?? 0)}${message}`);

const print = (ir: IR.Model, options: PrintOptions = {}) => {
  const { depth = 2, section = 'all', verbosity = 'summary' } = options;

  const printObject = (
    obj: unknown,
    level: number,
    kind: 'responses' | 'requestBody' | 'schema' | 'generic' = 'generic',
  ) => {
    if (verbosity === 'summary' && obj && typeof obj === 'object') {
      if (kind === 'responses') {
        const count = Object.keys(obj).length;
        const noun = count === 1 ? 'code' : 'codes';
        log(`responses: ${styleText('yellow', `${count} ${noun}`)}`, level);
      } else if (kind === 'requestBody') {
        log(`requestBody: ${Object.keys(obj).join(', ')}`, level);
      } else if (kind === 'schema') {
        log(`schema keys: ${Object.keys(obj).join(', ')}`, level);
      } else {
        log(`keys: ${Object.keys(obj).join(', ')}`, level);
      }
    } else {
      log(JSON.stringify(obj, null, depth), level);
    }
  };

  const printPathItem = (
    key: string,
    item: IR.PathItemObject | IR.ReferenceObject,
    base: number = 1,
  ) => {
    if ('$ref' in item) {
      log(`${styleText('cyan', key)} is a $ref → ${styleText('yellow', item.$ref)}`, base);
      return;
    }

    for (const method of Object.keys(item) as Array<keyof IR.PathItemObject>) {
      if (!httpMethods.includes(method)) continue;

      const operation = item[method]!;
      log(
        `${styleText('green', method.toUpperCase())} ${styleText('cyan', key)} (${styleText('magenta', operation.operationId ?? '')})`,
        base,
      );

      if (operation.body) printObject(operation.body, base + 1, 'requestBody');
      if (operation.responses) printObject(operation.responses, base + 1, 'responses');
    }
  };

  const sections =
    section === 'all' ? (Object.keys(ir) as unknown as ReadonlyArray<keyof IR.Model>) : [section];

  for (const section of sections) {
    switch (section) {
      case 'components':
        if (ir.components?.schemas) {
          log(`Components: ${Object.keys(ir.components.schemas).length} schemas`);
          for (const [, schema] of Object.entries(ir.components.schemas)) {
            printObject(schema, 1, 'schema');
          }
        }
        break;
      case 'paths': {
        const paths = ir.paths || {};
        log(`paths (${Object.keys(paths).length} items):`);
        for (const [path, item] of Object.entries(paths)) {
          printPathItem(path, item);
        }
        break;
      }
      case 'servers':
        break;
      case 'webhooks': {
        const webhooks = ir.webhooks || {};
        log(`webhooks (${Object.keys(webhooks).length} items):`);
        for (const [path, item] of Object.entries(webhooks)) {
          printPathItem(path, item);
        }
        break;
      }
    }
  }
};

export const ir = {
  print,
} as const;
