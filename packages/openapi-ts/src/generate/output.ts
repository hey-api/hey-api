import fs from 'node:fs';
import fsPromises from 'node:fs/promises';
import path from 'node:path';

import type { Context } from '@hey-api/shared';
import { IntentContext } from '@hey-api/shared';

import { getTypedConfig } from '../config/utils';
import { getClientPlugin } from '../plugins/@hey-api/client-core/utils';
import { generateClientBundle } from './client';

export async function generateOutput(context: Context): Promise<{ fileCount: number }> {
  const outputPath = path.resolve(context.config.output.path);

  if (context.config.output.clean) {
    if (fs.existsSync(outputPath)) {
      fs.rmSync(outputPath, { force: true, recursive: true });
    }
  }

  const config = getTypedConfig(context);

  const client = getClientPlugin(config);
  if ('bundle' in client.config && client.config.bundle && !config.dryRun) {
    // not proud of this one
    // @ts-expect-error
    config._FRAGILE_CLIENT_BUNDLE_RENAMED = await generateClientBundle({
      header: config.output.header,
      module: config.output.module,
      outputPath,
      // @ts-expect-error
      plugin: client,
      project: context.gen,
    });
  }

  const eventPlugins = context.logger.timeEvent('generator.plugins');
  for (const plugin of context.registerPlugins()) {
    const eventPlugin = context.logger.timeEvent(`generator.plugins.${plugin.name}`);
    await plugin.run();
    eventPlugin.timeEnd();
  }
  eventPlugins.timeEnd();

  const eventPlan = context.logger.timeEvent('generator.plan');
  context.gen.plan();
  eventPlan.timeEnd();

  if (process.env.HEY_API_DUMP_REGISTRY) {
    const dumpPath = path.resolve(outputPath, 'registry-dump.json');
    await fsPromises.mkdir(outputPath, { recursive: true });
    await fsPromises.writeFile(dumpPath, JSON.stringify(context.gen.symbols.dump(), null, 2), {
      encoding: 'utf8',
    });
  }

  const eventIntents = context.logger.timeEvent('generator.intents');
  const ctx = new IntentContext(context.spec);
  for (const intent of context.intents) {
    await intent.run(ctx);
  }
  eventIntents.timeEnd();

  const eventRender = context.logger.timeEvent('generator.render-and-write');
  let fileCount = 0;
  const writes: Promise<void>[] = [];
  for (const file of context.gen.render()) {
    const filePath = path.resolve(outputPath, file.path);
    const dir = path.dirname(filePath);
    if (!context.config.dryRun) {
      writes.push(
        fsPromises
          .mkdir(dir, { recursive: true })
          .then(() => fsPromises.writeFile(filePath, file.content, { encoding: 'utf8' })),
      );
    }
    fileCount++;
  }
  await Promise.all(writes);
  eventRender.timeEnd();

  const eventSource = context.logger.timeEvent('generator.source');
  const { source } = context.config.output;
  if (source.enabled) {
    const sourcePath = source.path === null ? undefined : path.resolve(outputPath, source.path);
    if (!context.config.dryRun && sourcePath && sourcePath !== outputPath) {
      await fsPromises.mkdir(sourcePath, { recursive: true });
    }
    const serialized = await source.serialize(context.spec);
    // TODO: handle yaml (convert before writing)
    if (!context.config.dryRun && sourcePath) {
      await fsPromises.writeFile(
        path.resolve(sourcePath, `${source.fileName}.${source.extension}`),
        serialized,
        { encoding: 'utf8' },
      );
      fileCount++;
    }
    if (source.callback) {
      await source.callback(serialized);
    }
  }
  eventSource.timeEnd();

  return { fileCount };
}
