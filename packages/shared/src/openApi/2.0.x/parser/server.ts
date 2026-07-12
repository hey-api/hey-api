import type { Context } from '../../../ir/context';
import { parseUrl } from '../../../utils/url';

export function parseServers({ context }: { context: Context }): void {
  let schemes: ReadonlyArray<string> = context.spec.schemes ?? [];
  let host = context.spec.host ?? '';
  const path = context.spec.basePath ?? '';

  for (const input of context.config.input) {
    if (typeof input.path === 'string') {
      const url = parseUrl(input.path);

      if (!schemes.length) {
        if (url.protocol) {
          schemes = [url.protocol] as typeof schemes;
        }
      }

      if (!host) {
        host = `${url.host}${url.port ? `:${url.port}` : ''}`;
      }
    }
  }

  if (!schemes.length) {
    schemes = [''];
  }

  const servers = schemes
    .map((scheme) => `${scheme ? `${scheme}://` : ''}${host}${path}`)
    .filter(Boolean);

  if (servers.length) {
    context.ir.servers = servers.map((url) => ({
      url,
    }));
  }
}
