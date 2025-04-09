import { cancel, select, multiselect, group as groupPrompt, isCancel, confirm } from '@clack/prompts';
import path from 'path';
import { runRepomixAction, writeRepomixConfig, writeRepomixOutput } from '~/cli/actions/repomixAction.js';
import { CliOptions } from '~/cli/types.js';
import { installRules, logInstallResult } from '~/core/installRules.js';
import { DEFAULT_REPOMIX_CONFIG, REPOMIX_OPTIONS, TEMPLATE_DIR } from '~/shared/constants.js';
import { logger } from '~/shared/logger.js';

const rulesDir = path.join(TEMPLATE_DIR, 'rules-default');

export const runInitAction = async (opt: CliOptions) => {
  logger.log("\n");
  logger.prompt.intro("Initializing Cursor Rules");

  const yoloMode = await confirmYoloMode();

  if (yoloMode) {
    await runInitForceAction(opt);
    return;
  }

  let result = false;

  const group = await groupPrompt({
    rules: () => multiselect({
      message: 'Which rules would you like to add?',
      options: [
        { value: 'cursor-rules.md', label: 'Cursor Rules', hint: 'Defines how Cursor should add new rules to your codebase' },
        { value: 'task-list.md', label: 'Task List', hint: 'For creating and managing task lists' },
        { value: 'project-structure.md', label: 'Project structure' },
      ],
      required: false,
    }),
    runRepomix: async () => {
      if (opt.repomix) {
        return true;
      }

      return select({
        message: 'Pack codebase (with repomix) into an AI-friendly file?',
        options: [
          { value: true, label: 'Yes', hint: 'recommended' },
          { value: false, label: 'No', hint: 'you can run repomix later' },
        ],
      });
    },
    repomixOptions: async ({results}) => {
      if (!results.runRepomix || opt.repomix) return ['compress', 'removeEmptyLines'];

      return multiselect({
        message: 'Repomix options',
        initialValues: ['compress', 'removeEmptyLines'],
        options: [
          { value: 'compress', label: 'Perform code compression', hint: 'recommended' },
          { value: 'removeEmptyLines', label: 'Remove empty lines', hint: 'recommended' },
          { value: 'removeComments', label: 'Remove comments', hint: 'Good for useless comments' },
          { value: 'includeEmptyDirectories', label: 'Includes empty directories' },
        ],
        required: false,
      });
    },
    saveRepomixConfig: async ({results}) => {
      if (!results.runRepomix) {
        return false;
      }

      if (opt.repomix) {
        return true;
      }

      return confirm({
        message: 'Save repomix config?',
      });
    },
  },
  {
    // On Cancel callback that wraps the group
    // So if the user cancels one of the prompts in the group this function will be called
    onCancel: ({ results }) => {
      cancel('Operation cancelled.');
      process.exit(0);
    },
  });

  if (group.rules.length > 0) {
    result = await installRules(rulesDir, opt.overwrite, group.rules);
  }

  if (!group.runRepomix) {
    logInstallResult(result);
    return;
  }

  const formattedOptions = (group.repomixOptions as Array<string>).reduce((acc, val) => {
    return {
      ...acc,
      [val]: true
    };
  }, {});

  const repomixOptions = {
    ...REPOMIX_OPTIONS,
    ...formattedOptions
  }

  if (Boolean(group.saveRepomixConfig)) {
    const repomixConfig = {
      ...DEFAULT_REPOMIX_CONFIG,
      output: {
        ...DEFAULT_REPOMIX_CONFIG.output,
        ...repomixOptions
      }
    }

    await writeRepomixConfig(repomixConfig);
  }

  if (group.repomixOptions) {
    await writeRepomixOutput({ ...repomixOptions, quiet: opt.quiet });
  }

  logInstallResult(result);
};


export async function runInitForceAction(opt: CliOptions) {
  const result = await installRules(rulesDir, true);
  await runRepomixAction(opt.quiet);
  logInstallResult(result);
}


async function confirmYoloMode() {
  const result = await select({
    message: 'How do you want to add rules?.',
    options: [
      { value: true, label: 'YOLO', hint: 'overwrites already existing rules if filenames match' },
      { value: false, label: 'Custom' },
    ],
  });

  if (isCancel(result)) {
    cancel('Operation cancelled.');
    process.exit(0);
  }

  return result;
};
