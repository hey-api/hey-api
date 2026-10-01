import path from 'node:path';

import type { IProject, Node, Symbol, SymbolIn } from '@hey-api/codegen-core';

import type { Dependency } from '../../../config/utils/dependencies';
import { HeyApiError } from '../../../error';
import type { MatchPointerToGroupFn, WalkOptions } from '../../../graph';
import { walk } from '../../../graph';
import type { Context } from '../../../ir/context';
import type { IrTopLevelKind } from '../../../ir/graph';
import {
  getIrPointerPriority,
  irTopLevelKinds,
  matchIrPointerToGroup,
  preferGroups,
} from '../../../ir/graph';
import type { ExampleIntent } from '../../../ir/intents';
import type { IR } from '../../../ir/types';
import type { Hooks } from '../../../parser/hooks';
import { jsonPointerToPath } from '../../../utils/ref';
import type { EventHooks, ResolvedNode } from '../../../utils/symbols';
import { SymbolFactory } from '../../../utils/symbols';
import type { AnyPluginName, Plugin, PluginConfigMap } from '../../types';
import type { BaseEvent, WalkEvent } from '../types/instance';

// TODO: abstract
function defaultGetFilePath(symbol: Symbol): string | undefined {
  if (!symbol.meta?.plugin || typeof symbol.meta.plugin !== 'string') {
    return;
  }
  if (symbol.meta.plugin.startsWith('@hey-api/client-')) {
    return 'client';
  }
  if (symbol.meta.plugin === '@hey-api/typescript') {
    return 'types';
  }
  if (symbol.meta.plugin === '@hey-api/python-sdk') {
    return 'sdk';
  }
  if (symbol.meta.plugin.startsWith('@hey-api/')) {
    return symbol.meta.plugin.split('/')[1];
  }
  return symbol.meta.plugin;
}

const defaultGetKind: Required<Required<Hooks>['operations']>['getKind'] = (operation) => {
  switch (operation.method) {
    case 'delete':
    case 'patch':
    case 'post':
    case 'put':
      return ['mutation'];
    case 'get':
    case 'query':
      return ['query'];
    default:
      return;
  }
};

export class PluginInstance<T extends Plugin.Types = Plugin.Types> {
  api: T['api'];
  config: Omit<T['resolvedConfig'], 'name'>;
  context: Context;
  dependencies: Set<AnyPluginName> = new Set();
  private eventHooks: EventHooks;
  gen: IProject;
  private handler: Plugin.Config<T>['handler'];
  /** External symbols imported from other modules. */
  imports: T['imports'];
  name: T['resolvedConfig']['name'];
  /**
   * The package metadata and utilities for the current context, constructed
   * from the provided dependencies. Used for managing package-related
   * information such as name, version, and dependency resolution during
   * code generation.
   */
  package: Dependency;
  /** Factory for creating and managing symbols. */
  symbolFactory: SymbolFactory;
  /** Metadata merged into every symbol this plugin creates. */
  symbolMeta: Plugin.Config<T>['symbolMeta'];

  readonly isSymbolRegistered: SymbolFactory['isRegistered'];
  readonly querySymbol: SymbolFactory['query'];
  readonly referenceSymbol: SymbolFactory['reference'];

  constructor(
    props: Pick<Plugin.Config<T>, 'api' | 'handler' | 'imports' | 'name' | 'symbolMeta'> & {
      config: Omit<T['resolvedConfig'], 'name'>;
      context: Context;
      dependencies: Set<AnyPluginName>;
      gen: IProject;
    },
  ) {
    this.api = props.api ?? {};
    this.config = props.config;
    this.context = props.context;
    this.dependencies = props.dependencies;
    this.gen = props.gen;
    this.handler = props.handler;
    this.name = props.name;
    this.package = props.context.package;
    this.symbolMeta = props.symbolMeta;
    // buildEventHooks must run after this.name, this.gen, and
    // this.context are set, as hooks may rely on them
    this.eventHooks = SymbolFactory.buildEventHooks([
      this.config['~hooks']?.events,
      this.config.$hooks?.events,
      this.context.config.parser.hooks.events,
    ]);
    this.symbolFactory = new SymbolFactory({
      eventHooks: this.eventHooks,
      plugin: this,
      project: this.gen,
    });
    this.isSymbolRegistered = this.symbolFactory.isRegistered.bind(this.symbolFactory);
    this.querySymbol = this.symbolFactory.query.bind(this.symbolFactory);
    this.referenceSymbol = this.symbolFactory.reference.bind(this.symbolFactory);
    // imports must be initialized last — the function calls this.symbol() which
    // requires this.name, this.gen, this.context, and this.eventHooks to be set.
    this.imports = props.imports?.(this) ?? {};
  }

