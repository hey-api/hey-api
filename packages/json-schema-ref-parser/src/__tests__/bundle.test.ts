import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { $RefParser } from '..';
import { getSpecsPath } from './utils';

const getSnapshotsPath = () => path.join(import.meta.dirname, '__snapshots__');
const getTempSnapshotsPath = () => path.join(import.meta.dirname, '.gen', 'snapshots');

const writeJsonFile = (filePath: string, value: unknown) => {
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2));
};

/**
 * Helper function to compare a bundled schema with a snapshot file.
 * Handles writing the schema to a temp file and comparing with the snapshot.
 *
 * @param schema - The bundled schema to compare
 * @param snapshotName - The name of the snapshot file (e.g., 'circular-ref-with-description.json')
 */
const expectBundledSchemaToMatchSnapshot = async (schema: unknown, snapshotName: string) => {
  const outputPath = path.join(getTempSnapshotsPath(), snapshotName);
  const snapshotPath = path.join(getSnapshotsPath(), snapshotName);

  // Ensure directory exists
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });

  // Write the bundled result
  const content = JSON.stringify(schema, null, 2);
  fs.writeFileSync(outputPath, content);

  // Compare with snapshot
  await expect(content).toMatchFileSnapshot(snapshotPath);
};

describe('bundle', () => {
  it('handles circular reference with description', async () => {
    const refParser = new $RefParser();
    const pathOrUrlOrSchema = path.join(
      getSpecsPath(),
      'json-schema-ref-parser',
      'circular-ref-with-description.json',
    );
    const schema = await refParser.bundle({ pathOrUrlOrSchema });

    await expectBundledSchemaToMatchSnapshot(schema, 'circular-ref-with-description.json');
  });

  it('emits decoded internal refs for generic component names', async () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'json-schema-ref-parser-'));

    try {
      const rootPath = path.join(tempDir, 'root.json');

      writeJsonFile(rootPath, {
        components: {
          schemas: {
            ClientResponse: {
              properties: {
                id: {
                  type: 'string',
                },
              },
              type: 'object',
            },
            'PaginatedListItems<ClientResponse>': {
              properties: {
                items: {
                  items: {
                    $ref: '#/components/schemas/ClientResponse',
                  },
                  type: 'array',
                },
              },
              type: 'object',
            },
          },
        },
        info: {
          title: 'Test API',
          version: '1.0.0',
        },
        openapi: '3.0.0',
        paths: {
          '/clients': {
            get: {
              responses: {
                '200': {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/PaginatedListItems<ClientResponse>',
                      },
                    },
                  },
                  description: 'ok',
                },
              },
            },
          },
        },
      });

      const refParser = new $RefParser();
      const schema = (await refParser.bundle({ pathOrUrlOrSchema: rootPath })) as any;

      expect(
        schema.paths['/clients'].get.responses['200'].content['application/json'].schema.$ref,
      ).toBe('#/components/schemas/PaginatedListItems<ClientResponse>');

      const bundledJson = JSON.stringify(schema);
      expect(bundledJson).not.toContain('PaginatedListItems%3CClientResponse%3E');
    } finally {
      fs.rmSync(tempDir, { force: true, recursive: true });
    }
  });

  it('emits decoded refs for external schemas with generic and unicode names', async () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'json-schema-ref-parser-'));

    try {
      const externalPath = path.join(tempDir, 'external.json');
      const rootPath = path.join(tempDir, 'root.json');

      writeJsonFile(externalPath, {
        components: {
          schemas: {
            'PaginatedList<ClientItem>': {
              description: 'generic schema',
              properties: {
                next: {
                  $ref: '#/components/schemas/PaginatedList<ClientItem>',
                },
              },
              type: 'object',
            },
            Überschrift: {
              description: 'unicode schema',
              properties: {
                next: {
                  $ref: '#/components/schemas/Überschrift',
                },
              },
              type: 'object',
            },
          },
        },
      });

      writeJsonFile(rootPath, {
        info: {
          title: 'Test API',
          version: '1.0.0',
        },
        openapi: '3.0.0',
        paths: {
          '/generic': {
            get: {
              responses: {
                '200': {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: 'external.json#/components/schemas/PaginatedList<ClientItem>',
                      },
                    },
                  },
                  description: 'ok',
                },
              },
            },
          },
          '/unicode': {
            get: {
              responses: {
                '200': {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: 'external.json#/components/schemas/Überschrift',
                      },
                    },
                  },
                  description: 'ok',
                },
              },
            },
          },
        },
      });

      const refParser = new $RefParser();
      const schema = (await refParser.bundle({ pathOrUrlOrSchema: rootPath })) as any;
      const schemas = schema.components.schemas as Record<string, any>;

      const findSchemaByDescription = (description: string) =>
        Object.entries(schemas).find(([, value]) => value.description === description);

      const genericSchema = findSchemaByDescription('generic schema');
      const unicodeSchema = findSchemaByDescription('unicode schema');

      expect(genericSchema).toBeDefined();
      expect(unicodeSchema).toBeDefined();

      const [genericName, genericValue] = genericSchema!;
      const [unicodeName, unicodeValue] = unicodeSchema!;

      expect(genericValue.properties.next.$ref).toBe(`#/components/schemas/${genericName}`);
      expect(unicodeValue.properties.next.$ref).toBe(`#/components/schemas/${unicodeName}`);

      const bundledJson = JSON.stringify(schema);
      expect(bundledJson).not.toContain('PaginatedList%3CClientItem%3E');
      expect(bundledJson).not.toContain('%C3%9Cberschrift');
    } finally {
      fs.rmSync(tempDir, { force: true, recursive: true });
    }
  });

  it('names whole-file $refs after the source filename, not "root"', async () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'json-schema-ref-parser-'));

    try {
      const agentTypePath = path.join(tempDir, 'AgentType.json');
      const userTypePath = path.join(tempDir, 'UserType.json');
      const rootPath = path.join(tempDir, 'root.json');

      // Each external file IS the schema — no #/components/schemas/... fragment.
      writeJsonFile(agentTypePath, {
        properties: {
          kind: { type: 'string' },
        },
        type: 'object',
      });

      writeJsonFile(userTypePath, {
        properties: {
          name: { type: 'string' },
        },
        type: 'object',
      });

      writeJsonFile(rootPath, {
        info: { title: 'Test API', version: '1.0.0' },
        openapi: '3.0.0',
        paths: {
          '/agents': {
            get: {
              responses: {
                '200': {
                  content: {
                    'application/json': {
                      schema: { $ref: 'AgentType.json' },
                    },
                  },
                  description: 'ok',
                },
              },
            },
          },
          '/users': {
            get: {
              responses: {
                '200': {
                  content: {
                    'application/json': {
                      schema: { $ref: 'UserType.json' },
                    },
                  },
                  description: 'ok',
                },
              },
            },
          },
        },
      });

      const refParser = new $RefParser();
      const schema = (await refParser.bundle({ pathOrUrlOrSchema: rootPath })) as any;
      const schemas = (schema.components?.schemas ?? {}) as Record<string, any>;
      const schemaNames = Object.keys(schemas);

      // The bug: whole-file refs are named "root", "AgentType_root", etc.
      // (PascalCased downstream into "Root", "AgentTypeRoot".)
      expect(schemaNames).not.toContain('root');
      expect(schemaNames.every((name) => !/root/i.test(name))).toBe(true);

      // Expected: schemas named after the source filenames.
      expect(schemas.AgentType).toBeDefined();
      expect(schemas.UserType).toBeDefined();

      expect(
        schema.paths['/agents'].get.responses['200'].content['application/json'].schema.$ref,
      ).toBe('#/components/schemas/AgentType');
      expect(
        schema.paths['/users'].get.responses['200'].content['application/json'].schema.$ref,
      ).toBe('#/components/schemas/UserType');
    } finally {
      fs.rmSync(tempDir, { force: true, recursive: true });
    }
  });

  it('bundles multiple references to the same file correctly', async () => {
    const refParser = new $RefParser();
    const pathOrUrlOrSchema = path.join(
      getSpecsPath(),
      'json-schema-ref-parser',
      'multiple-refs.json',
    );
    const schema = await refParser.bundle({ pathOrUrlOrSchema });

    await expectBundledSchemaToMatchSnapshot(schema, 'multiple-refs.json');
  });

  it('hoists sibling schemas from external files', async () => {
    const refParser = new $RefParser();
    const pathOrUrlOrSchema = path.join(
      getSpecsPath(),
      'json-schema-ref-parser',
      'main-with-external-siblings.json',
    );
    const schema = await refParser.bundle({ pathOrUrlOrSchema });

    await expectBundledSchemaToMatchSnapshot(schema, 'main-with-external-siblings.json');
  });

  it('hoists sibling schemas from YAML files with versioned names (Redfish-like)', async () => {
    const refParser = new $RefParser();
    const pathOrUrlOrSchema = path.join(
      getSpecsPath(),
      'json-schema-ref-parser',
      'redfish-like.yaml',
    );
    const schema = await refParser.bundle({ pathOrUrlOrSchema });

    await expectBundledSchemaToMatchSnapshot(schema, 'redfish-like.json');
  });

  describe('sibling schema resolution', () => {
    const specsDir = path.join(getSpecsPath(), 'json-schema-ref-parser');

    const findSchemaByValue = (
      schemas: Record<string, any>,
      predicate: (value: any) => boolean,
    ): [string, any] | undefined => {
      for (const [name, value] of Object.entries(schemas)) {
        if (predicate(value)) {
          return [name, value];
        }
      }
      return undefined;
    };

    it('hoists sibling schemas through a bare $ref wrapper chain', async () => {
      const refParser = new $RefParser();
      const pathOrUrlOrSchema = path.join(specsDir, 'sibling-schema-root.json');
      const schema = (await refParser.bundle({ pathOrUrlOrSchema })) as any;

      expect(schema.components).toBeDefined();
      expect(schema.components.schemas).toBeDefined();

      const schemas = schema.components.schemas;

      const mainSchema = findSchemaByValue(
        schemas,
        (v) => v.type === 'object' && v.properties?.name,
      );
      expect(mainSchema).toBeDefined();
      const [mainName, mainValue] = mainSchema!;
      expect(mainValue.type).toBe('object');
      expect(mainValue.properties.name).toEqual({ type: 'string' });

      const enumSchema = findSchemaByValue(
        schemas,
        (v) => Array.isArray(v.enum) && v.enum.includes('active'),
      );
      expect(enumSchema).toBeDefined();
      const [enumName, enumValue] = enumSchema!;
      expect(enumValue.type).toBe('string');
      expect(enumValue.enum).toEqual(['active', 'inactive', 'pending']);

      // The main schema's status property should reference the hoisted enum
      expect(mainValue.properties.status.$ref).toBe(`#/components/schemas/${enumName}`);

      // The root path's schema ref should point to the hoisted main schema
      const rootRef = schema.paths['/test'].get.responses['200'].content['application/json'].schema;
      expect(rootRef.$ref).toBe(`#/components/schemas/${mainName}`);
    });

    it('hoists sibling schemas through an extended $ref wrapper chain', async () => {
      const refParser = new $RefParser();
      const pathOrUrlOrSchema = path.join(specsDir, 'sibling-schema-extended-root.json');
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      try {
        const schema = (await refParser.bundle({ pathOrUrlOrSchema })) as any;

        expect(schema.components).toBeDefined();
        expect(schema.components.schemas).toBeDefined();

        const schemas = schema.components.schemas;

        // The main schema should be hoisted (with the extra description merged in)
        const mainSchema = findSchemaByValue(
          schemas,
          (v) =>
            v.description === 'Wrapper that extends the versioned schema' ||
            (v.type === 'object' && v.properties?.name),
        );
        expect(mainSchema).toBeDefined();

        // The sibling enum must also be hoisted (this was the bug — it was lost before the fix)
        const enumSchema = findSchemaByValue(
          schemas,
          (v) => Array.isArray(v.enum) && v.enum.includes('active'),
        );
        expect(enumSchema).toBeDefined();
        const [, enumValue] = enumSchema!;
        expect(enumValue.type).toBe('string');
        expect(enumValue.enum).toEqual(['active', 'inactive', 'pending']);

        // No "Skipping unresolvable $ref" warnings should have been emitted
        const unresolvableWarnings = warnSpy.mock.calls.filter(
          (args) => typeof args[0] === 'string' && args[0].includes('Skipping unresolvable $ref'),
        );
        expect(unresolvableWarnings).toHaveLength(0);
      } finally {
        warnSpy.mockRestore();
      }
    });

    it('hoists sibling schemas from a direct reference (no wrapper)', async () => {
      const refParser = new $RefParser();
      const pathOrUrlOrSchema = path.join(specsDir, 'sibling-schema-direct-root.json');
      const schema = (await refParser.bundle({ pathOrUrlOrSchema })) as any;

      expect(schema.components).toBeDefined();
      expect(schema.components.schemas).toBeDefined();

      const schemas = schema.components.schemas;

      const mainSchema = findSchemaByValue(
        schemas,
        (v) => v.type === 'object' && v.properties?.name,
      );
      expect(mainSchema).toBeDefined();

      const enumSchema = findSchemaByValue(
        schemas,
        (v) => Array.isArray(v.enum) && v.enum.includes('active'),
      );
      expect(enumSchema).toBeDefined();
      const [enumName, enumValue] = enumSchema!;
      expect(enumValue.enum).toEqual(['active', 'inactive', 'pending']);

      const [, mainValue] = mainSchema!;
      expect(mainValue.properties.status.$ref).toBe(`#/components/schemas/${enumName}`);
    });

    it('hoists multiple sibling schemas through an extended wrapper', async () => {
      const refParser = new $RefParser();
      const pathOrUrlOrSchema = path.join(specsDir, 'sibling-schema-multi-root.json');
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      try {
        const schema = (await refParser.bundle({ pathOrUrlOrSchema })) as any;

        expect(schema.components).toBeDefined();
        expect(schema.components.schemas).toBeDefined();

        const schemas = schema.components.schemas;

        const mainSchema = findSchemaByValue(
          schemas,
          (v) => v.type === 'object' && v.properties?.health,
        );
        expect(mainSchema).toBeDefined();

        const statusEnum = findSchemaByValue(
          schemas,
          (v) => Array.isArray(v.enum) && v.enum.includes('enabled'),
        );
        expect(statusEnum).toBeDefined();
        expect(statusEnum![1].enum).toEqual(['enabled', 'disabled', 'standby']);

        const healthEnum = findSchemaByValue(
          schemas,
          (v) => Array.isArray(v.enum) && v.enum.includes('ok'),
        );
        expect(healthEnum).toBeDefined();
        expect(healthEnum![1].enum).toEqual(['ok', 'warning', 'critical']);

        const [, mainValue] = mainSchema!;
        expect(mainValue.properties.status.$ref).toBe(`#/components/schemas/${statusEnum![0]}`);
        expect(mainValue.properties.health.$ref).toBe(`#/components/schemas/${healthEnum![0]}`);

        const unresolvableWarnings = warnSpy.mock.calls.filter(
          (args) => typeof args[0] === 'string' && args[0].includes('Skipping unresolvable $ref'),
        );
        expect(unresolvableWarnings).toHaveLength(0);
      } finally {
        warnSpy.mockRestore();
      }
    });

    it('handles multiple external files with same-named sibling schemas', async () => {
      const refParser = new $RefParser();
      const pathOrUrlOrSchema = path.join(specsDir, 'sibling-schema-collision-root.json');
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      try {
        const schema = (await refParser.bundle({ pathOrUrlOrSchema })) as any;

        expect(schema.components).toBeDefined();
        expect(schema.components.schemas).toBeDefined();

        const schemas = schema.components.schemas;
        const schemaNames = Object.keys(schemas);

        const mainSchemaKey = schemaNames.find((name) => name.includes('MainSchema'));
        const otherSchemaKey = schemaNames.find((name) => name.includes('OtherSchema'));

        expect(mainSchemaKey).toBeDefined();
        expect(otherSchemaKey).toBeDefined();

        const statusSchemas = schemaNames.filter((name) => name.includes('Status'));
        expect(statusSchemas.length).toBeGreaterThanOrEqual(2);

        const statusValues = statusSchemas.map((name) => schemas[name]);
        const stringStatus = statusValues.find((v: any) => v.type === 'string');
        const integerStatus = statusValues.find((v: any) => v.type === 'integer');

        expect(stringStatus).toBeDefined();
        expect(integerStatus).toBeDefined();
        expect(stringStatus!.enum).toEqual(['active', 'inactive']);
        expect(integerStatus!.enum).toEqual([0, 1, 2]);

        const mainSchemaValue = schemas[mainSchemaKey!];
        const mainStatusRef = mainSchemaValue.properties.status.$ref;
        expect(mainStatusRef).toMatch(/^#\/components\/schemas\/.*Status/);

        const referencedStatus = schemas[mainStatusRef.replace('#/components/schemas/', '')];
        expect(referencedStatus).toBeDefined();
        expect(referencedStatus.type).toBe('string');
        expect(referencedStatus.enum).toEqual(['active', 'inactive']);

        const otherSchemaValue = schemas[otherSchemaKey!];
        const otherStatusRef = otherSchemaValue.properties.code.$ref;
        expect(otherStatusRef).toMatch(/^#\/components\/schemas\/.*Status/);

        const referencedOtherStatus = schemas[otherStatusRef.replace('#/components/schemas/', '')];
        expect(referencedOtherStatus).toBeDefined();
        expect(referencedOtherStatus.type).toBe('integer');
        expect(referencedOtherStatus.enum).toEqual([0, 1, 2]);

        const unresolvableWarnings = warnSpy.mock.calls.filter(
          (args) => typeof args[0] === 'string' && args[0].includes('Skipping unresolvable $ref'),
        );
        expect(unresolvableWarnings).toHaveLength(0);
      } finally {
        warnSpy.mockRestore();
      }
    });
  });

  describe('mergeMany', () => {
    it('resolves external $refs that point to the first input without crashing', async () => {
      // regression test for https://github.com/hey-api/hey-api/issues/4146
      const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'json-schema-ref-parser-'));
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      try {
        const secondaryPath = path.join(tempDir, 'secondary.yaml');
        const primaryPath = path.join(tempDir, 'primary.yaml');

        writeJsonFile(secondaryPath, {
          components: {
            schemas: {
              Author: {
                properties: {
                  name: {
                    type: 'string',
                  },
                },
                type: 'object',
              },
              Post: {
                properties: {
                  author: {
                    $ref: '#/components/schemas/Author',
                  },
                  title: {
                    type: 'string',
                  },
                },
                type: 'object',
              },
            },
          },
          openapi: '3.0.0',
          paths: {
            '/posts': {
              get: {
                responses: {
                  '200': {
                    content: {
                      'application/json': {
                        schema: {
                          $ref: '#/components/schemas/Post',
                        },
                      },
                    },
                    description: 'ok',
                  },
                },
              },
            },
          },
        });

        writeJsonFile(primaryPath, {
          openapi: '3.0.0',
          paths: {
            '/comments': {
              get: {
                responses: {
                  '200': {
                    content: {
                      'application/json': {
                        schema: {
                          $ref: 'secondary.yaml#/components/schemas/Post/properties/author',
                        },
                      },
                    },
                    description: 'ok',
                  },
                },
              },
            },
          },
        });

        const refParser = new $RefParser();
        const merged = (await refParser.bundleMany({
          pathOrUrlOrSchemas: [secondaryPath, primaryPath],
        })) as any;

        expect(merged.paths['/posts']).toBeDefined();
        expect(merged.paths['/comments']).toBeDefined();

        const authorRef =
          merged.paths['/comments'].get.responses['200'].content['application/json'].schema.$ref;
        expect(authorRef).toMatch(/^#\/components\/schemas\//);
        expect(merged.components.schemas[authorRef.replace('#/components/schemas/', '')]).toEqual({
          properties: {
            name: {
              type: 'string',
            },
          },
          type: 'object',
        });

        const unresolvableWarnings = warnSpy.mock.calls.filter(
          (args) => typeof args[0] === 'string' && args[0].includes('Skipping unresolvable $ref'),
        );
        expect(unresolvableWarnings).toHaveLength(0);
      } finally {
        warnSpy.mockRestore();
        fs.rmSync(tempDir, { force: true, recursive: true });
      }
    });

    it('merges paths with non-conflicting methods under the same path', async () => {
      const refParser = new $RefParser();
      const spec1 = {
        info: { title: 'Spec 1', version: '1.0.0' },
        paths: {
          '/pet/{petId}': {
            post: {
              operationId: 'updatePetWithForm',
              responses: { '405': { description: 'Invalid input' } },
            },
          },
        },
        swagger: '2.0',
      };
      const spec2 = {
        info: { title: 'Spec 2', version: '1.0.0' },
        paths: {
          '/pet/{petId}': {
            delete: {
              operationId: 'deletePet',
              responses: {
                '400': { description: 'Invalid ID supplied' },
                '404': { description: 'Pet not found' },
              },
            },
          },
        },
        swagger: '2.0',
      };

      const merged = (await refParser.bundleMany({ pathOrUrlOrSchemas: [spec1, spec2] })) as any;

      // Both methods should be under the same path (no prefix added)
      expect(merged.paths['/pet/{petId}']).toBeDefined();
      expect(merged.paths['/pet/{petId}'].post).toBeDefined();
      expect(merged.paths['/pet/{petId}'].delete).toBeDefined();

      // No prefixed path should be created
      const pathKeys = Object.keys(merged.paths);
      expect(pathKeys).toHaveLength(1);
    });

    it('adds prefix to path when HTTP methods conflict', async () => {
      const refParser = new $RefParser();
      const spec1 = {
        info: { title: 'Spec 1', version: '1.0.0' },
        paths: {
          '/pet/{petId}': {
            get: {
              operationId: 'getPetById',
              responses: { '200': { description: 'OK' } },
            },
          },
        },
        swagger: '2.0',
      };
      const spec2 = {
        info: { title: 'Spec 2', version: '1.0.0' },
        paths: {
          '/pet/{petId}': {
            get: {
              operationId: 'getPet',
              responses: { '200': { description: 'Success' } },
            },
          },
        },
        swagger: '2.0',
      };

      const merged = (await refParser.bundleMany({ pathOrUrlOrSchemas: [spec1, spec2] })) as any;

      // The conflicting path should be prefixed
      const pathKeys = Object.keys(merged.paths);
      expect(pathKeys).toHaveLength(2);
      expect(merged.paths['/pet/{petId}']).toBeDefined();
      const prefixedKey = pathKeys.find((k) => k !== '/pet/{petId}');
      expect(prefixedKey).toBeDefined();
      expect(merged.paths[prefixedKey!].get).toBeDefined();
    });

    it('merges Swagger 2.0 definitions from multiple inputs', async () => {
      // regression test for https://github.com/hey-api/hey-api/issues/4112
      const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'json-schema-ref-parser-'));

      try {
        const feedsPath = path.join(tempDir, 'feeds.json');
        const ordersPath = path.join(tempDir, 'orders.json');

        writeJsonFile(feedsPath, {
          definitions: {
            Order: {
              properties: {
                id: {
                  type: 'integer',
                },
              },
              type: 'object',
            },
          },
          info: { title: 'Feeds', version: '1.0.0' },
          paths: {
            '/feeds': {
              get: {
                operationId: 'getFeeds',
                responses: {
                  '200': {
                    description: 'OK',
                    schema: {
                      $ref: '#/definitions/Order',
                    },
                  },
                },
              },
            },
          },
          swagger: '2.0',
        });

        writeJsonFile(ordersPath, {
          definitions: {
            Order: {
              properties: {
                name: {
                  type: 'string',
                },
              },
              type: 'object',
            },
            OrderList: {
              properties: {
                items: {
                  items: {
                    $ref: '#/definitions/Order',
                  },
                  type: 'array',
                },
              },
              type: 'object',
            },
          },
          info: { title: 'Orders', version: '1.0.0' },
          paths: {
            '/orderList': {
              get: {
                operationId: 'getOrderList',
                responses: {
                  '200': {
                    description: 'OK',
                    schema: {
                      $ref: '#/definitions/OrderList',
                    },
                  },
                },
              },
            },
          },
          swagger: '2.0',
        });

        const refParser = new $RefParser();
        const merged = (await refParser.bundleMany({
          pathOrUrlOrSchemas: [feedsPath, ordersPath],
        })) as any;

        expect(merged.swagger).toBe('2.0');
        expect(merged.definitions).toBeUndefined();
        expect(merged.paths['/feeds']).toBeDefined();
        expect(merged.paths['/orderList']).toBeDefined();

        const schemas = merged.components.schemas as Record<string, any>;
        expect(schemas.feeds_Order).toBeDefined();
        expect(schemas.orders_Order).toBeDefined();
        expect(schemas.orders_OrderList).toBeDefined();

        // Internal $ref to a definition should be rewritten to the prefixed component schema
        expect(schemas.orders_OrderList.properties.items.items.$ref).toBe(
          '#/components/schemas/orders_Order',
        );
        expect(merged.paths['/feeds'].get.responses['200'].schema.$ref).toBe(
          '#/components/schemas/feeds_Order',
        );
        expect(merged.paths['/orderList'].get.responses['200'].schema.$ref).toBe(
          '#/components/schemas/orders_OrderList',
        );
      } finally {
        fs.rmSync(tempDir, { force: true, recursive: true });
      }
    });
  });
});
