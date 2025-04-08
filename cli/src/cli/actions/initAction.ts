import { cancel, outro, select, multiselect, group as groupPrompt, isCancel, confirm, log } from '@clack/prompts';
import { writeFile } from 'fs/promises';
import path from 'path';
import pc from 'picocolors';
import { runCli as repomixAction } from 'repomix';
import {runRepomixAction, writeRepomixConfig} from '~/cli/actions/repomixAction.js';
import { installRules, logInstallResult } from '~/core/installRules.js';
import { DEFAULT_REPOMIX_CONFIG, TEMPLATE_DIR } from '~/shared/constants.js';
import { logger } from '~/shared/logger.js';

const repomixInstructionsDir = path.join(TEMPLATE_DIR, 'repomix-instructions');

export const runInitAction = async (rulesDir: string, repomix: boolean = false) => {
  const yoloMode = await confirmYoloMode();

  if (isCancel(yoloMode)) {
    cancel('Operation cancelled.');
    process.exit(0);
  }

  if (yoloMode) {
    await runYoloAction(rulesDir);
    return;
  }

  const group = await groupPrompt({
    rules: () => multiselect({
      message: 'Which rules would you like to add?',
      options: [
        { value: 'cursor-rules.md', label: 'Cursor Rules', hint: 'Defines how Cursor should add new rules to your codebase' },
        { value: 'task-list.md', label: 'Task List', hint: 'For creating and managing task lists' },
        { value: 'project-structure.md', label: 'Project structure' },
      ],
    }),
    runRepomix: async () => {
      if (repomix) {
        return true;
      }

      return confirm({
        message: 'Run repomix over your codebase? (you can feed the output into the AI)',
      });
    },
    repomixOptions: async ({results}) => {
      if (!results.runRepomix) return [];

      return multiselect({
        message: 'Repomix options',
        initialValues: ['compress', 'removeEmptyLines'],
        options: [
          { value: 'compress', label: 'Perform code compression', hint: 'recommended' },
          { value: 'removeEmptyLines', label: 'Remove empty lines', hint: 'recommended' },
          { value: 'removeComments', label: 'Remove comments', hint: 'Good for useless comments' },
          { value: 'includeEmptyDirectories', label: 'Include empty directories' },
        ],
      });
    },
    saveRepomixConfig: async ({results}) => {
      if (!results.runRepomix) return;

      return confirm({
        message: 'Save repomix config?',
      });
    },
    // TODO: For chaining repomix output inside the AI
    // wipRepomix: ({ results }) => {
    //   const rules = Array.isArray(results.rules) ? results.rules : [];
    //   const shouldRunRepomix = rules.includes('project-overview');

    //   if (!shouldRunRepomix) return;

    //   return select({
    //     message: 'Creating a project overview requires running repomix over your codebase (we do it for you).',
    //     options: [
    //       { value: true, label: 'Sure, go ahead!', hint: 'That\'s what YOLO is for!' },
    //       { value: false, label: 'No, add empty templates.' },
    //     ],
    //   });
    // },
  },
  {
    // On Cancel callback that wraps the group
    // So if the user cancels one of the prompts in the group this function will be called
    onCancel: ({ results }) => {
      cancel('Operation cancelled.');
      process.exit(0);
    },
  });

  logger.trace('selected rules:', group.rules);
  logger.trace('run repomix:', group.runRepomix);
  
  if (!Array.isArray(group.repomixOptions)) {
    logger.error('repomix options is not an array');
    return;
  }
  
  const formattedOptions = group.repomixOptions.reduce((acc, val) => {
    return {
      ...acc,
      [val]: true
    };
  }, {});
  
  
  logger.trace('repomix options:', formattedOptions);
  logger.trace('save repomix config:', group.saveRepomixConfig);

  if(group.saveRepomixConfig) {
    const repomixConfig = {
      ...DEFAULT_REPOMIX_CONFIG,
      output: {
        ...DEFAULT_REPOMIX_CONFIG.output,
        ...formattedOptions
      }
    }

    await writeRepomixConfig(repomixConfig);
  }


  if(group.runRepomix) {
    await repomixAction(['.'], process.cwd(), {
      ...formattedOptions,
      gitSortByChanges: false,
      instructionFilePath: path.join(repomixInstructionsDir, 'instruction-project-structure.md'),
    });
  }

  const result = await installRules(rulesDir, false, group.rules);
  logInstallResult(result);
};


async function confirmYoloMode() {
  return select({
    message: 'How do you want to add rules?.',
    options: [
      { value: true, label: 'YOLO', hint: 'overwrites already existing rules if filenames match' },
      { value: false, label: 'Custom' },
    ],
  });
};

export async function runYoloAction(rulesDir: string) {
  const result = await installRules(rulesDir, true);
  await runRepomixAction();
  logInstallResult(result);
}