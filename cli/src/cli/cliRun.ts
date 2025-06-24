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
import { runAuditRulesAction } from '~/cli/actions/auditRulesAction.js';
import { runScanPathAction } from './actions/scanPathAction.js';
import { commanderTabtab } from '~/core/commander-tabtab.js';
import {
  runInstallCompletionAction,
  runUninstallCompletionAction,
} from '~/cli/actions/completionActions.js';

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

export class RootProgram extends Command {
  createCommand(name: string) {
    const cmd = new Command(name);
    cmd.description('Cursor Rules - Add awesome IDE rules to your codebase');
    // Basic Options
    cmd.addOption(
      new Option(
        '--verbose',
        'enable verbose logging for detailed output'
      ).conflicts('quiet')
    );
    cmd.addOption(
      new Option('-q, --quiet', 'disable all output to stdout').conflicts(
        'verbose'
      )
    );
    return cmd;
  }
}

export const program = new RootProgram('cursor-rules');

export const setupProgram = (programInstance: Command = program) => {
  programInstance
    .option('-v, --version', 'show version information')
    .action(commanderActionEndpoint);

  programInstance
    .command('init')
    .description('start the setup process')
    // Rules Options
    .option(
      '-f, --force',
      'overwrites already existing rules if filenames match'
    )
    .option(
      '-r, --repomix',
      'generate repomix output with recommended settings'
    )
    .option('-o, --overwrite', 'overwrite existing rules')
    .action(commanderActionEndpoint);

  programInstance
    .command('list')
    .description('list all rules')
    .action(commanderActionEndpoint);

  programInstance
    .command('audit')
    .description('check for vulnerabilities in the codebase')
    .action(commanderActionEndpoint);

  programInstance
    .command('repomix')
    .description('generate repomix output with recommended settings')
    .action(commanderActionEndpoint);

  programInstance
    .command('scan')
    .description('scan and check all files in the specified path')
    .requiredOption('-p, --path <path>', 'path to scan')
    .option('-r, --recursive', 'scan directories recursively')
    .option(
      '-i, --include-pattern <pattern>',
      'regex pattern for files to include'
    )
    .option(
      '-e, --exclude-pattern <pattern>',
      'regex pattern for files to exclude'
    )
    .option('-s, --show-sizes', 'show file sizes')
    .action(commanderActionEndpoint);

  programInstance
    .command('completion')
    .addOption(
      new Option('-i, --install', 'install tab autocompletion').conflicts(
        'uninstall'
      )
    )
    .addOption(
      new Option('-u, --uninstall', 'uninstall tab autocompletion').conflicts(
        'install'
      )
    )
    .description('setup shell completion')
    .action(async (options) => {
      if (options.uninstall) {
        await runUninstallCompletionAction();
      } else {
        await runInstallCompletionAction();
      }
    });

  return programInstance;
};

export const run = async () => {
  try {
    // Check for updates in the background
    const updateMessage = checkForUpdates();

    // Setup the program with all commands and options
    setupProgram();

    // Handle completion commands before commander parses arguments
    const completion = await commanderTabtab(program, 'cursor-rules');
    if (completion) {
      return;
    }

    // Custom error handling function
    const configOutput = program.configureOutput();
    const originalOutputError =
      configOutput.outputError || ((str, write) => write(str));

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

const commanderActionEndpoint = async (
  options: CliOptions = {},
  command: Command
) => {
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

  // Scan command
  if (cmd === 'scan') {
    if (!options.path) {
      logger.error('Path argument is required for scan command');
      command.outputHelp();
      return;
    }

    await runScanPathAction({
      path: options.path,
      recursive: options.recursive,
      includePattern: options.includePattern,
      excludePattern: options.excludePattern,
      showSizes: options.showSizes,
    });
    return;
  }

  // List command
  if (cmd === 'audit') {
    await runAuditRulesAction();
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

  logger.log(
    pc.bold(pc.green('\n Cursor Rules')),
    'a CLI for adding awesome IDE rules to your codebase\n'
  );
  command.outputHelp();
};
