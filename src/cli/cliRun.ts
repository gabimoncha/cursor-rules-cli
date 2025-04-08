import process from 'node:process';
import path, { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Option, program } from 'commander';
import pc from 'picocolors';
import { runDefaultAction as repomixAction } from 'repomix';

import { handleError } from '~/shared/errorHandle.js';
import { logger, cursorRulesLogLevels } from '~/shared/logger.js';
import { installRules } from '~/core/file/installRules.js';
// import { runDefaultAction } from './actions/defaultAction';
import { runInitAction } from './actions/initAction.js';
// import { runMcpAction } from './actions/mcpAction';
import { runVersionAction } from './actions/versionAction.js';
import type { CliOptions } from './types.js';
import { outro } from '@clack/prompts';

const __dirname = dirname(fileURLToPath(import.meta.url));
const templateDir = path.join(__dirname, '..', 'templates', 'rules-default');

// Semantic mapping for CLI suggestions
// This maps conceptually related terms (not typos) to valid options
const semanticSuggestionMap: Record<string, string[]> = {
  repo: ['--repomix'],
  debug: ['--verbose'],
  detailed: ['--verbose'],
  silent: ['--quiet'],
  mute: ['--quiet'],
};

export const run = async () => {
  try {
    program
      .description('Cursor Rules - Add awesome IDE rules to your codebase')
      // Basic Options
      .option('-v, --version', 'show version information')
      // Output Options
      .option('--structure', 'generate project structure')
      .option('--overview', 'generate project overview')
      .option('--repomix', 'generate repomix output')
      // Configuration Options
      .option('--init', 'start the setup process')
      // MCP
      // .option('--mcp', 'run as a MCP server')
      .addOption(new Option('--verbose', 'enable verbose logging for detailed output').conflicts('quiet'))
      .addOption(new Option('--quiet', 'disable all output to stdout').conflicts('verbose'))
      .action(commanderActionEndpoint);

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

const commanderActionEndpoint = async (options: CliOptions = {}) => {
  await runCli(options);
};

export const runCli = async (options: CliOptions) => {
  // Set log level based on verbose and quiet flags
  if (options.quiet) {
    logger.setLogLevel(cursorRulesLogLevels.SILENT);
  } else if (options.verbose) {
    logger.setLogLevel(cursorRulesLogLevels.DEBUG);
  } else {
    logger.setLogLevel(cursorRulesLogLevels.INFO);
  }

  logger.trace('options:', options);

  if (options.repomix) {
    logger.log(pc.dim('\n📦 Repomixing\n'));
    await repomixAction(['.'], process.cwd(), {
      style: 'xml',
      compress: true,
      removeEmptyLines: true,
      gitSortByChanges: false,
      includeEmptyDirectories: true,
      output: 'repomix-output.xml',
      instructionFilePath: './src/templates/repomix-instructions/instruction-project-structure.md',
    });
    return;
  }

  if (options.version) {
    await runVersionAction();
    return;
  }

  if (options.init) {
    await runInitAction(templateDir);
    return;
  }

  // if (options.mcp) {
  //   return await runMcpAction();
  // }

  const result = await installRules(templateDir);

  if (result) {
    outro(pc.green(`You're all set!`));
  } else {
    outro(pc.yellow(`Zero changes made.`));
  }
};