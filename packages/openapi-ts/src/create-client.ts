import path from 'node:path';

import { type Logger, Project } from '@hey-api/codegen-core';
import { $RefParser, ResolverError } from '@hey-api/json-schema-ref-parser';
import type { Input, OpenApi, WatchValues } from '@hey-api/shared';
import {
  applyNaming,
  buildGraph,
  compileInputPath,
  Context,
  getSpec,
  InputError,
  logInputPaths,
  parseOpenApiSpec,
  patchOpenApiSpec,
  postprocessOutput,
} from '@hey-api/shared';
import { format as ms } from '@lukeed/ms';
import colors from 'ansi-colors';

import { postProcessors } from './config/output/postprocess';
import type { Config } from './config/types';
import { cleanupSeaExtract } from './generate/client';
import { generateOutput } from './generate/output';
import { TypeScriptRenderer } from './ts-dsl';

export async function createClient({
  config,
  dependencies,
  jobIndex,
  logger,
  watches: _watches,
}: {
  config: Config;
  dependencies: Record<string, string>;
  jobIndex: number;
  logger: Logger;
  /**
   * Always undefined on the first run, defined on subsequent runs.
   */
  watches?: ReadonlyArray<WatchValues>;
}): Promise<Context | undefined> {
  const watches: ReadonlyArray<WatchValues> =
    _watches ||
    Array.from({ length: config.input.length }, () => ({
      headers: new Headers(),
    }));

  const jobStart = Date.now();
  const inputPaths = config.input.map((input) => compileInputPath(input));

  // on first run, print the message as soon as possible
  if (!_watches) {
    logInputPaths(inputPaths, jobIndex, config.logs.level);
  }

  const getSpecData = async (input: Input, index: number) => {
    const eventSpec = logger.timeEvent('spec');
    const { arrayBuffer, error, resolvedInput, response } = await getSpec({
      fetchOptions: input.fetch,
      inputPath: inputPaths[index]!.path,
      timeout: input.watch.timeout,
      watch: watches[index]!,
    });
    eventSpec.timeEnd();

    // throw on first run if there's an error to preserve user experience
    // if in watch mode, subsequent errors won't throw to gracefully handle
    // cases where server might be reloading
    if (error && !_watches) {
      const text = await response.text().catch(() => '');
      const message = `Request failed with status ${response.status}: ${text || response.statusText}`;
      // Handle 4xx client errors as input errors (bad URL, bad API key, etc.)
      if (response.status >= 400 && response.status < 500) {
        const statusText = response.statusText || 'Unknown';
        const originalError = new Error(message) as Error & { source?: string };
        originalError.source = String(inputPaths[index]!.path);
        throw new InputError(
          `Input request failed: ${response.status} ${statusText}`,
          originalError,
        );
      }
      // For 5xx server errors, keep the generic error (could be a bug)
      throw new Error(message);
    }

    return { arrayBuffer, resolvedInput };
  };
  const specData = (
    await Promise.all(config.input.map((input, index) => getSpecData(input, index)))
  ).filter((data) => data.arrayBuffer || data.resolvedInput);

  let context: Context | undefined;

  if (specData.length) {
    const refParser = new $RefParser();
    let data: unknown;
    try {
      data =
        specData.length > 1
          ? await refParser.bundleMany({
              arrayBuffer: specData.map((data) => data.arrayBuffer!),
              pathOrUrlOrSchemas: [],
              resolvedInputs: specData.map((data) => data.resolvedInput!),
            })
          : await refParser.bundle({
              arrayBuffer: specData[0]!.arrayBuffer,
              pathOrUrlOrSchema: undefined,
              resolvedInput: specData[0]!.resolvedInput!,
            });
    } catch (err) {
      if (err instanceof ResolverError && err.ioErrorCode === 'ENOENT') {
        throw new InputError('Input file not found', err);
      }
      throw err;
    }

    // on subsequent runs in watch mode, print the message only if we know we're
    // generating the output
    if (_watches) {
      console.clear();
      logInputPaths(inputPaths, jobIndex, config.logs.level);
    }

    const eventInputPatch = logger.timeEvent('input.patch');
    await patchOpenApiSpec({ patchOptions: config.parser.patch, spec: data });
    eventInputPatch.timeEnd();

    const eventParser = logger.timeEvent('parser');
    const header = config.output.header;
    // TODO: allow overriding via config
    const project = new Project({
      defaultFileName: 'index',
      fileName: (base) => {
        const name = applyNaming(base, config.output.fileName);
        const { suffix } = config.output.fileName;
        if (!suffix) {
          return name;
        }
        return name === 'index' || name.endsWith(suffix) ? name : `${name}${suffix}`;
      },
      nameConflictResolvers: config.output.nameConflictResolver
        ? {
            typescript: config.output.nameConflictResolver,
          }
        : undefined,
      renderers: [
        new TypeScriptRenderer({
          header: (ctx) => {
            const defaultValue = ['// This file is auto-generated by @hey-api/openapi-ts'];
            const result = typeof header === 'function' ? header({ ...ctx, defaultValue }) : header;
            return result === undefined ? defaultValue : result;
          },
          module: config.output.module,
          preferExportAll: config.output.preferExportAll,
          printer: config.output.printer,
        }),
      ],
      root: config.output.path,
    });
    context = new Context<OpenApi.V2_0_X | OpenApi.V3_0_X | OpenApi.V3_1_X, Config>({
      config,
      dependencies,
      logger,
      project,
      spec: data as OpenApi.V2_0_X | OpenApi.V3_0_X | OpenApi.V3_1_X,
    });
    parseOpenApiSpec(context);
    context.graph = buildGraph(context.ir, logger).graph;
    eventParser.timeEnd();

    const eventGenerator = logger.timeEvent('generator');
    const { fileCount } = await generateOutput(context);
    cleanupSeaExtract();
    eventGenerator.timeEnd();

    const totalMs = Date.now() - jobStart;

    const eventPostprocess = logger.timeEvent('postprocess');
    if (!config.dryRun) {
      const jobPrefix = colors.gray(`[Job ${jobIndex + 1}] `);
      postprocessOutput(config.output, postProcessors, jobPrefix);

      if (config.logs.level !== 'silent') {
        const outputPath = process.env.INIT_CWD
          ? `./${path.relative(process.env.INIT_CWD, config.output.path)}`
          : config.output.path;
        console.log(
          `${jobPrefix}${colors.green('✓')} ${colors.cyanBright(outputPath)} ${colors.gray(`· ${fileCount} ${fileCount === 1 ? 'file' : 'files'} · ${ms(totalMs)}`)}`,
        );
      }
    }
    eventPostprocess.timeEnd();
  }

  const watchedInput = config.input.find(
    (input, index) => input.watch.enabled && typeof inputPaths[index]!.path === 'string',
  );

  if (watchedInput) {
    setTimeout(() => {
      createClient({
        config,
        dependencies,
        jobIndex,
        logger,
        watches,
      });
    }, watchedInput.watch.interval);
  }

  return context;
}
