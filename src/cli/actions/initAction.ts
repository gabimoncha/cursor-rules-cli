import { cancel, outro, intro, select, multiselect, group as groupPrompt } from '@clack/prompts';
import pc from 'picocolors';
import { installRules } from '~/core/file/installRules.js';

export const runInitAction = async (templateDir: string) => {
  intro(pc.bold(`Cursor Rules`));

  const yoloMode = await promptYoloMode();

  if (yoloMode) {
    const result = await installRules(templateDir, true);

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
