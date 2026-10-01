import { safeFieldName, safeRuntimeName } from '../name';

describe('safeRuntimeName', () => {
  const scenarios = [
    // Digits: valid as regular char, can reprocess → leading underscore
    { name: '3foo', output: '_3foo' },
    { name: '123', output: '_123' },

    // $ sign: invalid in Python as regular char → single underscore, skip reprocess
    { name: '$schema', output: '_schema' },
    { name: '$foo', output: '_foo' },

    // Hyphen: first char is valid (a, f), hyphen becomes underscore in loop
    { name: 'api-version', output: 'api_version' },
    { name: 'foo-bar', output: 'foo_bar' },

    // Normal cases
    { name: 'foo', output: 'foo' },
    { name: '_private', output: '_private' },

    // Reserved words
    { name: 'class', output: 'class_' },
  ] as const;

  it.each(scenarios)('transforms $name -> $output', ({ name, output }) => {
    expect(safeRuntimeName(name)).toEqual(output);
  });
});

describe('safeFieldName', () => {
  const scenarios = [
    // Pydantic rejects a leading underscore, so a prefix it accepts is used
    { name: '2fa', output: 'field_2fa' },
    { name: '123', output: 'field_123' },
    { name: '$schema', output: 'field_schema' },

    // A name already legal for a field is left as the identifier sanitizer made it
    { name: 'foo', output: 'foo' },
    { name: 'foo-bar', output: 'foo_bar' },
    { name: 'class', output: 'class_' },

    // A name the spec itself starts with an underscore keeps the prefix too
    { name: '_private', output: 'field_private' },
  ] as const;

  it.each(scenarios)('transforms $name -> $output', ({ name, output }) => {
    expect(safeFieldName(name)).toEqual(output);
  });
});
