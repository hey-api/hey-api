import type {
  IProject,
  Node,
  Symbol,
  SymbolIdentifier,
  SymbolIn,
  SymbolMeta,
} from '@hey-api/codegen-core';

import type { Hooks } from '../parser/hooks';
import type { PluginInstance } from '../plugins/shared/utils/instance';

export interface PluginInstanceTypes {}

/**
 * Resolves the Node type, falling back to base Node if not augmented.
 */
export type ResolvedNode = 'Node' extends keyof PluginInstanceTypes
  ? // @ts-expect-error ts cannot resolve conditional types properly here
    PluginInstanceTypes['Node']
  : Node;

export type EventHooks = {
  [K in keyof Required<NonNullable<Hooks['events']>>]: Array<
    NonNullable<NonNullable<Hooks['events']>[K]>
  >;
};

export class SymbolFactory {
  private readonly eventHooks: EventHooks;
  private readonly project: IProject;
  private readonly plugin?: PluginInstance;

  constructor(props: { eventHooks: EventHooks; plugin?: PluginInstance; project: IProject }) {
    this.eventHooks = props.eventHooks;
    this.project = props.project;
    this.plugin = props.plugin;
  }

  static buildEventHooks(
    scopes: ReadonlyArray<NonNullable<Hooks['events']> | undefined>,
  ): EventHooks {
    const result: EventHooks = {
      'node:set:after': [],
      'node:set:before': [],
      'plugin:handler:after': [],
      'plugin:handler:before': [],
      'symbol:register:after': [],
      'symbol:register:before': [],
    };
    for (const scope of scopes) {
      if (!scope) continue;
      for (const [key, value] of Object.entries(scope)) {
        if (value) {
          result[key as keyof typeof result].push(value.bind(scope) as any);
        }
      }
    }
    return result;
  }

  isRegistered(identifier: SymbolIdentifier): boolean {
    return this.project.symbols.isRegistered(identifier);
  }

  query<TNode extends Node = ResolvedNode>(
    filter: SymbolMeta,
    tags?: ReadonlyArray<NonNullable<TNode['~dsl']>>,
    predicate?: (symbol: Symbol<TNode>) => boolean,
  ): Symbol<TNode> | undefined {
    return this.queryAll<TNode>(filter, tags, predicate)[0];
  }

  queryAll<TNode extends Node = ResolvedNode>(
    filter: SymbolMeta,
    tags?: ReadonlyArray<NonNullable<TNode['~dsl']>>,
    predicate?: (symbol: Symbol<TNode>) => boolean,
  ): Array<Symbol<TNode>> {
    const results = this.project.symbols.query(filter) as Array<Symbol<TNode>>;
    if (!tags?.length && !predicate) return results;
    const set = tags?.length ? new Set(tags) : null;
    return results.filter((symbol) => {
      if (set && !set.has(symbol.node?.['~dsl'] ?? '')) return false;
      return predicate ? predicate(symbol) : true;
    });
  }

  reference(meta: SymbolMeta): Symbol<ResolvedNode> {
    return this.project.symbols.reference(meta);
  }

  register(name: SymbolIn['name'], symbol: Omit<SymbolIn, 'name'> = {}): Symbol<ResolvedNode> {
    const meta = { ...symbol.meta };
    if (symbol.external) {
      if (!meta.category) meta.category = 'external';
      if (!meta.resource) meta.resource = `${symbol.external}.${name}`;
      const existing = this.queryAll(meta).find((s) => s.name === name);
      if (existing) return existing;
    }
    const symbolIn: SymbolIn = { ...symbol, meta, name };
    for (const hook of this.eventHooks['symbol:register:before']) {
      hook({ plugin: this.plugin, symbol: symbolIn });
    }
    const symbolOut = this.project.symbols.register(symbolIn);
    for (const hook of this.eventHooks['symbol:register:after']) {
      hook({ plugin: this.plugin, symbol: symbolOut });
    }
    return symbolOut;
  }
}