  /**
   * Iterates over various input elements as specified by the event types, in
   * a specific order: servers, schemas, parameters, request bodies, then
   * operations.
   *
   * This ensures, for example, that schemas are always processed before
   * operations, which may reference them.
   *
   * @template TKind - The event type(s) to yield. Defaults to all event types.
   * @param events - The event types to walk over. If none are provided, all event types are included.
   * @param callback - Function to execute for each event.
   *
   * @example
   * // Iterate over all operations and schemas
   * plugin.forEach('operation', 'schema', (event) => {
   *   if (event.type === 'operation') {
   *     // handle operation
   *   } else if (event.type === 'schema') {
   *     // handle schema
   *   }
   * });
   */
  forEach<TKind extends IrTopLevelKind = IrTopLevelKind>(
    ...args: [...events: ReadonlyArray<TKind>, callback: (event: WalkEvent<TKind>) => void]
  ): void;
  forEach<TKind extends IrTopLevelKind = IrTopLevelKind>(
    ...args: [
      ...events: ReadonlyArray<TKind>,
      callback: (event: WalkEvent<TKind>) => void,
      options: WalkOptions<TKind>,
    ]
  ): void;
  forEach<TKind extends IrTopLevelKind = IrTopLevelKind>(
    ...args: [
      ...events: ReadonlyArray<TKind>,
      callback: (event: WalkEvent<TKind>) => void,
      options: any,
    ]
  ): void {
    if (!this.context.graph) {
      throw new Error('No graph available in context');
    }

    let callback: (event: WalkEvent<TKind>) => void;
    let events: ReadonlyArray<TKind>;
    let options: WalkOptions<TKind> = {
      getPointerPriority: getIrPointerPriority,
      // default functions operate on the full union of kinds; cast them
      // to the WalkOptions generic to keep strict typing for callers.
      matchPointerToGroup: matchIrPointerToGroup as unknown as MatchPointerToGroupFn<TKind>,
      order: 'topological',
      preferGroups: preferGroups as unknown as ReadonlyArray<TKind>,
    };
    if (typeof args[args.length - 1] === 'function') {
      events = args.slice(0, -1);
      callback = args[args.length - 1];
    } else {
      events = args.slice(0, -2);
      callback = args[args.length - 2];
      options = {
        ...options,
        ...args[args.length - 1],
      };
    }
    const eventSet = new Set(events.length ? events : irTopLevelKinds);

    walk(
      this.context.graph,
      (pointer, nodeInfo) => {
        const result = matchIrPointerToGroup(pointer);
        if (!result.matched || !eventSet.has(result.kind)) return;
        let event: WalkEvent | undefined;
        const baseEvent: BaseEvent = {
          _path: jsonPointerToPath(pointer),
          pointer,
          tags: nodeInfo.tags ? Array.from(nodeInfo.tags) : undefined,
        };
        switch (result.kind) {
          case 'operation':
            event = {
              ...baseEvent,
              method: nodeInfo.key as keyof IR.PathItemObject,
              operation: nodeInfo.node as IR.OperationObject,
              path: baseEvent._path[1] as string,
              type: result.kind,
            } satisfies WalkEvent<'operation'>;
            break;
          case 'parameter':
            event = {
              ...baseEvent,
              name: nodeInfo.key as string,
              parameter: nodeInfo.node as IR.ParameterObject,
              type: result.kind,
            } satisfies WalkEvent<'parameter'>;
            break;
          case 'requestBody':
            event = {
              ...baseEvent,
              name: nodeInfo.key as string,
              requestBody: nodeInfo.node as IR.RequestBodyObject,
              type: result.kind,
            } satisfies WalkEvent<'requestBody'>;
            break;
          case 'schema':
            event = {
              ...baseEvent,
              name: nodeInfo.key as string,
              schema: nodeInfo.node as IR.SchemaObject,
              type: result.kind,
            } satisfies WalkEvent<'schema'>;
            break;
          case 'server':
            event = {
              ...baseEvent,
              server: nodeInfo.node as IR.ServerObject,
              type: result.kind,
            } satisfies WalkEvent<'server'>;
            break;
          case 'webhook':
            event = {
              ...baseEvent,
              key: baseEvent._path[1] as string,
              method: nodeInfo.key as keyof IR.PathItemObject,
              operation: nodeInfo.node as IR.OperationObject,
              type: result.kind,
            } satisfies WalkEvent<'webhook'>;
            break;
        }
        if (event) {
          try {
            callback(event as WalkEvent<TKind>);
          } catch (error) {
            this.forEachError(error, event);
          }
        }
      },
      options,
    );
  }

