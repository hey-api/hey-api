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
     * Parameters the client can supply, named as the spec names them.
     *
     * An API that declares the same parameter on every operation, such as a
     * header identifying the caller, otherwise requires it on every call even
     * though its value is set once on the client. Listing it here makes it
     * optional, so a caller passes it to override the client and otherwise
     * leaves the client to carry it, e.g. `Client(headers={'Actor-Id': ...})`
     * or `Client(params={'tenant': ...})`.
     *
     * A header is matched without regard to case, as HTTP defines it. A path
     * parameter stays required, since its value belongs to one call's URL and
     * the client has nothing to put in the placeholder. A body property is
     * unaffected.
     *
     * Applies to `paramsStructure: 'flat'`. Under `'grouped'` a parameter
     * belongs to a model the pydantic plugin generates, which this option
     * does not reach.
     *
     * @default []
     */
    clientParameters?: ReadonlyArray<string>;
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
    /** Parameters the client can supply, named as the spec names them. */
    clientParameters: ReadonlyArray<string>;
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
