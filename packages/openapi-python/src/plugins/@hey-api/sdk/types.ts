import type { DefinePlugin, OperationsStrategy, Plugin } from '@hey-api/shared';

import type { PluginClientNames } from '../../types';
import type { ExamplesConfig, UserExamplesConfig } from './examples';
import type { SdkImports } from './imports';
import type { OperationsConfig, UserOperationsConfig } from './operations';

export type UserConfig = Plugin.Name<'@hey-api/python-sdk'> &
  Plugin.Hooks &
  Plugin.UserComments &
  Plugin.UserExports & {
    /**
     * Use an internal client instance to send HTTP requests? This is useful if
     * you don't want to manually pass the client to each SDK function.
     *
     * You can customize the selected client output through its plugin. You can
     * also set `client` to `true` to automatically choose the client from your
     * defined plugins. If we can't detect a client plugin when using `true`, we
     * will default to `@hey-api/client-httpx`.
     *
     * @default true
     */
    client?: PluginClientNames | boolean;
    /**
     * Generate code examples for SDK operations and attach them to the
     * input source (e.g., via `x-codeSamples`).
     *
     * Set to `false` to disable example generation entirely, or provide an
     * object for fine-grained control over the output and post-processing.
     *
     * @default false
     */
    examples?: boolean | UserExamplesConfig;
    /**
     * Define the structure of generated SDK operations.
     *
     * String shorthand:
     * - `'byTags'` – one container per operation tag
     * - `'single'` – all operations in a single container
     * - custom function for full control
     *
     * Use the object form for advanced configuration.
     *
     * @default 'single'
     */
    operations?: Exclude<OperationsStrategy, 'flat'> | UserOperationsConfig;
    /**
     * Return a page from a list operation, instead of the response model.
     *
     * A page yields the items of the operation's first response and then the
     * items of each page after it, so a caller writes
     * `for widget in sdk.widgets.list()` rather than a loop that carries the
     * cursor itself.
     *
     * The request parameter that continues the list is read from the spec,
     * through the parser's pagination keywords. The response fields cannot be
     * derived, so name them here. The whole option is off unless set, because
     * a wrong guess would silently return one page.
     *
     * @default false
     */
    pagination?:
      | false
      | {
          /** Response field reporting whether another page exists. */
          hasMore: string;
          /** Response field holding the items of the page. */
          items: string;
          /**
           * Response field holding the value that requests the next page, for
           * an operation whose continuation parameter is a cursor.
           */
          nextCursor?: string;
          /**
           * Response field holding the number of the page it answers, for an
           * operation whose continuation parameter is a page number. The page
           * after this one is that number plus one.
           */
          pageNumber?: string;
        };
    /**
     * Define how request parameters are structured in generated SDK methods.
     *
     * - `'flat'` merges parameters into a single object.
     * - `'grouped'` separates parameters by transport layer.
     *
     * Use `'flat'` for simpler calls or `'grouped'` for stricter typing and code clarity.
     *
     * @default 'grouped'
     */
    paramsStructure?: 'flat' | 'grouped';
  };

export type Config = Plugin.Name<'@hey-api/python-sdk'> &
  Plugin.Hooks &
  Plugin.Comments &
  Plugin.Exports & {
    /**
     * Use an internal client instance to send HTTP requests? This is useful if
     * you don't want to manually pass the client to each SDK function.
     *
     * You can customize the selected client output through its plugin. You can
     * also set `client` to `true` to automatically choose the client from your
     * defined plugins. If we can't detect a client plugin when using `true`, we
     * will default to `@hey-api/client-httpx`.
     *
     * @default true
     */
    client: PluginClientNames | false;
    /**
     * Configuration for generating SDK code examples.
     */
    examples: ExamplesConfig;
    /**
     * Define the structure of generated SDK operations.
     */
    operations: OperationsConfig;
    /** Return a page from a list operation, instead of the response model. */
    pagination:
      | false
      | { hasMore: string; items: string; nextCursor?: string; pageNumber?: string };
    /**
     * Define how request parameters are structured in generated SDK methods.
     *
     * - `'flat'` merges parameters into a single object.
     * - `'grouped'` separates parameters by transport layer.
     *
     * Use `'flat'` for simpler calls or `'grouped'` for stricter typing and code clarity.
     *
     * @default 'grouped'
     */
    paramsStructure: 'flat' | 'grouped';
  };

export type HeyApiSdkPlugin = DefinePlugin<UserConfig, Config, never, SdkImports>;
