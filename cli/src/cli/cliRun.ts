import process from 'node:process';
import path from 'node:path';
import { Option, program } from 'commander';
import pc from 'picocolors';

import { handleError } from '~/shared/errorHandle.js';
import { logger, cursorRulesLogLevels } from '~/shared/logger.js';
import { installRules, logInstallResult } from '~/core/installRules.js';
import { runInitAction, runYoloAction } from './actions/initAction.js';
// import { runMcpAction } from './actions/mcpAction';
import { runVersionAction } from './actions/versionAction.js';
import type { CliOptions } from './types.js';
import { intro } from '@clack/prompts';
import { TEMPLATE_DIR } from '~/shared/constants.js';
import { runRepomixAction } from '~/cli/actions/repomixAction.js';
import { runListRulesAction } from '~/cli/actions/listRulesAction.js';

const rulesDir = path.join(TEMPLATE_DIR, 'rules-default');

// Semantic mapping for CLI suggestions
// This maps conceptually related terms (not typos) to valid options
const semanticSuggestionMap: Record<string, string[]> = {
  repo: ['--repomix'],
  ls: ['--list'],
  debug: ['--verbose'],
  detailed: ['--verbose'],
  silent: ['--quiet'],
  mute: ['--quiet'],
  yolo: ['--force'],
  start: ['--init'],
};

export const run = async () => {
  try {
    program
    .description('Cursor Rules - Add awesome IDE rules to your codebase')
    // Rules Options
    .option('-f, --force', 'overwrites already existing rules if filenames match')
    .option('--init', 'start the setup process')
    .option('--repomix', 'generate repomix output with recommended settings')
    // MCP
    // .option('--mcp', 'run as a MCP server')
    // Basic Options
    .option('--list', 'list all rules')
    .option('-v, --version', 'show version information')
    .addOption(new Option('--verbose', 'enable verbose logging for detailed output').conflicts('quiet'))
    .addOption(new Option('--quiet', 'disable all output to stdout').conflicts('verbose'))
    .action(runCli);

    // Custom error handling function
    const configOutput = program.configureOutput();
    const originalOutputError = configOutput.outputError || ((str, write) => write(str));

    program.configureOutput({
      outputError: (str, write) => {
        // Check if this is an unknown option error
        if (str.includes('unknown option')) {
          const match = str.match(/unknown option '?(-{1,2}[^ ']+)'?/i);
          if (match?.[1]) {
            const unknownOption = match[1];
            const cleanOption = unknownOption.replace(/^-+/, '');

            // Check if the option has a semantic match
            const semanticMatches = semanticSuggestionMap[cleanOption];
            if (semanticMatches) {
              // We have a direct semantic match
              logger.error(`✖ Unknown option: ${unknownOption}`);
              logger.info(`Did you mean: ${semanticMatches.join(' or ')}?`);
              return;
            }
          }
        }

        // Fall back to the original Commander error handler
        originalOutputError(str, write);
      },
    });

    await program.parseAsync(process.argv);
  } catch (error) {
    handleError(error);
  }
};

export const runCli = async (options: CliOptions = {}) => {
  // Set log level based on verbose and quiet flags
  if (options.quiet) {
    logger.setLogLevel(cursorRulesLogLevels.SILENT);
  } else if (options.verbose) {
    logger.setLogLevel(cursorRulesLogLevels.DEBUG);
  } else {
    logger.setLogLevel(cursorRulesLogLevels.INFO);
  }

  logger.trace('options:', options);

  if (options.list) {
    await runListRulesAction();
    return;
  }

  if (options.version) {
    await runVersionAction();
    return;
  }

  intro(pc.bold(pc.green(`Cursor Rules`)));

  if (options.force) {
    await runYoloAction(rulesDir);
    return;
  }
  
  if (options.init) {
    await runInitAction(rulesDir, options.repomix);
    return;
  }

  if (options.repomix) {
    await runRepomixAction();
  }

  // if (options.mcp) {
  //   return await runMcpAction();
  // }

  const result = await installRules(rulesDir);
  logInstallResult(result);
};