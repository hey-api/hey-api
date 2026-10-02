import type { OpenApi } from '../../../types';
import { patchOpenApiSpec } from '../patch';

const specMetadataV2: Pick<OpenApi.V2_0_X, 'info' | 'paths' | 'swagger'> = {
  info: {
    title: 'Test API',
    version: '1.0.0',
  },
  paths: {},
  swagger: '2.0',
};

const specMetadataV3: Pick<OpenApi.V3_1_X, 'info' | 'openapi'> = {
  info: {
    title: 'Test API',
    version: '1.0.0',
  },
  openapi: '3.1.0',
};

describe('patchOpenApiSpec', () => {
  describe('patch.input', () => {
    describe('OpenAPI v3', () => {
      it('calls patch.input function before other patches', async () => {
        const inputFn = vi.fn();
        const metaFn = vi.fn();
        const spec: OpenApi.V3_1_X = {
          ...specMetadataV3,
        };

        await patchOpenApiSpec({
          patchOptions: {
            input: inputFn,
            meta: metaFn,
          },
          spec,
        });

        // Both should be called
        expect(inputFn).toHaveBeenCalledOnce();
        expect(inputFn).toHaveBeenCalledWith(spec);
        expect(metaFn).toHaveBeenCalledOnce();
      });

      it('allows bulk creation of component parameters', async () => {
        const spec: OpenApi.V3_1_X = {
          ...specMetadataV3,
          paths: {},
        };

        await patchOpenApiSpec({
          patchOptions: {
            input: (spec) => {
              if ('openapi' in spec) {
                if (!spec.components) spec.components = {};
                if (!spec.components.parameters) spec.components.parameters = {};
                spec.components.parameters.MyParam = {
                  in: 'query',
                  name: 'myParam',
                  schema: { type: 'string' },
                } as any;
              }
            },
          },
          spec,
        });

        expect(spec.components?.parameters?.MyParam).toEqual({
          in: 'query',
          name: 'myParam',
          schema: { type: 'string' },
        });
      });

      it('allows injecting parameters into multiple operations', async () => {
        const spec: OpenApi.V3_1_X = {
          ...specMetadataV3,
          components: {
            parameters: {
              SharedParam: {
                in: 'query',
                name: 'shared',
                schema: { type: 'string' },
              } as any,
            },
          },
          paths: {
            '/bar': {
              get: {
                responses: {},
              },
            },
            '/baz': {
              post: {
                responses: {},
              },
            },
            '/foo': {
              get: {
                responses: {},
              },
            },
          } as any,
        };

        await patchOpenApiSpec({
          patchOptions: {
            input: (spec) => {
              // Inject parameter into all GET operations
              for (const [, pathItem] of Object.entries(spec.paths ?? {})) {
                if (pathItem?.get) {
                  if (!Array.isArray(pathItem.get.parameters)) {
                    pathItem.get.parameters = [];
                  }
                  (pathItem.get.parameters as any[]).push({
                    $ref: '#/components/parameters/SharedParam',
                  });
                }
              }
            },
          },
          spec,
        });

        expect((spec.paths as any)['/foo'].get.parameters).toEqual([
          { $ref: '#/components/parameters/SharedParam' },
        ]);
        expect((spec.paths as any)['/bar'].get.parameters).toEqual([
          { $ref: '#/components/parameters/SharedParam' },
        ]);
        expect((spec.paths as any)['/baz'].post.parameters).toBeUndefined();
      });

      it('allows complex Redfish-like transformations', async () => {
        const spec: OpenApi.V3_1_X = {
          ...specMetadataV3,
          paths: {
            '/other/path': {
              get: {
                responses: {},
              },
            },
            '/redfish/v1/Chassis': {
              get: {
                responses: {},
              },
            },
            '/redfish/v1/Systems': {
              get: {
                responses: {},
              },
            },
          } as any,
        };

        const QUERY_PARAMS = [
          { description: 'Expand related resources.', key: '$expand' },
          { description: 'Select subset.', key: '$select' },
        ];

        await patchOpenApiSpec({
          patchOptions: {
            input: (spec) => {
              if (!('openapi' in spec)) return;

              // 1. Create component parameters
              if (!spec.components) spec.components = {};
              if (!spec.components.parameters) spec.components.parameters = {};

              for (const param of QUERY_PARAMS) {
                (spec.components.parameters as any)[`Redfish_${param.key}`] = {
                  description: param.description,
                  in: 'query',
                  name: param.key,
                  required: false,
                  schema: { type: 'string' },
                };
              }

              // 2. Inject into Redfish paths
              for (const [path, pathItem] of Object.entries(spec.paths ?? {})) {
                if (!path.startsWith('/redfish/v1')) continue;
                const getOp = pathItem?.get;
                if (!getOp) continue;

                if (!Array.isArray(getOp.parameters)) getOp.parameters = [];
                for (const param of QUERY_PARAMS) {
                  (getOp.parameters as any[]).push({
                    $ref: `#/components/parameters/Redfish_${param.key}`,
                  });
                }
              }
            },
          },
          spec,
        });

        // Verify component parameters were created
        expect(spec.components?.parameters).toHaveProperty('Redfish_$expand');
        expect(spec.components?.parameters).toHaveProperty('Redfish_$select');

        // Verify they were injected into Redfish paths
        expect((spec.paths as any)['/redfish/v1/Systems'].get.parameters).toHaveLength(2);
        expect((spec.paths as any)['/redfish/v1/Chassis'].get.parameters).toHaveLength(2);

        // Verify they were NOT injected into non-Redfish paths
        expect((spec.paths as any)['/other/path'].get.parameters).toBeUndefined();
      });
    });

    describe('OpenAPI v2', () => {
      it('calls patch.input function for v2 specs', async () => {
        const inputFn = vi.fn();
        const spec: OpenApi.V2_0_X = {
          ...specMetadataV2,
        };

        await patchOpenApiSpec({
          patchOptions: {
            input: inputFn,
          },
          spec,
        });

        expect(inputFn).toHaveBeenCalledOnce();
        expect(inputFn).toHaveBeenCalledWith(spec);
      });

      it('allows adding definitions in v2 specs', async () => {
        const spec: OpenApi.V2_0_X = {
          ...specMetadataV2,
        };

        await patchOpenApiSpec({
          patchOptions: {
            input: (spec) => {
              if ('swagger' in spec) {
                if (!spec.definitions) spec.definitions = {};
                spec.definitions.NewSchema = {
                  properties: {
                    id: { type: 'string' },
                  },
                  type: 'object',
                } as any;
              }
            },
          },
          spec,
        });

        expect(spec.definitions?.NewSchema).toEqual({
          properties: {
            id: { type: 'string' },
          },
          type: 'object',
        });
      });
    });
  });

  describe('async patch support', () => {
    describe('patch.input async', () => {
      it('supports async patch.input function', async () => {
        const spec: OpenApi.V3_1_X = {
          ...specMetadataV3,
        };

        let asyncExecuted = false;

        await patchOpenApiSpec({
          patchOptions: {
            input: async (spec) => {
              await new Promise((resolve) => setTimeout(resolve, 10));
              spec.info.title = 'Async Modified';
              asyncExecuted = true;
            },
          },
          spec,
        });

        expect(asyncExecuted).toBe(true);
        expect(spec.info.title).toBe('Async Modified');
      });

      it('supports async operations in patch.input', async () => {
        const spec: OpenApi.V3_1_X = {
          ...specMetadataV3,
          paths: {},
        };

        await patchOpenApiSpec({
          patchOptions: {
            input: async (spec) => {
              // Simulate async operation like fetching data
              await new Promise((resolve) => setTimeout(resolve, 5));
              if ('openapi' in spec) {
                if (!spec.components) spec.components = {};
                if (!spec.components.parameters) spec.components.parameters = {};
                spec.components.parameters.AsyncParam = {
                  in: 'query',
                  name: 'asyncParam',
                  schema: { type: 'string' },
                } as any;
              }
            },
          },
          spec,
        });

        expect(spec.components?.parameters?.AsyncParam).toEqual({
          in: 'query',
          name: 'asyncParam',
          schema: { type: 'string' },
        });
      });
    });

    describe('shorthand async', () => {
      it('supports async shorthand patch function', async () => {
        const spec: OpenApi.V3_1_X = {
          ...specMetadataV3,
        };

        let asyncExecuted = false;

        await patchOpenApiSpec({
          patchOptions: async (spec) => {
            await new Promise((resolve) => setTimeout(resolve, 10));
            spec.info.title = 'Async Shorthand Modified';
            asyncExecuted = true;
          },
          spec,
        });

        expect(asyncExecuted).toBe(true);
        expect(spec.info.title).toBe('Async Shorthand Modified');
      });

      it('supports async operations in shorthand function', async () => {
        const spec: OpenApi.V3_1_X = {
          ...specMetadataV3,
          components: {
            schemas: {
              Foo: {
                type: 'string',
              },
            },
          },
        };

        await patchOpenApiSpec({
          patchOptions: async (spec) => {
            // Simulate async operation
            await new Promise((resolve) => setTimeout(resolve, 5));
            spec.info.description = 'Added via async shorthand';
            if ('openapi' in spec && spec.components?.schemas) {
              (spec.components.schemas as any).Bar = {
                type: 'number',
              };
            }
          },
          spec,
        });

        expect(spec.info.description).toBe('Added via async shorthand');
        expect((spec.components?.schemas as any)?.Bar).toEqual({
          type: 'number',
        });
      });
    });
  });

  describe('shorthand patch function', () => {
    describe('OpenAPI v3', () => {
      it('calls shorthand patch function', async () => {
        const patchFn = vi.fn();
        const spec: OpenApi.V3_1_X = {
          ...specMetadataV3,
        };

        await patchOpenApiSpec({
          patchOptions: patchFn,
          spec,
        });

        expect(patchFn).toHaveBeenCalledOnce();
        expect(patchFn).toHaveBeenCalledWith(spec);
      });

      it('allows modifications through shorthand function', async () => {
        const spec: OpenApi.V3_1_X = {
          ...specMetadataV3,
        };

        await patchOpenApiSpec({
          patchOptions: (spec) => {
            spec.info.title = 'Modified Title';
          },
          spec,
        });

        expect(spec.info.title).toBe('Modified Title');
      });

      it('shorthand function replaces object-based patch configuration', async () => {
        const spec: OpenApi.V3_1_X = {
          ...specMetadataV3,
          components: {
            schemas: {
              Foo: {
                type: 'string',
              },
            },
          },
        };

        // When using shorthand syntax, only the function is called
        // Object properties like meta or schemas would be ignored
        await patchOpenApiSpec({
          patchOptions: (spec) => {
            spec.info.title = 'Shorthand Title';
            // This is the only code that runs
          },
          spec,
        });

        expect(spec.info.title).toBe('Shorthand Title');
        // Schemas remain untouched since no schema patch was applied
        expect(spec.components?.schemas?.Foo).toEqual({ type: 'string' });
      });
    });

    describe('OpenAPI v2', () => {
      it('calls shorthand patch function for v2 specs', async () => {
        const patchFn = vi.fn();
        const spec: OpenApi.V2_0_X = {
          ...specMetadataV2,
        };

        await patchOpenApiSpec({
          patchOptions: patchFn,
          spec,
        });

        expect(patchFn).toHaveBeenCalledOnce();
        expect(patchFn).toHaveBeenCalledWith(spec);
      });

      it('allows modifications through shorthand function in v2', async () => {
        const spec: OpenApi.V2_0_X = {
          ...specMetadataV2,
        };

        await patchOpenApiSpec({
          patchOptions: (spec) => {
            spec.info.title = 'Modified V2 Title';
          },
          spec,
        });

        expect(spec.info.title).toBe('Modified V2 Title');
      });
    });
  });

  describe('edge cases', () => {
    it('does not modify spec', async () => {
      const spec: OpenApi.V3_1_X = {
        ...specMetadataV3,
        components: {
          schemas: {
            Foo: {
              type: 'string',
            },
          },
        },
      };

      await patchOpenApiSpec({
        patchOptions: undefined,
        spec,
      });

      expect(spec).toEqual({
        ...specMetadataV3,
        components: {
          schemas: {
            Foo: {
              type: 'string',
            },
          },
        },
      });
    });

    it('does not modify spec', async () => {
      const spec: OpenApi.V3_1_X = {
        ...specMetadataV3,
        components: {
          schemas: {
            Foo: {
              type: 'string',
            },
          },
        },
      };

      await patchOpenApiSpec({
        patchOptions: {},
        spec,
      });

      expect(spec).toEqual({
        ...specMetadataV3,
        components: {
          schemas: {
            Foo: {
              type: 'string',
            },
          },
        },
      });
    });
  });

  describe('OpenAPI v3', () => {
    it('calls patch function', async () => {
      const fnBar = vi.fn();
      const fnFoo = vi.fn();

      const spec: OpenApi.V3_1_X = {
        ...specMetadataV3,
        components: {
          schemas: {
            Bar: {
              type: 'object',
            },
            Foo: {
              type: 'string',
            },
          },
        },
      };

      await patchOpenApiSpec({
        patchOptions: {
          schemas: {
            Bar: fnBar,
            Foo: fnFoo,
          },
        },
        spec,
      });

      expect(fnBar).toHaveBeenCalledOnce();
      expect(fnBar).toHaveBeenCalledWith({
        type: 'object',
      });
      expect(fnFoo).toHaveBeenCalledOnce();
      expect(fnFoo).toHaveBeenCalledWith({
        type: 'string',
      });
    });

    it('patch function mutates spec', async () => {
      const spec: OpenApi.V3_1_X = {
        ...specMetadataV3,
        components: {
          parameters: {
            Foo: {
              in: 'path',
              name: 'foo',
              schema: {
                type: 'string',
              },
            },
          },
          requestBodies: {
            Foo: {
              content: {
                'application/json': {
                  schema: {
                    type: 'string',
                  },
                },
              },
            },
          },
          responses: {
            Foo: {
              $ref: 'foo',
              content: {
                'application/json': {
                  schema: {
                    type: 'string',
                  },
                },
              },
            },
          },
          schemas: {
            Foo: {
              type: 'string',
            },
          },
        },
      };

      await patchOpenApiSpec({
        patchOptions: {
          parameters: {
            Foo: (schema) => {
              if ('in' in schema) {
                schema.in = 'query';
                if (schema.schema && 'type' in schema.schema) {
                  schema.schema.type = 'number';
                }
              }
            },
          },
          requestBodies: {
            Foo: (schema) => {
              if ('content' in schema) {
                if (
                  schema.content['application/json'] &&
                  schema.content['application/json'].schema
                ) {
                  if ('type' in schema.content['application/json'].schema) {
                    schema.content['application/json'].schema.type = 'number';
                  }
                }
              }
            },
          },
          responses: {
            Foo: (schema) => {
              if ('content' in schema) {
                if (
                  schema.content &&
                  schema.content['application/json'] &&
                  schema.content['application/json'].schema
                ) {
                  if ('type' in schema.content['application/json'].schema) {
                    schema.content['application/json'].schema.type = 'number';
                  }
                }
              }
            },
          },
          schemas: {
            Foo: (schema) => {
              schema.type = 'number';
            },
          },
        },
        spec,
      });

      expect(spec).toEqual({
        ...specMetadataV3,
        components: {
          parameters: {
            Foo: {
              in: 'query',
              name: 'foo',
              schema: {
                type: 'number',
              },
            },
          },
          requestBodies: {
            Foo: {
              content: {
                'application/json': {
                  schema: {
                    type: 'number',
                  },
                },
              },
            },
          },
          responses: {
            Foo: {
              $ref: 'foo',
              content: {
                'application/json': {
                  schema: {
                    type: 'number',
                  },
                },
              },
            },
          },
          schemas: {
            Foo: {
              type: 'number',
            },
          },
        },
      });
    });

    it('handles spec without components', async () => {
      const fn = vi.fn();

      const spec: OpenApi.V3_1_X = {
        ...specMetadataV3,
      };

      await patchOpenApiSpec({
        patchOptions: {
          parameters: {
            Foo: fn,
          },
          requestBodies: {
            Foo: fn,
          },
          responses: {
            Foo: fn,
          },
          schemas: {
            Foo: fn,
          },
        },
        spec,
      });

      expect(fn).not.toHaveBeenCalled();
    });

    it('handles spec without component namespaces', async () => {
      const fn = vi.fn();

      const spec: OpenApi.V3_1_X = {
        ...specMetadataV3,
        components: {},
      };

      await patchOpenApiSpec({
        patchOptions: {
          parameters: {
            Foo: fn,
          },
          requestBodies: {
            Foo: fn,
          },
          responses: {
            Foo: fn,
          },
          schemas: {
            Foo: fn,
          },
        },
        spec,
      });

      expect(fn).not.toHaveBeenCalled();
    });

    it('handles spec without matching components', async () => {
      const fn = vi.fn();

      const spec: OpenApi.V3_1_X = {
        ...specMetadataV3,
        components: {
          parameters: {},
          requestBodies: {},
          responses: {},
          schemas: {},
        },
      };

      await patchOpenApiSpec({
        patchOptions: {
          parameters: {
            Foo: fn,
          },
          requestBodies: {
            Foo: fn,
          },
          responses: {
            Foo: fn,
          },
          schemas: {
            Foo: fn,
          },
        },
        spec,
      });

      expect(fn).not.toHaveBeenCalled();
    });

    it('skips invalid schemas', async () => {
      const fn = vi.fn();

      const spec: OpenApi.V3_1_X = {
        ...specMetadataV3,
        components: {
          schemas: {
            Bar: 123 as any,
            Baz: 'invalid' as any,
            Foo: null as any,
            Qux: {
              type: 'string',
            },
          },
        },
      };

      await patchOpenApiSpec({
        patchOptions: {
          schemas: {
            Bar: fn,
            Baz: fn,
            Foo: fn,
            Qux: fn,
          },
        },
        spec,
      });

      expect(fn).toHaveBeenCalledOnce();
      expect(fn).toHaveBeenCalledWith({
        type: 'string',
      });
    });

    it('applies meta patch function', async () => {
      const metaFn = vi.fn((meta) => {
        meta.title = 'Changed Title';
      });
      const spec: OpenApi.V3_1_X = {
        ...specMetadataV3,
      };
      await patchOpenApiSpec({
        patchOptions: {
          meta: metaFn,
        },
        spec,
      });
      expect(metaFn).toHaveBeenCalledOnce();
      expect(spec.info.title).toBe('Changed Title');
    });

    it('applies version patch function', async () => {
      const versionFn = vi.fn((version) => `patched-${version}`);
      const spec: OpenApi.V3_1_X = {
        ...specMetadataV3,
      };
      await patchOpenApiSpec({
        patchOptions: {
          version: versionFn,
        },
        spec,
      });
      expect(versionFn).toHaveBeenCalledOnce();
      expect(spec.openapi).toBe('patched-3.1.0');
    });

    it('calls bulk callback function for all schemas', async () => {
      const fn = vi.fn();

      const spec: OpenApi.V3_1_X = {
        ...specMetadataV3,
        components: {
          schemas: {
            Bar: {
              type: 'object',
            },
            Foo: {
              type: 'string',
            },
            Qux: {
              type: 'number',
            },
          },
        },
      };

      await patchOpenApiSpec({
        patchOptions: {
          schemas: fn,
        },
        spec,
      });

      expect(fn).toHaveBeenCalledTimes(3);
      expect(fn).toHaveBeenCalledWith('Bar', { type: 'object' });
      expect(fn).toHaveBeenCalledWith('Foo', { type: 'string' });
      expect(fn).toHaveBeenCalledWith('Qux', { type: 'number' });
    });

    it('bulk callback mutates all schemas', async () => {
      const spec: OpenApi.V3_1_X = {
        ...specMetadataV3,
        components: {
          schemas: {
            Bar: {
              description: 'Bar schema',
              type: 'object',
            },
            Foo: {
              description: 'Foo schema',
              type: 'string',
            },
          },
        },
      };

      await patchOpenApiSpec({
        patchOptions: {
          schemas: (name, schema) => {
            schema.description = `${schema.description} - patched`;
          },
        },
        spec,
      });

      expect(spec.components?.schemas?.Bar!.description).toBe('Bar schema - patched');
      expect(spec.components?.schemas?.Foo!.description).toBe('Foo schema - patched');
    });

    it('bulk callback can extract version from schema name', async () => {
      const spec: OpenApi.V3_1_X = {
        ...specMetadataV3,
        components: {
          schemas: {
            OtherSchema: {
              type: 'string',
            },
            ServiceRoot_v1_20_0_ServiceRoot: {
              description: 'Service root',
              type: 'object',
            },
            User_v2_3_1_User: {
              description: 'User object',
              type: 'object',
            },
          },
        },
      };

      await patchOpenApiSpec({
        patchOptions: {
          schemas: (name, schema) => {
            const match = name.match(/_v(\d+)_(\d+)_(\d+)_/);
            if (match) {
              schema.description = `${schema.description || ''}\n@version ${match[1]}.${match[2]}.${match[3]}`;
            }
          },
        },
        spec,
      });

      expect(spec.components?.schemas?.ServiceRoot_v1_20_0_ServiceRoot!.description).toBe(
        'Service root\n@version 1.20.0',
      );
      expect(spec.components?.schemas?.User_v2_3_1_User!.description).toBe(
        'User object\n@version 2.3.1',
      );
      expect(spec.components?.schemas?.OtherSchema!.description).toBeUndefined();
    });

    it('bulk callback skips invalid schemas', async () => {
      const fn = vi.fn();

      const spec: OpenApi.V3_1_X = {
        ...specMetadataV3,
        components: {
          schemas: {
            Bar: 123 as any,
            Baz: 'invalid' as any,
            Foo: null as any,
            Qux: {
              type: 'string',
            },
          },
        },
      };

      await patchOpenApiSpec({
        patchOptions: {
          schemas: fn,
        },
        spec,
      });

      expect(fn).toHaveBeenCalledOnce();
      expect(fn).toHaveBeenCalledWith('Qux', { type: 'string' });
    });

    it('supports async bulk callback', async () => {
      const spec: OpenApi.V3_1_X = {
        ...specMetadataV3,
        components: {
          schemas: {
            Bar: {
              description: 'Bar schema',
              type: 'object',
            },
            Foo: {
              description: 'Foo schema',
              type: 'string',
            },
          },
        },
      };

      await patchOpenApiSpec({
        patchOptions: {
          schemas: async (name, schema) => {
            // Simulate async operation
            await Promise.resolve();
            schema.description = `${schema.description} - async patched`;
          },
        },
        spec,
      });

      expect(spec.components?.schemas?.Bar!.description).toBe('Bar schema - async patched');
      expect(spec.components?.schemas?.Foo!.description).toBe('Foo schema - async patched');
    });

    it('supports async Record-based callbacks', async () => {
      const spec: OpenApi.V3_1_X = {
        ...specMetadataV3,
        components: {
          schemas: {
            Bar: {
              description: 'Bar schema',
              type: 'object',
            },
            Foo: {
              description: 'Foo schema',
              type: 'string',
            },
          },
        },
      };

      await patchOpenApiSpec({
        patchOptions: {
          schemas: {
            Bar: async (schema) => {
              await Promise.resolve();
              schema.description = `${schema.description} - async`;
            },
            Foo: async (schema) => {
              await Promise.resolve();
              schema.description = `${schema.description} - async`;
            },
          },
        },
        spec,
      });

      expect(spec.components?.schemas?.Bar!.description).toBe('Bar schema - async');
      expect(spec.components?.schemas?.Foo!.description).toBe('Foo schema - async');
    });
  });

  describe('OpenAPI v2', () => {
    it('calls patch function', async () => {
      const fnBar = vi.fn();
      const fnFoo = vi.fn();

      const spec: OpenApi.V2_0_X = {
        ...specMetadataV2,
        definitions: {
          Bar: {
            type: 'object',
          },
          Foo: {
            type: 'string',
          },
        },
      };

      await patchOpenApiSpec({
        patchOptions: {
          schemas: {
            Bar: fnBar,
            Foo: fnFoo,
          },
        },
        spec,
      });

      expect(fnBar).toHaveBeenCalledOnce();
      expect(fnBar).toHaveBeenCalledWith({
        type: 'object',
      });
      expect(fnFoo).toHaveBeenCalledOnce();
      expect(fnFoo).toHaveBeenCalledWith({
        type: 'string',
      });
    });

    it('patch function mutates schema', async () => {
      const spec: OpenApi.V2_0_X = {
        ...specMetadataV2,
        definitions: {
          Foo: {
            type: 'string',
          },
        },
      };

      await patchOpenApiSpec({
        patchOptions: {
          schemas: {
            Foo: (schema) => {
              schema.type = 'number';
            },
          },
        },
        spec,
      });

      expect(spec).toEqual({
        ...specMetadataV2,
        definitions: {
          Foo: {
            type: 'number',
          },
        },
      });
    });

    it('handles spec without definitions', async () => {
      const fn = vi.fn();

      const spec: OpenApi.V2_0_X = {
        ...specMetadataV2,
      };

      await patchOpenApiSpec({
        patchOptions: {
          parameters: {
            Foo: fn,
          },
          requestBodies: {
            Foo: fn,
          },
          responses: {
            Foo: fn,
          },
          schemas: {
            Foo: fn,
          },
        },
        spec,
      });

      expect(fn).not.toHaveBeenCalled();
    });

    it('handles spec without matching definitions', async () => {
      const fn = vi.fn();

      const spec: OpenApi.V2_0_X = {
        ...specMetadataV2,
        definitions: {},
      };

      await patchOpenApiSpec({
        patchOptions: {
          parameters: {
            Foo: fn,
          },
          requestBodies: {
            Foo: fn,
          },
          responses: {
            Foo: fn,
          },
          schemas: {
            Foo: fn,
          },
        },
        spec,
      });

      expect(fn).not.toHaveBeenCalled();
    });

    it('skips invalid schemas', async () => {
      const fn = vi.fn();

      const spec: OpenApi.V2_0_X = {
        ...specMetadataV2,
        definitions: {
          Bar: 123 as any,
          Baz: 'invalid' as any,
          Foo: null as any,
          Qux: {
            type: 'string',
          },
        },
      };

      await patchOpenApiSpec({
        patchOptions: {
          schemas: {
            Bar: fn,
            Baz: fn,
            Foo: fn,
            Qux: fn,
          },
        },
        spec,
      });

      expect(fn).toHaveBeenCalledOnce();
      expect(fn).toHaveBeenCalledWith({
        type: 'string',
      });
    });

    it('applies meta patch function', async () => {
      const metaFn = vi.fn((meta) => {
        meta.title = 'Changed Title';
      });
      const spec: OpenApi.V2_0_X = {
        ...specMetadataV2,
      };
      await patchOpenApiSpec({
        patchOptions: {
          meta: metaFn,
        },
        spec,
      });
      expect(metaFn).toHaveBeenCalledOnce();
      expect(spec.info.title).toBe('Changed Title');
    });

    it('applies version patch function', async () => {
      const versionFn = vi.fn((version) => `patched-${version}`);
      const spec: OpenApi.V2_0_X = {
        ...specMetadataV2,
      };
      await patchOpenApiSpec({
        patchOptions: {
          version: versionFn,
        },
        spec,
      });
      expect(versionFn).toHaveBeenCalledOnce();
      expect(spec.swagger).toBe('patched-2.0');
    });

    it('calls bulk callback function for all schemas', async () => {
      const fn = vi.fn();

      const spec: OpenApi.V2_0_X = {
        ...specMetadataV2,
        definitions: {
          Bar: {
            type: 'object',
          },
          Foo: {
            type: 'string',
          },
          Qux: {
            type: 'number',
          },
        },
      };

      await patchOpenApiSpec({
        patchOptions: {
          schemas: fn,
        },
        spec,
      });

      expect(fn).toHaveBeenCalledTimes(3);
      expect(fn).toHaveBeenCalledWith('Bar', { type: 'object' });
      expect(fn).toHaveBeenCalledWith('Foo', { type: 'string' });
      expect(fn).toHaveBeenCalledWith('Qux', { type: 'number' });
    });

    it('bulk callback mutates all schemas', async () => {
      const spec: OpenApi.V2_0_X = {
        ...specMetadataV2,
        definitions: {
          Bar: {
            description: 'Bar schema',
            type: 'object',
          },
          Foo: {
            description: 'Foo schema',
            type: 'string',
          },
        },
      };

      await patchOpenApiSpec({
        patchOptions: {
          schemas: (name, schema) => {
            schema.description = `${schema.description} - patched`;
          },
        },
        spec,
      });

      expect(spec.definitions?.Bar!.description).toBe('Bar schema - patched');
      expect(spec.definitions?.Foo!.description).toBe('Foo schema - patched');
    });

    it('bulk callback can extract version from schema name', async () => {
      const spec: OpenApi.V2_0_X = {
        ...specMetadataV2,
        definitions: {
          OtherSchema: {
            type: 'string',
          },
          ServiceRoot_v1_20_0_ServiceRoot: {
            description: 'Service root',
            type: 'object',
          },
          User_v2_3_1_User: {
            description: 'User object',
            type: 'object',
          },
        },
      };

      await patchOpenApiSpec({
        patchOptions: {
          schemas: (name, schema) => {
            const match = name.match(/_v(\d+)_(\d+)_(\d+)_/);
            if (match) {
              schema.description = `${schema.description || ''}\n@version ${match[1]}.${match[2]}.${match[3]}`;
            }
          },
        },
        spec,
      });

      expect(spec.definitions?.ServiceRoot_v1_20_0_ServiceRoot!.description).toBe(
        'Service root\n@version 1.20.0',
      );
      expect(spec.definitions?.User_v2_3_1_User!.description).toBe('User object\n@version 2.3.1');
      expect(spec.definitions?.OtherSchema!.description).toBeUndefined();
    });

    it('bulk callback skips invalid schemas', async () => {
      const fn = vi.fn();

      const spec: OpenApi.V2_0_X = {
        ...specMetadataV2,
        definitions: {
          Bar: 123 as any,
          Baz: 'invalid' as any,
          Foo: null as any,
          Qux: {
            type: 'string',
          },
        },
      };

      await patchOpenApiSpec({
        patchOptions: {
          schemas: fn,
        },
        spec,
      });

      expect(fn).toHaveBeenCalledOnce();
      expect(fn).toHaveBeenCalledWith('Qux', { type: 'string' });
    });

    it('supports async bulk callback', async () => {
      const spec: OpenApi.V2_0_X = {
        ...specMetadataV2,
        definitions: {
          Bar: {
            description: 'Bar schema',
            type: 'object',
          },
          Foo: {
            description: 'Foo schema',
            type: 'string',
          },
        },
      };

      await patchOpenApiSpec({
        patchOptions: {
          schemas: async (name, schema) => {
            // Simulate async operation
            await Promise.resolve();
            schema.description = `${schema.description} - async patched`;
          },
        },
        spec,
      });

      expect(spec.definitions?.Bar!.description).toBe('Bar schema - async patched');
      expect(spec.definitions?.Foo!.description).toBe('Foo schema - async patched');
    });

    it('supports async Record-based callbacks', async () => {
      const spec: OpenApi.V2_0_X = {
        ...specMetadataV2,
        definitions: {
          Bar: {
            description: 'Bar schema',
            type: 'object',
          },
          Foo: {
            description: 'Foo schema',
            type: 'string',
          },
        },
      };

      await patchOpenApiSpec({
        patchOptions: {
          schemas: {
            Bar: async (schema) => {
              await Promise.resolve();
              schema.description = `${schema.description} - async`;
            },
            Foo: async (schema) => {
              await Promise.resolve();
              schema.description = `${schema.description} - async`;
            },
          },
        },
        spec,
      });

      expect(spec.definitions?.Bar!.description).toBe('Bar schema - async');
      expect(spec.definitions?.Foo!.description).toBe('Foo schema - async');
    });
  });

  describe('real-world usage', () => {
    it('handles complex schema example from docs', async () => {
      const spec: OpenApi.V3_1_X = {
        ...specMetadataV3,
        components: {
          schemas: {
            Foo: {
              properties: {
                id: { type: 'string' },
                name: { type: 'string' },
                updatedAt: {
                  format: 'date-time',
                  type: 'string',
                },
              },
              type: 'object',
            },
          },
        },
      };

      await patchOpenApiSpec({
        patchOptions: {
          schemas: {
            Foo: (schema: any) => {
              if (typeof schema.properties?.updatedAt === 'object') {
                delete schema.properties.updatedAt.format;
                schema.properties.updatedAt.type = 'number';
              }
            },
          },
        },
        spec,
      });

      expect(spec).toEqual({
        ...specMetadataV3,
        components: {
          schemas: {
            Foo: {
              properties: {
                id: { type: 'string' },
                name: { type: 'string' },
                updatedAt: {
                  type: 'number',
                },
              },
              type: 'object',
            },
          },
        },
      });
    });

    it('handles adding new schema properties', async () => {
      const spec: OpenApi.V3_1_X = {
        ...specMetadataV3,
        components: {
          schemas: {
            Foo: {
              properties: {
                id: { type: 'string' },
              },
              type: 'object',
            },
          },
        },
      };

      await patchOpenApiSpec({
        patchOptions: {
          schemas: {
            Foo: (schema: any) => {
              schema.properties.meta = {
                additionalProperties: true,
                type: 'object',
              };
              schema.required = ['meta'];
            },
          },
        },
        spec,
      });

      expect(spec).toEqual({
        ...specMetadataV3,
        components: {
          schemas: {
            Foo: {
              properties: {
                id: { type: 'string' },
                meta: {
                  additionalProperties: true,
                  type: 'object',
                },
              },
              required: ['meta'],
              type: 'object',
            },
          },
        },
      });
    });

    it('handles removing schema properties', async () => {
      const spec: OpenApi.V3_1_X = {
        ...specMetadataV3,
        components: {
          schemas: {
            Foo: {
              properties: {
                id: { type: 'string' },
                internalField: { type: 'string' },
                publicField: { type: 'string' },
              },
              type: 'object',
            },
          },
        },
      };

      await patchOpenApiSpec({
        patchOptions: {
          schemas: {
            Foo: (schema: any) => {
              delete schema.properties.internalField;
            },
          },
        },
        spec,
      });

      expect(spec).toEqual({
        ...specMetadataV3,
        components: {
          schemas: {
            Foo: {
              properties: {
                id: { type: 'string' },
                publicField: { type: 'string' },
              },
              type: 'object',
            },
          },
        },
      });
    });
  });

  describe('patch.operations', () => {
    describe('OpenAPI v3', () => {
      it('bulk callback mutates all operations', async () => {
        const spec: OpenApi.V3_1_X = {
          ...specMetadataV3,
          paths: {
            '/bar': {
              post: {
                responses: {},
              } as any,
            },
            '/foo': {
              get: {
                responses: {},
              } as any,
              put: {
                responses: {},
              } as any,
            },
          },
        };

        await patchOpenApiSpec({
          patchOptions: {
            operations: (method, path, operation) => {
              operation.operationId = `${method}_${path.replace(/\//g, '_')}`;
            },
          },
          spec,
        });

        expect(spec.paths!['/foo']?.get?.operationId).toBe('get__foo');
        expect(spec.paths!['/foo']?.put?.operationId).toBe('put__foo');
        expect(spec.paths!['/bar']?.post?.operationId).toBe('post__bar');
      });

      it('bulk callback receives correct parameters', async () => {
        const fn = vi.fn();

        const spec: OpenApi.V3_1_X = {
          ...specMetadataV3,
          paths: {
            '/bar': {
              post: {
                responses: {},
              } as any,
            },
            '/foo': {
              get: {
                responses: {},
              } as any,
            },
          },
        };

        await patchOpenApiSpec({
          patchOptions: {
            operations: fn,
          },
          spec,
        });

        expect(fn).toHaveBeenCalledTimes(2);
        expect(fn).toHaveBeenCalledWith('get', '/foo', spec.paths!['/foo']?.get);
        expect(fn).toHaveBeenCalledWith('post', '/bar', spec.paths!['/bar']?.post);
      });

      it('bulk callback receives QUERY operations in OpenAPI 3.2', async () => {
        const fn = vi.fn();
        const spec: OpenApi.V3_1_X = {
          ...specMetadataV3,
          openapi: '3.2.0',
          paths: {
            '/search': {
              query: {
                responses: {},
              },
            },
          },
        };

        await patchOpenApiSpec({
          patchOptions: {
            operations: fn,
          },
          spec,
        });

        expect(fn).toHaveBeenCalledOnce();
        expect(fn).toHaveBeenCalledWith('query', '/search', spec.paths!['/search']?.query);
      });

      it('bulk callback receives QUERY operations after OpenAPI 3.2.0', async () => {
        const fn = vi.fn();
        const spec: OpenApi.V3_1_X = {
          ...specMetadataV3,
          openapi: '3.2.1' as OpenApi.V3_1_X['openapi'],
          paths: {
            '/search': {
              query: {
                responses: {},
              },
            },
          },
        };

        await patchOpenApiSpec({
          patchOptions: {
            operations: fn,
          },
          spec,
        });

        expect(fn).toHaveBeenCalledWith('query', '/search', spec.paths!['/search']?.query);
      });

      it('preserves the callback order when patching multiple operations', async () => {
        const fn = vi.fn();
        const spec: OpenApi.V3_1_X = {
          ...specMetadataV3,
          paths: {
            '/search': {
              delete: { responses: {} },
              get: { responses: {} },
              patch: { responses: {} },
              post: { responses: {} },
              put: { responses: {} },
              trace: { responses: {} },
            },
          },
        };

        await patchOpenApiSpec({ patchOptions: { operations: fn }, spec });

        expect(fn.mock.calls.map(([method]) => method)).toEqual([
          'get',
          'put',
          'post',
          'delete',
          'patch',
          'trace',
        ]);
      });

      it('bulk callback ignores QUERY operations before OpenAPI 3.2', async () => {
        const fn = vi.fn();
        const spec: OpenApi.V3_1_X = {
          ...specMetadataV3,
          paths: {
            '/search': {
              query: {
                responses: {},
              },
            },
          },
        };

        await patchOpenApiSpec({
          patchOptions: {
            operations: fn,
          },
          spec,
        });

        expect(fn).not.toHaveBeenCalled();
      });

      it('bulk callback can inject operationId based on path patterns', async () => {
        const spec: OpenApi.V3_1_X = {
          ...specMetadataV3,
          paths: {
            '/users': {
              get: {
                responses: {},
              } as any,
              post: {
                responses: {},
              } as any,
            },
            '/users/{id}': {
              delete: {
                responses: {},
              } as any,
              get: {
                operationId: 'existingId',
                responses: {},
              } as any,
            },
          },
        };

        await patchOpenApiSpec({
          patchOptions: {
            operations: (method, path, operation) => {
              if (operation.operationId) return; // don't override existing

              const segments = path.split('/').filter(Boolean);
              const parts = segments.map((seg) => (seg.startsWith('{') ? 'ById' : seg)).join('');
              operation.operationId = method + parts;
            },
          },
          spec,
        });

        expect(spec.paths!['/users']?.get?.operationId).toBe('getusers');
        expect(spec.paths!['/users']?.post?.operationId).toBe('postusers');
        expect(spec.paths!['/users/{id}']?.get?.operationId).toBe('existingId'); // not overridden
        expect(spec.paths!['/users/{id}']?.delete?.operationId).toBe('deleteusersById');
      });

      it('bulk callback skips invalid operations', async () => {
        const fn = vi.fn();

        const spec: OpenApi.V3_1_X = {
          ...specMetadataV3,
          paths: {
            '/bar': {
              get: null as any,
              post: 'invalid' as any,
            },
            '/baz': 123 as any,
            '/foo': {
              get: {
                responses: {},
              } as any,
            },
          },
        };

        await patchOpenApiSpec({
          patchOptions: {
            operations: fn,
          },
          spec,
        });

        expect(fn).toHaveBeenCalledOnce();
        expect(fn).toHaveBeenCalledWith('get', '/foo', spec.paths!['/foo']?.get);
      });

      it('supports async bulk callback', async () => {
        const spec: OpenApi.V3_1_X = {
          ...specMetadataV3,
          paths: {
            '/bar': {
              post: {
                responses: {},
              } as any,
            },
            '/foo': {
              get: {
                responses: {},
              } as any,
            },
          },
        };

        await patchOpenApiSpec({
          patchOptions: {
            operations: async (method, path, operation) => {
              // Simulate async operation
              await Promise.resolve();
              operation.operationId = `async_${method}_${path}`;
            },
          },
          spec,
        });

        expect(spec.paths!['/foo']?.get?.operationId).toBe('async_get_/foo');
        expect(spec.paths!['/bar']?.post?.operationId).toBe('async_post_/bar');
      });

      it('supports async Record-based callbacks', async () => {
        const spec: OpenApi.V3_1_X = {
          ...specMetadataV3,
          paths: {
            '/bar': {
              post: {
                responses: {},
              } as any,
            },
            '/foo': {
              get: {
                responses: {},
              } as any,
            },
          },
        };

        await patchOpenApiSpec({
          patchOptions: {
            operations: {
              'GET /foo': async (operation) => {
                await Promise.resolve();
                operation.operationId = 'asyncGetFoo';
              },
              'POST /bar': async (operation) => {
                await Promise.resolve();
                operation.operationId = 'asyncPostBar';
              },
            },
          },
          spec,
        });

        expect(spec.paths!['/foo']?.get?.operationId).toBe('asyncGetFoo');
        expect(spec.paths!['/bar']?.post?.operationId).toBe('asyncPostBar');
      });

      it('Record-based operations still work as before', async () => {
        const spec: OpenApi.V3_1_X = {
          ...specMetadataV3,
          paths: {
            '/bar': {
              post: {
                responses: {},
              } as any,
            },
            '/foo': {
              get: {
                responses: {},
              } as any,
            },
          },
        };

        await patchOpenApiSpec({
          patchOptions: {
            operations: {
              'GET /foo': (operation) => {
                operation.operationId = 'getFoo';
              },
              'POST /bar': (operation) => {
                operation.operationId = 'postBar';
              },
            },
          },
          spec,
        });

        expect(spec.paths!['/foo']?.get?.operationId).toBe('getFoo');
        expect(spec.paths!['/bar']?.post?.operationId).toBe('postBar');
      });

      it('handles spec without paths', async () => {
        const fn = vi.fn();

        const spec: OpenApi.V3_1_X = {
          ...specMetadataV3,
        };

        await patchOpenApiSpec({
          patchOptions: {
            operations: fn,
          },
          spec,
        });

        expect(fn).not.toHaveBeenCalled();
      });

      it('handles all HTTP methods', async () => {
        const fn = vi.fn();

        const spec: OpenApi.V3_1_X = {
          ...specMetadataV3,
          paths: {
            '/test': {
              delete: { responses: {} } as any,
              get: { responses: {} } as any,
              head: { responses: {} } as any,
              options: { responses: {} } as any,
              patch: { responses: {} } as any,
              post: { responses: {} } as any,
              put: { responses: {} } as any,
              trace: { responses: {} } as any,
            },
          },
        };

        await patchOpenApiSpec({
          patchOptions: {
            operations: fn,
          },
          spec,
        });

        expect(fn).toHaveBeenCalledTimes(8);
        expect(fn).toHaveBeenCalledWith('get', '/test', expect.any(Object));
        expect(fn).toHaveBeenCalledWith('put', '/test', expect.any(Object));
        expect(fn).toHaveBeenCalledWith('post', '/test', expect.any(Object));
        expect(fn).toHaveBeenCalledWith('delete', '/test', expect.any(Object));
        expect(fn).toHaveBeenCalledWith('options', '/test', expect.any(Object));
        expect(fn).toHaveBeenCalledWith('head', '/test', expect.any(Object));
        expect(fn).toHaveBeenCalledWith('patch', '/test', expect.any(Object));
        expect(fn).toHaveBeenCalledWith('trace', '/test', expect.any(Object));
      });
    });

    describe('OpenAPI v2', () => {
      it('bulk callback mutates all operations', async () => {
        const spec: OpenApi.V2_0_X = {
          ...specMetadataV2,
          paths: {
            '/bar': {
              post: {
                responses: {},
              } as any,
            },
            '/foo': {
              get: {
                responses: {},
              } as any,
              put: {
                responses: {},
              } as any,
            },
          },
        };

        await patchOpenApiSpec({
          patchOptions: {
            operations: (method, path, operation) => {
              operation.operationId = `${method}_${path.replace(/\//g, '_')}`;
            },
          },
          spec,
        });

        expect(spec.paths!['/foo']?.get?.operationId).toBe('get__foo');
        expect(spec.paths!['/foo']?.put?.operationId).toBe('put__foo');
        expect(spec.paths!['/bar']?.post?.operationId).toBe('post__bar');
      });

      it('bulk callback receives correct parameters', async () => {
        const fn = vi.fn();

        const spec: OpenApi.V2_0_X = {
          ...specMetadataV2,
          paths: {
            '/bar': {
              post: {
                responses: {},
              } as any,
            },
            '/foo': {
              get: {
                responses: {},
              } as any,
            },
          },
        };

        await patchOpenApiSpec({
          patchOptions: {
            operations: fn,
          },
          spec,
        });

        expect(fn).toHaveBeenCalledTimes(2);
        expect(fn).toHaveBeenCalledWith('get', '/foo', spec.paths!['/foo']?.get);
        expect(fn).toHaveBeenCalledWith('post', '/bar', spec.paths!['/bar']?.post);
      });

      it('supports async bulk callback', async () => {
        const spec: OpenApi.V2_0_X = {
          ...specMetadataV2,
          paths: {
            '/bar': {
              post: {
                responses: {},
              } as any,
            },
            '/foo': {
              get: {
                responses: {},
              } as any,
            },
          },
        };

        await patchOpenApiSpec({
          patchOptions: {
            operations: async (method, path, operation) => {
              await Promise.resolve();
              operation.operationId = `async_${method}_${path}`;
            },
          },
          spec,
        });

        expect(spec.paths!['/foo']?.get?.operationId).toBe('async_get_/foo');
        expect(spec.paths!['/bar']?.post?.operationId).toBe('async_post_/bar');
      });

      it('Record-based operations still work as before', async () => {
        const spec: OpenApi.V2_0_X = {
          ...specMetadataV2,
          paths: {
            '/bar': {
              post: {
                responses: {},
              } as any,
            },
            '/foo': {
              get: {
                responses: {},
              } as any,
            },
          },
        };

        await patchOpenApiSpec({
          patchOptions: {
            operations: {
              'GET /foo': (operation) => {
                operation.operationId = 'getFoo';
              },
              'POST /bar': (operation) => {
                operation.operationId = 'postBar';
              },
            },
          },
          spec,
        });

        expect(spec.paths!['/foo']?.get?.operationId).toBe('getFoo');
        expect(spec.paths!['/bar']?.post?.operationId).toBe('postBar');
      });

      it('handles all HTTP methods', async () => {
        const fn = vi.fn();

        const spec: OpenApi.V2_0_X = {
          ...specMetadataV2,
          paths: {
            '/test': {
              delete: { responses: {} } as any,
              get: { responses: {} } as any,
              head: { responses: {} } as any,
              options: { responses: {} } as any,
              patch: { responses: {} } as any,
              post: { responses: {} } as any,
              put: { responses: {} } as any,
            },
          },
        };

        await patchOpenApiSpec({
          patchOptions: {
            operations: fn,
          },
          spec,
        });

        expect(fn).toHaveBeenCalledTimes(7);
        expect(fn).toHaveBeenCalledWith('get', '/test', expect.any(Object));
        expect(fn).toHaveBeenCalledWith('put', '/test', expect.any(Object));
        expect(fn).toHaveBeenCalledWith('post', '/test', expect.any(Object));
        expect(fn).toHaveBeenCalledWith('delete', '/test', expect.any(Object));
        expect(fn).toHaveBeenCalledWith('options', '/test', expect.any(Object));
        expect(fn).toHaveBeenCalledWith('head', '/test', expect.any(Object));
        expect(fn).toHaveBeenCalledWith('patch', '/test', expect.any(Object));
      });
    });
  });
});
