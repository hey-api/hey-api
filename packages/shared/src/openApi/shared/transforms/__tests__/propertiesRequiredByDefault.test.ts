import { propertiesRequiredByDefaultTransform } from '../propertiesRequiredByDefault';

describe('propertiesRequiredByDefaultTransform', () => {
  it('marks all properties of an object schema as required', () => {
    const spec = {
      components: {
        schemas: {
          Foo: {
            properties: { bar: { type: 'string' }, baz: { type: 'number' } },
            type: 'object',
          },
        },
      },
    };

    propertiesRequiredByDefaultTransform({ spec });

    expect(spec.components.schemas.Foo).toHaveProperty('required', ['bar', 'baz']);
  });

  it('keeps an existing required list', () => {
    const spec = {
      components: {
        schemas: {
          Foo: {
            properties: { bar: { type: 'string' }, baz: { type: 'number' } },
            required: ['bar'],
            type: 'object',
          },
        },
      },
    };

    propertiesRequiredByDefaultTransform({ spec });

    expect(spec.components.schemas.Foo.required).toEqual(['bar']);
  });

  it('marks properties of inline object schemas as required', () => {
    const spec = {
      components: {
        schemas: {
          Foo: {
            properties: {
              items: {
                items: { properties: { bar: { type: 'string' } }, type: 'object' },
                type: 'array',
              },
            },
            type: 'object',
          },
        },
      },
    };

    propertiesRequiredByDefaultTransform({ spec });

    expect(spec.components.schemas.Foo.properties.items.items).toHaveProperty('required', ['bar']);
  });

  it('marks properties of a nullable object schema with a type array as required', () => {
    const spec = {
      components: {
        schemas: {
          Foo: {
            properties: { bar: { type: 'string' } },
            type: ['object', 'null'],
          },
        },
      },
    };

    propertiesRequiredByDefaultTransform({ spec });

    expect(spec.components.schemas.Foo).toHaveProperty('required', ['bar']);
  });
});
