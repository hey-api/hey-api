import { createRequire } from 'node:module';
import path from 'node:path';

import starlight from '@astrojs/starlight';
import starlightDocSearch from '@astrojs/starlight-docsearch';
import vercel from '@astrojs/vercel';
import starlightLlmsTxt from '@hey-api/starlight-llms-txt';
import { defineConfig } from 'astro/config';
import starlightThemeFlexoki from 'starlight-theme-flexoki';

import { generateImagesPlugin } from './plugins/generate-images';
import { stripFirstH1Plugin } from './plugins/strip-first-h1';

const domain = process.env.SITE_DOMAIN || 'http://localhost:4321';
const isProd = import.meta.env.PROD;

function getOptionalSharpWasm32Excludes() {
  try {
    const require = createRequire(import.meta.url);
    const sharpPackageJsonPath = require.resolve('sharp/package.json');
    const sharpNodeModulesDir = path.resolve(path.dirname(sharpPackageJsonPath), '..');
    return [
      path.resolve(sharpNodeModulesDir, '@img', 'sharp-wasm32'),
      path.resolve(sharpNodeModulesDir, '..', '..', 'node_modules', '@img', 'sharp-wasm32'),
    ];
  } catch {
    return [];
  }
}

export default defineConfig({
  adapter: vercel({
    excludeFiles: !process.env.CI ? getOptionalSharpWasm32Excludes() : [],
  }),
  image: {
    remotePatterns: [{ hostname: 'avatars.githubusercontent.com', protocol: 'https' }],
  },
  integrations: [
    starlight({
      components: {
        ContentPanel: './src/components/ContentPanel.astro',
        EditLink: './src/components/EditLink.astro',
        FallbackContentNotice: './src/components/FallbackContentNotice.astro',
        Footer: './src/components/Footer.astro',
        Head: './src/components/Head.astro',
        Header: './src/components/Header.astro',
        PageFrame: './src/components/PageFrame.astro',
        PageSidebar: './src/components/PageSidebar.astro',
        PageTitle: './src/components/PageTitle.astro',
        Pagination: './src/components/Pagination.astro',
        Sidebar: './src/components/Sidebar.astro',
        SocialIcons: './src/components/SponsorGoal.astro',
        TableOfContents: './src/components/TableOfContents.astro',
        TwoColumnContent: './src/components/TwoColumnContent.astro',
      },
      customCss: ['./src/styles/custom.css'],
      defaultLocale: 'root',
      description:
        '🌀 OpenAPI to TypeScript codegen. Production-ready SDKs, Zod schemas, TanStack Query hooks, and 20+ plugins. Used by Vercel, OpenCode, and PayPal.',
      editLink: {
        baseUrl: 'https://github.com/hey-api/hey-api/edit/main/docs',
      },
      favicon: '/assets/icons/dark.svg',
      head: [
        {
          attrs: {
            href: '/assets/icons/dark.svg',
            media: '(prefers-color-scheme: dark)',
            rel: 'icon',
            sizes: '16x16',
            type: 'image/svg+xml',
          },
          tag: 'link',
        },
        {
          attrs: {
            href: '/assets/icons/light.svg',
            media: '(prefers-color-scheme: light)',
            rel: 'icon',
            sizes: '16x16',
            type: 'image/svg+xml',
          },
          tag: 'link',
        },
        ...(isProd
          ? [
              {
                attrs: {
                  'data-website-id': '4dffba2d-03a6-4358-9d90-229038c8575d',
                  defer: true,
                  src: 'https://cloud.umami.is/script.js',
                },
                tag: 'script',
              },
            ]
          : []),
      ],
      lastUpdated: false,
      locales: {
        root: {
          label: 'English',
          lang: 'en',
        },
        'zh-cn': {
          label: '简体中文',
          lang: 'zh-CN',
        },
      },
      logo: {
        alt: 'Hey API logo',
        dark: './src/assets/icons/dark.svg',
        light: './src/assets/icons/light.svg',
      },
      plugins: [
        starlightDocSearch({
          apiKey: '2565c35b4ad91c2f8f8ae32cf9bbe899',
          appId: 'OWEH2O8E50',
          disableUserPersonalization: false,
          indexName: 'openapi-ts docs',
          insights: true,
        }),
        starlightLlmsTxt(),
        starlightThemeFlexoki({
          accentColor: 'green',
        }),
      ],
      routeMiddleware: './src/routeData.ts',
      sidebar: [
        {
          collapsed: false,
          items: [
            'docs/openapi/typescript/get-started',
            {
              collapsed: true,
              items: [
                'docs/openapi/typescript/configuration',
                'docs/openapi/typescript/configuration/input',
                'docs/openapi/typescript/configuration/output',
                'docs/openapi/typescript/configuration/parser',
                'docs/openapi/typescript/configuration/vite',
              ],
              label: 'Configuration',
            },
            'docs/openapi/typescript/output',
          ],
          label: 'Introduction',
        },
        {
          items: [
            {
              collapsed: true,
              items: [
                'docs/openapi/typescript/core',
                'docs/openapi/typescript/plugins/typescript',
                'docs/openapi/typescript/plugins/sdk',
                'docs/openapi/typescript/plugins/transformers',
                'docs/openapi/typescript/plugins/schemas',
              ],
              label: 'Core',
            },
            {
              collapsed: true,
              items: [
                'docs/openapi/typescript/clients',
                'docs/openapi/typescript/clients/fetch',
                {
                  label: 'Angular',
                  link: 'docs/openapi/typescript/clients/angular',
                },
                'docs/openapi/typescript/clients/axios',
                'docs/openapi/typescript/clients/ky',
                'docs/openapi/typescript/clients/next-js',
                'docs/openapi/typescript/clients/nuxt',
                'docs/openapi/typescript/clients/ofetch',
                {
                  badge: { text: 'Vote', variant: 'tip' },
                  slug: 'docs/openapi/typescript/clients/effect',
                },
                {
                  badge: { text: 'Vote', variant: 'tip' },
                  slug: 'docs/openapi/typescript/clients/got',
                },
              ],
              label: 'Clients',
            },
            {
              collapsed: true,
              items: [
                'docs/openapi/typescript/validators',
                'docs/openapi/typescript/plugins/valibot',
                {
                  label: 'Zod',
                  link: 'docs/openapi/typescript/plugins/zod',
                },
                {
                  badge: { text: 'Vote', variant: 'tip' },
                  slug: 'docs/openapi/typescript/plugins/ajv',
                },
                {
                  badge: { text: 'Vote', variant: 'tip' },
                  slug: 'docs/openapi/typescript/plugins/arktype',
                },
                {
                  badge: { text: 'Vote', variant: 'tip' },
                  slug: 'docs/openapi/typescript/plugins/joi',
                },
                {
                  badge: { text: 'Vote', variant: 'tip' },
                  slug: 'docs/openapi/typescript/plugins/superstruct',
                },
                {
                  badge: { text: 'Vote', variant: 'tip' },
                  slug: 'docs/openapi/typescript/plugins/typebox',
                },
                {
                  badge: { text: 'Vote', variant: 'tip' },
                  slug: 'docs/openapi/typescript/plugins/yup',
                },
              ],
              label: 'Validators',
            },
            {
              collapsed: true,
              items: [
                'docs/openapi/typescript/state-management',
                'docs/openapi/typescript/plugins/pinia-colada',
                'docs/openapi/typescript/plugins/tanstack-query',
                {
                  badge: { text: 'Vote', variant: 'tip' },
                  slug: 'docs/openapi/typescript/plugins/swr',
                },
                {
                  badge: { text: 'Vote', variant: 'tip' },
                  slug: 'docs/openapi/typescript/plugins/zustand',
                },
              ],
              label: 'State Management',
            },
            {
              collapsed: true,
              items: [
                'docs/openapi/typescript/mocks',
                {
                  badge: { text: 'Vote', variant: 'tip' },
                  slug: 'docs/openapi/typescript/plugins/chance',
                },
                {
                  badge: { text: 'Vote', variant: 'tip' },
                  slug: 'docs/openapi/typescript/plugins/faker',
                },
                {
                  badge: { text: 'Vote', variant: 'tip' },
                  slug: 'docs/openapi/typescript/plugins/falso',
                },
                {
                  badge: { text: 'Vote', variant: 'tip' },
                  slug: 'docs/openapi/typescript/plugins/msw',
                },
                {
                  badge: { text: 'Vote', variant: 'tip' },
                  slug: 'docs/openapi/typescript/plugins/nock',
                },
                {
                  badge: { text: 'Vote', variant: 'tip' },
                  slug: 'docs/openapi/typescript/plugins/supertest',
                },
              ],
              label: 'Mocks',
            },
            {
              collapsed: true,
              items: [
                'docs/openapi/typescript/web-frameworks',
                {
                  label: 'Angular',
                  link: 'docs/openapi/typescript/plugins/angular',
                },
                'docs/openapi/typescript/plugins/fastify',
                'docs/openapi/typescript/plugins/nest',
                {
                  label: 'oRPC',
                  link: 'docs/openapi/typescript/plugins/orpc',
                },
                {
                  badge: { text: 'Vote', variant: 'tip' },
                  slug: 'docs/openapi/typescript/plugins/adonis',
                },
                {
                  badge: { text: 'Vote', variant: 'tip' },
                  slug: 'docs/openapi/typescript/plugins/elysia',
                },
                {
                  badge: { text: 'Vote', variant: 'tip' },
                  slug: 'docs/openapi/typescript/plugins/express',
                },
                {
                  badge: { text: 'Vote', variant: 'tip' },
                  slug: 'docs/openapi/typescript/plugins/hono',
                },
                {
                  badge: { text: 'Vote', variant: 'tip' },
                  slug: 'docs/openapi/typescript/plugins/koa',
                },
                {
                  badge: { text: 'Vote', variant: 'tip' },
                  slug: 'docs/openapi/typescript/plugins/tanstack-start',
                },
              ],
              label: 'Web Frameworks',
            },
            {
              collapsed: true,
              items: ['docs/openapi/typescript/plugins/concepts/resolvers'],
              label: 'Concepts',
            },
            {
              collapsed: true,
              items: [
                'docs/openapi/typescript/plugins/custom',
                'docs/openapi/typescript/clients/custom',
              ],
              label: 'Custom',
            },
          ],
          label: 'Plugins',
        },
        {
          items: [
            'docs/openapi/typescript/community/spotlight',
            {
              collapsed: true,
              items: [
                'docs/openapi/typescript/community/contributing',
                'docs/openapi/typescript/community/contributing/building',
                'docs/openapi/typescript/community/contributing/developing',
                'docs/openapi/typescript/community/contributing/testing',
              ],
              label: 'Contributing',
            },
          ],
          label: 'Community',
        },
        {
          items: ['docs/openapi/typescript/integrations'],
          label: 'Integrations',
        },
        {
          items: [
            'docs/openapi/typescript/migrating',
            'docs/openapi/typescript/license',
            {
              label: 'Roadmap',
              link: 'https://github.com/orgs/hey-api/discussions/3159',
            },
          ],
          label: '@hey-api/openapi-ts',
        },
      ],
      tableOfContents: {
        maxHeadingLevel: 2,
      },
      title: 'Hey API',
    }),
  ],
  markdown: {
    rehypePlugins: [stripFirstH1Plugin()],
  },
  output: 'static',
  site: domain,
  trailingSlash: 'never',
  vite: {
    plugins: [generateImagesPlugin()],
  },
});
