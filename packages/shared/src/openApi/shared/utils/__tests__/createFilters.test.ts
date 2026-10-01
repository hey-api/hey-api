import { Logger } from '@hey-api/codegen-core';
import type { OpenAPIV3_1 } from '@hey-api/spec-types';

import { createFilters } from '../filter';

function createSpec(): OpenAPIV3_1.Document {
  return {
    info: { title: 'Test', version: '1' },
    openapi: '3.1.0',
    paths: {},
    webhooks: {
      newPet: {
        post: { responses: { '200': { description: 'ok' } } },
      },
    },
  };
}

describe('createFilters', () => {
  it('matches a regex operations include filter against a webhook operation', () => {
    const filters = createFilters(
      { operations: { include: ['/^POST newPet$/'] } },
      createSpec(),
      new Logger(),
    );

    expect(filters.operations.include.has('operation/POST newPet')).toBe(true);
  });

  it('matches a regex operations exclude filter against a webhook operation', () => {
    const filters = createFilters(
      { operations: { exclude: ['/^POST newPet$/'] } },
      createSpec(),
      new Logger(),
    );

    expect(filters.operations.exclude.has('operation/POST newPet')).toBe(true);
  });

  it('does not match a webhook operation against an unrelated regex filter', () => {
    const filters = createFilters(
      { operations: { include: ['/^GET nothing$/'] } },
      createSpec(),
      new Logger(),
    );

    expect(filters.operations.include.has('operation/POST newPet')).toBe(false);
  });
});
