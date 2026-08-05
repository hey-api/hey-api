import { safeRuntimeName } from '../name';

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
