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
     * Should the generated methods contain auth mechanisms? You may want to
     * disable this option if you're handling auth yourself or defining it
     * differently.
     *
     * @default true
     */
    auth?: boolean;
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
    /** Should the generated methods contain auth mechanisms? */
    auth: boolean;
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
