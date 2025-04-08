import path from 'node:path';
import { loadFileConfig, mergeConfigs } from '../../config/configLoad.js';
import {
  type RepomixConfigCli,
  type RepomixConfigFile,
  type RepomixConfigMerged,
  type RepomixOutputStyle,
  repomixConfigCliSchema,
} from '../../config/configSchema.js';
import { type PackResult, pack } from '../../core/packager.js';
import { rethrowValidationErrorIfZodError } from '../../shared/errorHandle.js';
import { logger } from '../../shared/logger.js';
import { printCompletion, printSecurityCheck, printSummary, printTopFiles } from '../cliPrint.js';
import { Spinner } from '../cliSpinner.js';
import type { CliOptions } from '../types.js';
import { runMigrationAction } from './migrationAction.js';

export interface DefaultActionRunnerResult {
  packResult: PackResult;
  config: RepomixConfigMerged;
}

export const runDefaultAction = async (
  directories: string[],
  cwd: string,
  cliOptions: CliOptions,
): Promise<DefaultActionRunnerResult> => {
  logger.trace('Loaded CLI options:', cliOptions);

  // Run migration before loading config
  await runMigrationAction(cwd);

  // Load the config file
  const fileConfig: RepomixConfigFile = await loadFileConfig(cwd, cliOptions.config ?? null);
  logger.trace('Loaded file config:', fileConfig);

  const targetPaths = directories.map((directory) => path.resolve(cwd, directory));

  const spinner = new Spinner('Packing files...', cliOptions);
  spinner.start();

  let packResult: PackResult;

  try {
    packResult = await pack(targetPaths, config, (message) => {
      spinner.update(message);
    });
  } catch (error) {
    spinner.fail('Error during packing');
    throw error;
  }

  spinner.succeed('Packing completed successfully!');
  logger.log('');

  logger.log('');

  printSummary(
    packResult.totalFiles,
    packResult.totalCharacters,
    packResult.totalTokens,
    packResult.suspiciousFilesResults,
  );
  logger.log('');

  printCompletion();

  return {
    packResult,
  };
};
