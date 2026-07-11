import path from 'node:path';

import type { UserConfig } from '../index';
import { createClient } from '../index';

const baseOperation = {
  operationId: 'getItems',
  responses: {
    200: {
      description: 'ok',
    },
  },
};

const baseSpec = {
  info: { title: 'oRPC plugin test', version: '1.0.0' },
  openapi: '3.1.0',
  paths: {
    '/items': {
      get: baseOperation,
    },
  },
};

const queryStyleParameters = [
  {
    in: 'query',
    name: 'ids',
    schema: {
      items: { type: 'string' },
      type: 'array',
    },
  },
  {
    explode: false,
    in: 'query',
    name: 'tags',
    schema: {
      items: { type: 'string' },
      type: 'array',
    },
    style: 'form',
  },
  {
    in: 'query',
    name: 'names',
    schema: {
      items: { type: 'string' },
      type: 'array',
    },
    style: 'spaceDelimited',
  },
  {
    in: 'query',
    name: 'codes',
    schema: {
      items: { type: 'string' },
      type: 'array',
    },
    style: 'pipeDelimited',
  },
  {
    explode: false,
    in: 'query',
    name: 'filters',
    schema: {
      additionalProperties: { type: 'string' },
      type: 'object',
    },
    style: 'form',
  },
  {
    in: 'query',
    name: 'spaceFilters',
    schema: {
      additionalProperties: { type: 'string' },
      type: 'object',
    },
    style: 'spaceDelimited',
  },
  {
    in: 'query',
    name: 'pipeFilters',
    schema: {
      additionalProperties: { type: 'string' },
      type: 'object',
    },
    style: 'pipeDelimited',
  },
  {
    explode: true,
    in: 'query',
    name: 'facets',
    schema: {
      additionalProperties: { type: 'string' },
      type: 'object',
    },
    style: 'form',
  },
  {
    in: 'query',
    name: 'category',
    schema: {
      type: 'string',
    },
  },
  {
    explode: false,
    in: 'query',
    name: 'keyword',
    schema: {
      type: 'string',
    },
    style: 'form',
  },
  {
    in: 'query',
    name: 'refIds',
    schema: {
      $ref: '#/components/schemas/Ids',
    },
  },
];

function queryStyleSpec() {
  return {
    ...baseSpec,
    components: {
      schemas: {
        Ids: {
          items: { type: 'string' },
          type: 'array',
        },
      },
    },
    paths: {
      '/items': {
        get: {
          ...baseOperation,
          parameters: queryStyleParameters,
        },
      },
    },
  };
}

async function renderOrpc(
  userConfig: Pick<UserConfig, 'input' | 'plugins'>,
  options?: {
    cwd?: string;
  },
): Promise<string> {
  const cwd = process.cwd();

  if (options?.cwd) {
    process.chdir(options.cwd);
  }

  try {
    const [context] = await createClient({
      dryRun: true,
      logs: { level: 'silent' },
      output: {
        clean: false,
        path: 'out',
      },
      ...userConfig,
    });

    const outputs = context?.gen.render() ?? [];
    const file = outputs.find((output) => output.path.endsWith('orpc.gen.ts'));
    expect(
      file,
      `Expected orpc.gen.ts in ${outputs.map((output) => output.path).join(', ')}`,
    ).toBeDefined();

    return file!.content;
  } finally {
    process.chdir(cwd);
  }
}

describe('oRPC plugin', () => {
  it('generates oRPC v2 OpenAPI metadata by default', async () => {
    const content = await renderOrpc({
      input: baseSpec,
      plugins: [{ compatibilityVersion: '2', name: 'orpc', validator: false }],
    });

    expect(content).toContain("import { oc } from '@orpc/contract';");
    expect(content).toContain("import { openapi } from '@orpc/openapi';");
    expect(content).toContain('export const getItems = oc.meta(openapi({');
    expect(content).not.toContain('oc.route(');
    expect(content).not.toContain('queryStyles');
  });

  it('infers oRPC v1 output from installed @orpc/contract v1', async () => {
    const content = await renderOrpc(
      {
        input: baseSpec,
        plugins: [{ compatibilityVersion: '1', name: 'orpc', validator: false }],
      },
      {
        cwd: path.resolve(import.meta.dirname, '../../../openapi-ts-tests/orpc/v1'),
      },
    );

    expect(content).toContain("import { oc } from '@orpc/contract';");
    expect(content).toContain('export const getItems = oc.route({');
    expect(content).not.toContain("import { openapi } from '@orpc/openapi';");
    expect(content).not.toContain('queryStyles');
  });

  it('infers oRPC v2 query styles from OpenAPI serialization metadata', async () => {
    const content = await renderOrpc({
      input: queryStyleSpec(),
      plugins: [{ compatibilityVersion: '2', name: 'orpc', validator: false }],
    });

    expect(content).toContain('queryStyles: {');
    expect(content).toContain("codes: 'pipe-delimited-array'");
    expect(content).toContain("filters: 'comma-delimited-object'");
    expect(content).toContain("ids: 'array'");
    expect(content).toContain("keyword: 'primitive'");
    expect(content).toContain("names: 'space-delimited-array'");
    expect(content).toContain("pipeFilters: 'pipe-delimited-object'");
    expect(content).toContain("refIds: 'array'");
    expect(content).toContain("spaceFilters: 'space-delimited-object'");
    expect(content).toContain("tags: 'comma-delimited-array'");
    expect(content).not.toContain('category:');
    expect(content).not.toContain('facets:');
  });

  it('omits query styles when inference is disabled', async () => {
    const content = await renderOrpc({
      input: queryStyleSpec(),
      plugins: [
        {
          compatibilityVersion: '2',
          inferQueryStyles: false,
          name: 'orpc',
          validator: false,
        },
      ],
    });

    expect(content).not.toContain('queryStyles');
  });
});
