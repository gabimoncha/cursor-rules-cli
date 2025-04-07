import { cancel, outro, intro, select, multiselect, group as groupPrompt } from '@clack/prompts';

export const runInitAction = async () => {
  intro(`Cursor Rules`);

  const group = await groupPrompt({
    how: () => select({ 
      message: 'How do you want to add rules?.',
      options: [
        { value: 'yolo', label: 'YOLO', hint: 'recommended' },
        { value: 'custom', label: 'Custom', hint: 'Adds selected rules' },
      ],
    }),
    rules: ({ results }) => {
      if (results.how === 'yolo') {
        return;
      }

      return multiselect({
        message: 'Which rules would you like to add?',
        options: [
          { value: 'cursor-rules', label: 'Cursor Rules', hint: 'Defines how Cursor should add new rules to your codebase' },
          { value: 'task-list', label: 'Task List', hint: 'For creating and managing task lists' },
          { value: 'project-overview', label: 'Project Overview', hint: 'Empty templates for your project overview' },
        ],
      });
    },
    repomix: () => select({
        message: 'Run repomix over your codebase? (you can feed the output into the AI)',
        options: [
          { value: true, label: 'Sure, go ahead!' },
          { value: false, label: 'No, add empty templates.' },
        ],
    }),
    repomixOptions: ({ results }) => {
      if (!results.repomix) return;

      return multiselect({
        message: 'Repomix options',
        initialValues: ['--compress', '--remove-empty-lines'],
        options: [
          { value: '--compress', label: 'Perform code compression', hint: 'recommended' },
          { value: '--remove-empty-lines', label: 'Remove empty lines', hint: 'recommended' },
          { value: '--remove-comments', label: 'Remove comments', hint: 'Good for useless comments' },
          { value: '--include-empty-directories', label: 'Include empty directories' },
          { value: '--no-git-sort-by-changes', label: 'Disable sorting files by git change count' },
        ],
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
    }
  );

  console.log(JSON.stringify(group, null, 2));

  outro(`You're all set!`);
};
