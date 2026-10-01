import { StructureModel } from '@hey-api/codegen-core';

import { getTypedConfig } from '../../../../config/utils';
import type { $ } from '../../../../py-dsl';
import { getClientPlugin } from '../../client-core/utils';
import { resolveStrategy } from '../operations';
import type { HeyApiSdkPlugin } from '../types';
import { createShell, type OperationItem, source, toNode } from './node';

/**
 * Whether to also emit an async mirror of every SDK class, alongside the
 * sync one. Only `@hey-api/client-httpx` has an async runtime counterpart
 * (`httpx.AsyncClient`), so this is only ever true when that plugin is the
 * resolved client and hasn't opted out via `asyncMode: false`.
 */
function shouldEmitAsync(plugin: HeyApiSdkPlugin['Instance']): boolean {
  const client = getClientPlugin(getTypedConfig(plugin));
  if (client.name !== '@hey-api/client-httpx') return false;
  const config = client.config as { asyncMode?: boolean };
  return config.asyncMode !== false;
}

function buildAndEmit(plugin: HeyApiSdkPlugin['Instance'], isAsync: boolean): void {
  const structure = new StructureModel();
  const shell = createShell(plugin, isAsync);
  const strategy = resolveStrategy(plugin);

  plugin.forEach(
    'operation',
    (event) => {
      structure.insert({
        data: {
          operation: event.operation,
          path: event._path,
          tags: event.tags,
        } satisfies OperationItem,
        locations: strategy(event.operation).map((path) => ({ path, shell })),
        source,
      });
    },
    { order: 'declarations' },
  );

  const allDependencies: Array<ReturnType<typeof $.class | typeof $.func>> = [];
  const allNodes: Array<ReturnType<typeof $.class | typeof $.func>> = [];

  for (const node of structure.walk()) {
    const { dependencies, nodes } = toNode(node, plugin, isAsync);
    allDependencies.push(...(dependencies ?? []));
    allNodes.push(...nodes);
  }

  for (const dep of allDependencies) {
    plugin.node(dep);
  }

  for (const node of allNodes) {
    plugin.node(node);
  }
}

export const handlerV1: HeyApiSdkPlugin['Handler'] = ({ plugin }) => {
  buildAndEmit(plugin, false);

  if (shouldEmitAsync(plugin)) {
    buildAndEmit(plugin, true);
  }
};
