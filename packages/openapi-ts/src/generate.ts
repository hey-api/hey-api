import { Logger } from '@hey-api/codegen-core';
import type { Context } from '@hey-api/shared';
import {
  checkNodeVersion,
  ConfigValidationError,
  getInputError,
  getLogs,
  JobError,
  logCrashReport,
  openGitHubIssueWithCrashReport,
  printCliIntro,
  printCrashReport,
  shouldReportCrash,
} from '@hey-api/shared';
import type { LazyOrAsync, MaybeArray } from '@hey-api/types';

import type { Configs } from './config/init';
import { resolveJobs } from './config/init';
import type { UserConfig } from './config/types';
import { createClient as pCreateClient } from './create-client';

/**
 * Generate a client from the provided configuration.
 *
 * @param userConfig User provided {@link UserConfig} configuration(s).
 */
export async function createClient(
  userConfig?: LazyOrAsync<MaybeArray<UserConfig>>,
  logger = new Logger(),
): Promise<ReadonlyArray<Context>> {
  const resolvedConfig = typeof userConfig === 'function' ? await userConfig() : userConfig;
  const userConfigs = resolvedConfig
    ? resolvedConfig instanceof Array
      ? resolvedConfig
      : [resolvedConfig]
    : [];

  let rawLogs = userConfigs.find((config) => getLogs(config.logs).level !== 'silent')?.logs;
  if (typeof rawLogs === 'string') {
    rawLogs = getLogs(rawLogs);
  }

  let jobs: Configs['jobs'] = [];

  try {
    checkNodeVersion();

    const eventCreateClient = logger.timeEvent('createClient');

    const eventConfig = logger.timeEvent('config');
    const resolved = await resolveJobs({ logger, userConfigs });
    const dependencies = resolved.dependencies;
    jobs = resolved.jobs;
    const printIntro = jobs.some((job) => job.config.logs.level !== 'silent');
    if (printIntro) printCliIntro(import.meta.dirname);
    eventConfig.timeEnd();

    const configErrors = jobs.flatMap((job) =>
      job.errors.map((error) => ({ error, jobIndex: job.index })),
    );
    if (configErrors.length) {
      throw new ConfigValidationError(configErrors);
    }

    const outputs = await Promise.all(
      jobs.map(async (job) => {
        try {
          return await pCreateClient({
            config: job.config,
            dependencies,
            jobIndex: job.index,
            logger,
          });
        } catch (error) {
          if (error instanceof Error) {
            throw new JobError('', {
              error,
              jobIndex: job.index,
            });
          }
        }
      }),
    );
    const contexts = outputs.filter((ctx): ctx is Context => ctx !== undefined);

    eventCreateClient.timeEnd();

    logger.report(jobs.some((job) => job.config.logs.level === 'debug'));

    return contexts;
  } catch (error) {
    const logs =
      jobs.find((job) => job.config.logs.level !== 'silent')?.config.logs ??
      jobs[0]?.config.logs ??
      rawLogs;
    const dryRun =
      jobs.some((job) => job.config.dryRun) ?? userConfigs.some((config) => config.dryRun) ?? false;

    const inputError = getInputError(error);
    const normalizedError = inputError ?? error;

    const logPath =
      logs?.file && !dryRun ? logCrashReport(normalizedError, logs.path ?? '') : undefined;
    if (!logs || logs.level !== 'silent') {
      printCrashReport({ error, logPath });
      const isInteractive =
        jobs.some((job) => job.config.interactive) ??
        userConfigs.some((config) => config.interactive) ??
        false;
      if (await shouldReportCrash({ error: normalizedError, isInteractive })) {
        await openGitHubIssueWithCrashReport(error, import.meta.dirname);
      }
    }

    throw error;
  }
}
