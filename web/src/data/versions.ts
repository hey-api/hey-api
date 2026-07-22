export interface VersionOption {
  href: string;
  label: string;
  short?: string;
}

export interface VersionRoute {
  versions: Array<VersionOption>;
}

export const versionedRoutes: Record<string, VersionRoute> = {
  '/docs/openapi/typescript/clients/angular': {
    versions: [
      {
        href: '/docs/openapi/typescript/clients/angular/v20',
        label: 'Angular 20',
        short: 'v20',
      },
      {
        href: '/docs/openapi/typescript/clients/angular/v19',
        label: 'Angular 19',
        short: 'v19',
      },
    ],
  },
  '/docs/openapi/typescript/plugins/angular': {
    versions: [
      {
        href: '/docs/openapi/typescript/plugins/angular/v20',
        label: 'Angular 20',
        short: 'v20',
      },
      {
        href: '/docs/openapi/typescript/plugins/angular/v19',
        label: 'Angular 19',
        short: 'v19',
      },
    ],
  },
  '/docs/openapi/typescript/plugins/orpc': {
    versions: [
      {
        href: '/docs/openapi/typescript/plugins/orpc/v2',
        label: 'oRPC 2',
        short: 'v2',
      },
      {
        href: '/docs/openapi/typescript/plugins/orpc/v1',
        label: 'oRPC 1',
        short: 'v1',
      },
    ],
  },
  '/docs/openapi/typescript/plugins/zod': {
    versions: [
      {
        href: '/docs/openapi/typescript/plugins/zod/v4',
        label: 'Zod 4',
        short: 'v4',
      },
      {
        href: '/docs/openapi/typescript/plugins/zod/mini',
        label: 'Zod Mini',
        short: 'Mini',
      },
      {
        href: '/docs/openapi/typescript/plugins/zod/v3',
        label: 'Zod 3',
        short: 'v3',
      },
    ],
  },
};

export function getVersionedBasePath(pathname: string): string | undefined {
  const normalized = pathname.replace(/\/$/, '');
  for (const [basePath, route] of Object.entries(versionedRoutes)) {
    if (route.versions.some((v) => v.href.replace(/\/$/, '') === normalized)) {
      return basePath;
    }
  }
}