  getHooks<T>(
    selector: (hooks: Hooks) => T | undefined,
    ...customHooks: ReadonlyArray<T | undefined>
  ): Array<NonNullable<T>> {
    const result: Array<NonNullable<T>> = [];
    for (const hook of customHooks) {
      if (hook) result.push(hook);
    }
    const local = selector(this.config.$hooks ?? {});
    if (local) result.push(local);
    const localDeprecated = selector(this.config['~hooks'] ?? {});
    if (localDeprecated) result.push(localDeprecated);
    const global = selector(this.context.config.parser.hooks);
    if (global) result.push(global);
    return result;
  }

  /**
   * Retrieves a registered plugin instance by its name from the context. This
   * allows plugins to access other plugins that have been registered in the
   * same context, enabling cross-plugin communication and dependencies.
   *
   * @param name Plugin name as defined in the configuration.
   * @returns The plugin instance if found, undefined otherwise.
   */
  getPlugin<TName extends keyof PluginConfigMap>(
    name: TName,
  ): TName extends any ? PluginInstance<PluginConfigMap[TName]> | undefined : never {
    return this.context.plugins[name] as any;
  }

  /**
   * Retrieves a registered plugin instance by its name from the context. This
   * allows plugins to access other plugins that have been registered in the
   * same context, enabling cross-plugin communication and dependencies.
   *
   * @param name Plugin name as defined in the configuration.
   * @returns The plugin instance if found, throw otherwise.
   */
  getPluginOrThrow<TName extends keyof PluginConfigMap>(
    name: TName,
  ): TName extends any ? PluginInstance<PluginConfigMap[TName]> : never {
    const plugin = this.getPlugin(name);
    if (!plugin) throw new Error(`plugin not found ${name}`);
    return plugin as any;
  }

  hooks = {
    operation: {
      isMutation: (operation: IR.OperationObject): boolean =>
        this.isOperationKind(operation, 'mutation'),
      isQuery: (operation: IR.OperationObject): boolean => this.isOperationKind(operation, 'query'),
    },
  };

  /**
   * Registers an intent in the context's intent list.
   *
   * @param intent The intent to be registered.
   * @returns void
   */
  intent(intent: ExampleIntent): void {
    this.context.intents.push(intent);
  }

  /**
   * Sets or adds a node to the project graph.
   *
   * @param node The node to be added or updated in the project graph.
   * @param index The index at which to update the node. If undefined, the node will be added.
   * @returns The index of the added node or void if updated.
   */
  node<T extends number | undefined = undefined>(
    node: Node | null,
    index?: T,
  ): T extends number ? void : number {
    for (const hook of this.eventHooks['node:set:before']) {
      hook({ node, plugin: this as any });
    }
    const result =
      index !== undefined ? this.gen.nodes.update(index, node) : this.gen.nodes.add(node);
    for (const hook of this.eventHooks['node:set:after']) {
      hook({ node, plugin: this as any });
    }
    return result as T extends number ? void : number;
  }

  /**
   * Executes plugin's handler function.
   */
  async run(): Promise<void> {
    for (const hook of this.eventHooks['plugin:handler:before']) {
      hook({ plugin: this as any });
    }
    await this.handler({ plugin: this });
    for (const hook of this.eventHooks['plugin:handler:after']) {
      hook({ plugin: this as any });
    }
  }

