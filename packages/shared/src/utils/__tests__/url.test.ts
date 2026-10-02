import { getBaseUrl, parseUrl } from '../url';

describe('getBaseUrl', () => {
  it.each([
    { expected: undefined, url: '/' },
    { expected: '/v1', url: '/v1' },
    { expected: '/v1', url: '/v1/' },
    { expected: 'https://foo.com/v1', url: 'https://foo.com/v1' },
    { expected: undefined, url: 'https://{id}.foo.com/v1' },
  ])('getBaseUrl($url) -> $expected', ({ expected, url }) => {
    expect(getBaseUrl(true, { servers: [{ url }] })).toEqual(expected);
  });
});

describe('parseUrl', () => {
  it.each([
    { host: '', path: '', port: '', protocol: '', value: '' },
    { host: '', path: '', port: '', protocol: '', value: '/' },
    { host: 'foo.com', path: '', port: '', protocol: '', value: 'foo.com' },
    { host: 'foo.com', path: '', port: '', protocol: '', value: 'foo.com/' },
    {
      host: 'foo.com',
      path: '/bar',
      port: '',
      protocol: '',
      value: 'foo.com/bar',
    },
    {
      host: 'www.foo.com',
      path: '/bar',
      port: '',
      protocol: '',
      value: 'www.foo.com/bar',
    },
    {
      host: 'www.foo.com',
      path: '/bar',
      port: '',
      protocol: 'https',
      value: 'https://www.foo.com/bar',
    },
    {
      host: 'www.foo.com',
      path: '/bar',
      port: '',
      protocol: 'custom',
      value: 'custom://www.foo.com/bar',
    },
    {
      host: 'foo.com',
      path: '/bar',
      port: '',
      protocol: 'ws',
      value: 'ws://foo.com/bar',
    },
    {
      host: 'foo.com',
      path: '/bar',
      port: '',
      protocol: '',
      value: '//foo.com/bar?ignore',
    },
    { host: 'foo.com', path: '', port: '', protocol: '', value: '//foo.com' },
    { host: '', path: '', port: '', protocol: 'https', value: 'https://' },
    { host: '', path: '/bar', port: '', protocol: '', value: '/bar' },
    {
      host: 'localhost',
      path: '',
      port: '3025',
      protocol: 'http',
      value: 'http://localhost:3025',
    },
    {
      host: 'localhost',
      path: '',
      port: '',
      protocol: 'https',
      value: 'https://localhost',
    },
    { host: '', path: '/v1/foo', port: '', protocol: '', value: '/v1/foo' },
    {
      host: '10.0.81.36',
      path: '/v1',
      port: '',
      protocol: 'http',
      value: 'http://10.0.81.36/v1',
    },
    {
      host: '{id}.foo.com',
      path: '/v1',
      port: '{port}',
      protocol: 'https',
      value: 'https://{id}.foo.com:{port}/v1',
    },
    { host: '', path: '', port: '', protocol: '', value: './foo.json' },
    { host: '', path: '', port: '', protocol: '', value: '../../foo.json' },
    { host: '', path: '', port: '', protocol: '', value: 'D://\\foo.json' },
  ])('$value', ({ host, path, port, protocol, value }) => {
    expect(parseUrl(value)).toEqual({
      host,
      path,
      port,
      protocol,
    });
  });
});
