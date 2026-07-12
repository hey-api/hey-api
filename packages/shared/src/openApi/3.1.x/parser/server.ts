import type { Context } from '../../../ir/context';
import { parseUrl } from '../../../utils/url';

export function parseServers({ context }: { context: Context }) {
  if (context.spec.servers) {
    context.ir.servers = context.spec.servers;
    return;
  }

  for (const input of context.config.input) {
    if (typeof input.path === 'string') {
      const url = parseUrl(input.path);
      context.ir.servers = [
        {
          url: `${url.protocol ? `${url.protocol}://` : ''}${url.host}${url.port ? `:${url.port}` : ''}`,
        },
      ];
    }
  }

  if (!context.ir.servers) {
    context.ir.servers = [
      {
        url: '/',
      },
    ];
  }
}