  symbol(name: SymbolIn['name'], symbol?: Omit<SymbolIn, 'name'>): Symbol<ResolvedNode>;
  symbol(symbol: SymbolIn): Symbol<ResolvedNode>;
  symbol(
    nameOrSymbol: SymbolIn['name'] | SymbolIn,
    symbolArg: Omit<SymbolIn, 'name'> = {},
  ): Symbol<ResolvedNode> {
    let name: SymbolIn['name'];
    let symbol: Omit<SymbolIn, 'name'>;
    if (typeof nameOrSymbol === 'object') {
      const { name: _name, ...rest } = nameOrSymbol;
      name = _name;
      symbol = rest;
    } else {
      name = nameOrSymbol;
      symbol = symbolArg;
    }
    const meta = !symbol.external && this.symbolMeta ? this.symbolMeta(symbol) : {};
    Object.assign(meta, symbol.meta);
    if (!symbol.external) {
      meta.plugin = path.isAbsolute(this.name) ? 'custom' : this.name;
    }
    return this.symbolFactory.register(name, {
      ...symbol,
      getExportFromFilePath:
        symbol.getExportFromFilePath ?? this.getSymbolExportFromFilePath.bind(this),
      getFilePath: symbol.getFilePath ?? this.getSymbolFilePath.bind(this),
      meta,
    });
  }

  // TODO: add ability to inject custom imports, then remove
  /**
   * Registers a symbol only if it does not already exist based on the provided
   * name and metadata. This prevents duplicate symbols from being created in
   * the project.
   */
  symbolOnce(name: SymbolIn['name'], symbol: Omit<SymbolIn, 'name'> = {}): Symbol {
    // `.symbol()` will handle the external symbol deduplication
    if (symbol.external) return this.symbol(name, symbol);
    if (symbol.meta) {
      const existing = this.symbolFactory.queryAll(symbol.meta).find((s) => s.name === name);
      if (existing) return existing;
    }
    return this.symbol(name, symbol);
  }

  private forEachError(error: unknown, event: WalkEvent) {
    const originalError = error instanceof Error ? error : new Error(String(error));
    throw new HeyApiError({
      args: [event],
      error: originalError,
      event: event.type,
      name: 'Error',
      pluginName: this.name,
    });
  }

  private getSymbolExportFromFilePath(symbol: Symbol): ReadonlyArray<string> | undefined {
    for (const hook of this.getHooks((hooks) => hooks.symbols?.getExportFromFilePath)) {
      const result = hook(symbol);
      if (result !== undefined) return result;
    }

    // default logic below
    const entryFile = this.context.config.output.indexFile ?? this.context.config.output.entryFile;
    if (symbol.external || !entryFile) return;

    const includeInEntry = this.config.exportFromIndex ?? this.config.includeInEntry;
    if (
      (typeof includeInEntry === 'boolean' && !includeInEntry) ||
      (typeof includeInEntry === 'function' && !includeInEntry(symbol))
    ) {
      return;
    }

    const language = symbol.node?.language;
    if (!language) return;

    const moduleEntryName = this.gen.moduleEntryNames[language];
    if (!moduleEntryName) return;

    return [moduleEntryName];
  }

  private getSymbolFilePath(symbol: Symbol): string | undefined {
    for (const hook of this.getHooks((hooks) => hooks.symbols?.getFilePath)) {
      const result = hook(symbol);
      if (result !== undefined) return result;
    }
    return defaultGetFilePath(symbol);
  }

  private isOperationKind(operation: IR.OperationObject, kind: 'mutation' | 'query'): boolean {
    const method = kind === 'query' ? 'isQuery' : 'isMutation';
    const hooks = [
      this.config.$hooks?.operations?.[method],
      this.config.$hooks?.operations?.getKind,
      this.config['~hooks']?.operations?.[method],
      this.config['~hooks']?.operations?.getKind,
      this.context.config.parser.hooks.operations?.[method],
      this.context.config.parser.hooks.operations?.getKind,
      defaultGetKind,
    ];
    for (const hook of hooks) {
      if (hook) {
        const result = hook(operation);
        if (result !== undefined) {
          return typeof result === 'boolean' ? result : result.includes(kind);
        }
      }
    }
    return false;
  }
}
