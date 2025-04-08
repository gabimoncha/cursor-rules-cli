import { cancel, outro, intro, select, multiselect, group as groupPrompt } from '@clack/prompts';
import pc from 'picocolors';
import { installRules } from '~/core/file/installRules.js';

export const runInitAction = async (rulesDir: string) => {
  intro(pc.bold(`Cursor Rules`));

  const yoloMode = await promptYoloMode();

  if (yoloMode) {
    const result = await installRules(rulesDir, true);

    if (result) {
      outro(pc.green(`You're all set!`));
    } else {
      outro(pc.yellow(`Zero changes made.`));
    }
    return;
  }

  const group = await groupPrompt({
    rules: () => multiselect({
      message: 'Which rules would you like to add?',
      options: [
        { value: 'cursor-rules', label: 'Cursor Rules', hint: 'Defines how Cursor should add new rules to your codebase' },
        { value: 'task-list', label: 'Task List', hint: 'For creating and managing task lists' },
        { value: 'project-structure', label: 'Project structure' },
      ],
    }),
    // repomixOptions: async () => {
    //   const repomix = await promptRepomix();

    //   if (!repomix) return;

    //   return multiselect({
    //     message: 'Repomix options',
    //     initialValues: ['--compress', '--remove-empty-lines', '--ignore ".cursor"'],
    //     options: [
    //       { value: '--compress', label: 'Perform code compression', hint: 'recommended' },
    //       { value: '--remove-empty-lines', label: 'Remove empty lines', hint: 'recommended' },
    //       { value: '--ignore ".cursor"', label: 'Ignore .cursor folder', hint: 'recommended' },
    //       { value: '--remove-comments', label: 'Remove comments', hint: 'Good for useless comments' },
    //       { value: '--include-empty-directories', label: 'Include empty directories' },
    //     ],
    //   });
    // },
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
    }
  );

  console.log(JSON.stringify(group, null, 2));

  outro(pc.green(`You're all set!`));
};


async function promptYoloMode() {
  return select({
    message: 'How do you want to add rules?.',
    options: [
      { value: true, label: 'YOLO', hint: 'overwrite some rules, if they already exist' },
      { value: false, label: 'Custom' },
    ],
  });
};


async function promptRepomix() {
  return select({
    message: 'Run repomix over your codebase? (you can feed the output into the AI)',
      options: [
        { value: true, label: 'Sure, go ahead!' },
        { value: false, label: 'No, add empty templates.' },
    ],
  });
};
