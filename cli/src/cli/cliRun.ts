import process from 'node:process';
import { Command, Option } from 'commander';
import pc from 'picocolors';
import { handleError } from '~/shared/errorHandle.js';
import { logger, cursorRulesLogLevels } from '~/shared/logger.js';
import { runInitAction, runInitForceAction } from './actions/initAction.js';
// import { runMcpAction } from './actions/mcpAction';
import { runVersionAction } from './actions/versionAction.js';
import type { CliOptions } from './types.js';
import { runRepomixAction } from '~/cli/actions/repomixAction.js';
import { runListRulesAction } from '~/cli/actions/listRulesAction.js';
import { checkForUpdates } from '~/core/checkForUpdates.js';

// Semantic mapping for CLI suggestions
// This maps conceptually related terms (not typos) to valid options
const semanticSuggestionMap: Record<string, string[]> = {
  ls: ['list'],
  start: ['init'],
  yolo: ['--force'],
  repo: ['--repomix'],
  compress: ['--repomix'],
  override: ['--overwrite'],
  debug: ['--verbose'],
  detailed: ['--verbose'],
  silent: ['--quiet'],
  mute: ['--quiet'],
};

class RootCommand extends Command {
  createCommand(name: string) {
    const cmd = new Command(name);
    cmd.description('Cursor Rules - Add awesome IDE rules to your codebase');
    // Basic Options
    cmd.addOption(new Option('--verbose', 'enable verbose logging for detailed output').conflicts('quiet'));
    cmd.addOption(new Option('-q, --quiet', 'disable all output to stdout').conflicts('verbose'));
    return cmd;
  }
}

export const program = new RootCommand();

export const run = async () => {
  try {
    // Check for updates in the background
    const updateMessage = checkForUpdates();

    program
    .option('-v, --version', 'show version information')
    .action(commanderActionEndpoint);

    program
    .command('init')
    .description('start the setup process')
    // Rules Options
    .option('-f, --force', 'overwrites already existing rules if filenames match')
    .option('-r, --repomix', 'generate repomix output with recommended settings')
    .option('-o, --overwrite', 'overwrite existing rules')
    .action(commanderActionEndpoint);

    program
    .command('list')
    .description('list all rules')
    .action(commanderActionEndpoint);

    program
    .command('repomix')
    .description('generate repomix output with recommended settings')
    .action(commanderActionEndpoint);

    // program
    // .command('mcp')
    // .description('run as a MCP server')
    // .action(runCli);

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
    
    logger.force(await updateMessage);
  } catch (error) {
    handleError(error);
  }
};

const commanderActionEndpoint = async (options: CliOptions = {}, command: Command) => {
  if (options.quiet) {
    logger.setLogLevel(cursorRulesLogLevels.SILENT);
  } else if (options.verbose) {
    logger.setLogLevel(cursorRulesLogLevels.DEBUG);
  } else {
    logger.setLogLevel(cursorRulesLogLevels.INFO);
  }

  await runCli(options, command);
};

export const runCli = async (options: CliOptions = {}, command: Command) => {
  if (options.version) {
    await runVersionAction();
    return;
  }

  const cmd = command.name();

  // List command

  if (cmd === 'list') {
    await runListRulesAction();
    return;
  }

  // Init command

  if (options.force) {
    await runInitForceAction(options);
    return;
  }

  if (cmd === 'init') {
    await runInitAction(options);
    return;
  }

  if (cmd === 'repomix') {
    await runRepomixAction(options.quiet);
    return;
  }

  // MCP command (not implemented yet)
  
  // if (options.mcp) {
  //   return await runMcpAction();
  // }

  logger.log(pc.bold(pc.green('\n Cursor Rules')), 'a CLI for adding awesome IDE rules to your codebase\n');
  command.outputHelp();
};