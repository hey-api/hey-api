import type { Logger, Project } from '@hey-api/codegen-core';

import type { AnyConfig } from '../config/shared';
import type { Dependency } from '../config/utils/dependencies';
import { dependencyFactory } from '../config/utils/dependencies';
import type { Graph } from '../graph';
import { PluginInstance } from '../plugins/shared/utils/instance';
import type { Plugin, PluginConfigMap, PluginNames } from '../plugins/types';
import { resolveRef } from '../utils/ref';
import type { ExampleIntent } from './intents';
import type { IR } from './types';

export class Context<Spec extends Record<string, any> = any, Config extends AnyConfig = AnyConfig> {
  /**
   * Configuration for parsing and generating the output. This
   * is a mix of user-provided and default values.
   */
  config: Config;
  /** The code generation project instance used to manage files, symbols, */
  gen: Project;
  /** The dependency graph built from the intermediate representation. */
  graph: Graph | undefined;
  /** Intents declared by plugins. */
  intents: Array<ExampleIntent> = [];
  /** Intermediate representation model obtained from `spec`. */
  ir: IR.Model = {};
  /** Logger instance. */
  logger: Logger;
  /**
   * The package metadata and utilities for the current context, constructed
   * from the provided dependencies. Used for managing package-related
   * information such as name, version, and dependency resolution during
   * code generation.
   */
  package: Dependency;
  /**
   * A map of registered plugin instances, keyed by plugin name. Plugins are
   * registered through the `registerPlugin` method and can be accessed by
   * their configured name from the config.
   */
  plugins: Partial<Record<PluginNames, PluginInstance<PluginConfigMap[keyof PluginConfigMap]>>> =
    {};
  /** Resolved specification from `input`. */
  spec: Spec;

  constructor({
    config,
    dependencies,
    logger,
    project,
    spec,
  }: {
    config: Config;
    dependencies: Record<string, string>;
    logger: Logger;
    project: Project;
    spec: Spec;
  }) {
    this.config = config;
    this.gen = project;
    this.logger = logger;
    this.package = dependencyFactory(dependencies);
    this.spec = spec;
  }

  /**
   * Returns a resolved and dereferenced schema from `spec`.
   */
  dereference<T>(schema: { $ref: string }) {
    const resolved = this.resolveRef<T>(schema.$ref);
    const dereferenced = {
      ...schema,
      ...resolved,
    } as T;
    // @ts-expect-error
    delete dereferenced.$ref;
    return dereferenced;
  }

  /**
   * Registers a new plugin to the global context.
   *
   * @param name Plugin name.
   * @returns Registered plugin instance.
   */
  private registerPlugin<T extends PluginNames>(
    name: T,
  ): T extends keyof PluginConfigMap ? PluginInstance<PluginConfigMap[T]> : PluginInstance {
    const plugin = (this.config.plugins as unknown as Record<string, Plugin.Stored<Plugin.Types>>)[
      name
    ]!;
    if (typeof plugin.handler !== 'function') {
      throw new Error(
        `Plugin "${name}" is missing a valid "handler" function. ` +
          'Plugins must be registered as objects with a `handler`, e.g. ' +
          `{ name: "${name}", handler: ({ plugin }) => { ... } }.`,
      );
    }
    const instance = new PluginInstance({
      api: plugin.api,
      config: plugin.config,
      context: this,
      dependencies: plugin.dependencies ?? new Set(),
      gen: this.gen,
      handler: plugin.handler,
      imports: plugin.imports,
      name: plugin.name,
      symbolMeta: plugin.symbolMeta,
    });
    (this.plugins as Record<string, any>)[instance.name] = instance;
    return instance as T extends keyof PluginConfigMap
      ? PluginInstance<PluginConfigMap[T]>
      : PluginInstance;
  }

  /**
   * Registers all plugins in the order specified by the configuration and returns
   * an array of the registered PluginInstance objects. Each plugin is instantiated
   * and added to the context's plugins map.
   *
   * @returns {ReadonlyArray<PluginInstance>} An array of registered plugin instances in order.
   */
  registerPlugins(): ReadonlyArray<PluginInstance> {
    return this.config.pluginOrder.map((name) => this.registerPlugin(name));
  }

  // TODO: parser - works the same as resolveRef, but for IR schemas.
  // for now, they map 1:1, but if they diverge (like with OpenAPI 2.0),
  // we will want to rewrite $refs at parse time, so they continue pointing
  // to the correct IR location
  resolveIrRef<T>($ref: string) {
    return resolveRef<T>({
      $ref,
      spec: this.ir,
    });
  }

  /**
   * Returns a resolved reference from `spec`.
   */
  resolveRef<T>($ref: string) {
    return resolveRef<T>({
      $ref,
      spec: this.spec,
    });
  }
}
