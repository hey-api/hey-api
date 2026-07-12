import type { DefinePlugin, NameTransformer, OperationsStrategy, Plugin } from '@hey-api/shared';

import type { PluginClientNames, PluginTransformerNames, PluginValidatorNames } from '../../types';
import type { ExamplesConfig, UserExamplesConfig } from './examples';
import type { SdkImports } from './imports';
import type { OperationsConfig, UserOperationsConfig } from './operations';

export type UserConfig = Plugin.Name<'@hey-api/sdk'> &
  Plugin.Hooks &
  Plugin.UserComments &
  Plugin.UserExports & {
    /**
     * Should the generated functions contain auth mechanisms? You may want to
     * disable this option if you're handling auth yourself or defining it
     * globally on the client and want to reduce the size of generated code.
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
     * will default to `@hey-api/client-fetch`.
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
     * - `'flat'` – standalone functions, no container
     * - `'single'` – all operations in a single container
     * - custom function for full control
     *
     * Use the object form for advanced configuration.
     *
     * @default 'flat'
     */
    operations?: OperationsStrategy | UserOperationsConfig;
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
    /**
     * **This feature works only with the Fetch client**
     *
     * Should we return only data or multiple fields (data, error, response, etc.)?
     *
     * @default 'fields'
     */
    responseStyle?: 'data' | 'fields';
    /**
     * Transform response data before returning. This is useful if you want to
     * convert for example ISO strings into Date objects. However, transformation
     * adds runtime overhead, so it's not recommended to use unless necessary.
     *
     * You can customize the transformer output through its plugin. You can also
     * set `transformer` to `true` to automatically choose the transformer from your
     * defined plugins.
     *
     * Ensure you have declared the selected library as a dependency to avoid
     * errors.
     *
     * @default false
     */
    transformer?:
      | PluginTransformerNames
      | boolean
      | {
          /**
           * Transform response data before returning.
           *
           * Can be a transformer plugin name or boolean (true to auto-select, false
           * to disable).
           *
           * @default false
           */
          response?: PluginTransformerNames | boolean;
        };
    /**
     * Validate request and/or response data against schema before returning.
     * This is useful if you want to ensure the request and/or response conforms
     * to a desired shape. However, validation adds runtime overhead, so it's
     * not recommended to use unless absolutely necessary.
     *
     * You can customize the validator output through its plugin. You can also
     * set `validator` to `true` to automatically choose the validator from your
     * defined plugins.
     *
     * You can enable/disable validation for requests and responses separately
     * by setting `validator` to an object `{ request, response }`.
     *
     * Ensure you have declared the selected library as a dependency to avoid
     * errors.
     *
     * @default false
     */
    validator?:
      | PluginValidatorNames
      | boolean
      | {
          /**
           * Validate request data against schema before sending.
           *
           * Can be a validator plugin name or boolean (true to auto-select, false
           * to disable).
           *
           * @default false
           */
          request?: PluginValidatorNames | boolean;
          /**
           * Validate response data against schema before returning.
           *
           * Can be a validator plugin name or boolean (true to auto-select, false
           * to disable).
           *
           * @default false
           */
          response?: PluginValidatorNames | boolean;
        };

    // DEPRECATED OPTIONS BELOW

    /**
     * Group operation methods into classes? When enabled, you can select which
     * classes to export with `sdk.include` and/or transform their names with
     * `sdk.classNameBuilder`.
     *
     * Note that by enabling this option, your SDKs will **NOT**
     * support {@link https://developer.mozilla.org/docs/Glossary/Tree_shaking tree-shaking}.
     * For this reason, it is disabled by default.
     *
     * @deprecated Use `operations: { strategy: "byTags" }` or `operations: { strategy: "single" }` instead.
     * @default false
     */
    // oxlint-disable-next-line typescript-sort-keys/interface
    asClass?: boolean;
    /**
     * Customize the generated class names. The name variable is obtained from
     * your OpenAPI specification tags or `instance` value.
     *
     * This option has no effect if `sdk.asClass` is `false`.
     *
     * @deprecated Use `operations: { containerName: "..." }` instead.
     */
    classNameBuilder?: NameTransformer;
    /**
     * How should we structure your SDK? By default, we try to infer the ideal
     * structure using `operationId` keywords. If you prefer a flatter structure,
     * you can set `classStructure` to `off` to disable this behavior.
     *
     * @deprecated Use `operations: { nesting: "operationId" }` or `operations: { nesting: "id" }` instead.
     * @default 'auto'
     */
    classStructure?: 'auto' | 'off';
    /**
     * Set `instance` to create an instantiable SDK. Using `true` will use the
     * default instance name; in practice, you want to define your own by passing
     * a string value.
     *
     * @deprecated Use `operations: { strategy: "single", containerName: "Name", methods: "instance" }` instead.
     * @default false
     */
    instance?: string | boolean;
    /**
     * Customise the name of methods within the service. By default,
     * `operation.id` is used.
     *
     * @deprecated Use `operations: { methodName: "..." }` instead.
     */
    methodNameBuilder?: NameTransformer;
    /**
     * Use operation ID to generate operation names?
     *
     * @deprecated Use `operations: { nesting: "operationId" }` or `operations: { nesting: "id" }` instead.
     * @default true
     */
    operationId?: boolean;
    /**
     * Define shape of returned value from service calls
     *
     * @deprecated
     * @default 'body'
     */
    response?: 'body' | 'response';
  };

export type Config = Plugin.Name<'@hey-api/sdk'> &
  Plugin.Hooks &
  Plugin.Comments &
  Plugin.Exports & {
    /** Should the generated functions contain auth mechanisms? */
    auth: boolean;
    /** Use an internal client instance to send HTTP requests? */
    client: PluginClientNames | false;
    /** Configuration for generating SDK code examples. */
    examples: ExamplesConfig;
    /** Define the structure of generated SDK operations. */
    operations: OperationsConfig;
    /** Define how request parameters are structured in generated SDK methods. */
    paramsStructure: 'flat' | 'grouped';
    /**
     * **This feature works only with the Fetch client**
     *
     * Should we return only data or multiple fields (data, error, response, etc.)?
     *
     * @default 'fields'
     */
    responseStyle: 'data' | 'fields';
    /** Transform response data before returning. */
    transformer: {
      /** The transformer plugin to use for response transformation, or false to disable. */
      response: PluginTransformerNames | false;
    };
    /** Validate request and/or response data against schema before returning. */
    validator: {
      /** The validator plugin to use for request validation, or false to disable. */
      request: PluginValidatorNames | false;
      /** The validator plugin to use for response validation, or false to disable. */
      response: PluginValidatorNames | false;
    };

    // DEPRECATED OPTIONS BELOW

    /**
     * Define shape of returned value from service calls
     *
     * @deprecated
     * @default 'body'
     */
    // oxlint-disable-next-line typescript-sort-keys/interface
    response: 'body' | 'response';
  };

export type HeyApiSdkPlugin = DefinePlugin<UserConfig, Config, never, SdkImports>;
