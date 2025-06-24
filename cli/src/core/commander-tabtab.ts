import tabtab, { CompletionItem, getShellFromEnv } from '@pnpm/tabtab';
import { Command, Option } from 'commander';

const shell = getShellFromEnv(process.env);

// Extracted testable functions
export const getCommands = (program: Command) => {
  return program.commands.map((c) => ({
    name: c.name(),
    description: c.description(),
  }));
};

export const getOptions = (targetCommand: Command): CompletionItem[][] => {
  return targetCommand.options.map((o: Option) => {
    const option = [];
    if (o.long) option.push({ name: o.long, description: o.description });
    if (o.short) option.push({ name: o.short, description: o.description });
    return option;
  });
};

export const filterByPrevArgs = (
  options: CompletionItem[][],
  prev: string[]
): CompletionItem[] => {
  return options
    .filter(([long, short]) => {
      const longOption = long.name;
      const shortOption = short?.name;

      // filter conflicting options --verbose and --quiet, -q
      if (longOption === '--verbose') {
        return (
          !prev.includes('-q') &&
          !prev.includes('--quiet') &&
          !prev.includes(longOption)
        );
      }

      if (longOption === '--quiet' || shortOption === '-q') {
        return (
          !prev.includes('--verbose') &&
          !prev.includes(longOption) &&
          !prev.includes(shortOption)
        );
      }

      if (longOption === '--install' || shortOption === '-i') {
        return (
          !prev.includes('--uninstall') &&
          !prev.includes(longOption) &&
          !prev.includes(shortOption)
        );
      }

      if (longOption === '--uninstall' || shortOption === '-u') {
        return (
          !prev.includes('--install') &&
          !prev.includes(longOption) &&
          !prev.includes(shortOption)
        );
      }

      if (!shortOption) return !prev.includes(longOption);

      return !prev.includes(longOption) && !prev.includes(shortOption);
    })
    .flat();
};

export const filterByPrefix = (
  options: CompletionItem[],
  prefix: string
): CompletionItem[] => {
  return options.filter(
    (option) => option.name.startsWith(prefix) || option.name === prefix
  );
};

export const findCommand = (program: Command, commandName: string) => {
  return program.commands.find((cmd) => cmd.name() === commandName);
};

export const commanderTabtab = async function (
  program: Command,
  binName: string
) {
  const firstArg = process.argv.slice(2)[0];
  const prevFlags = process.argv.filter((arg) => arg.startsWith('-'));

  const availableCommands = getCommands(program);

  if (firstArg === 'generate-completion') {
    const completion = await tabtab
      .getCompletionScript({
        name: binName,
        completer: binName,
        shell,
      })
      .catch((err) => console.error('GENERATE ERROR', err));
    console.log(completion);
    return true;
  }

  if (firstArg === 'completion-server') {
    const env = tabtab.parseEnv(process.env);
    if (!env.complete) return true;

    const lineWords = env.line.split(' ');
    const commandName = lineWords[1];
    const command = findCommand(program, commandName);

    // Command completion
    if (!command) {
      const filteredCommands = filterByPrefix(availableCommands, env.last);
      tabtab.log(filteredCommands, shell);
      return true;
    }

    // Argument completion for `scan` command
    if (['-p', '--path'].includes(env.prev) && command.name() === 'scan') {
      tabtab.logFiles();
      return true;
    }

    // Option completion
    if (availableCommands.some((c) => c.name === commandName)) {
      const allOptions = getOptions(command);
      const filteredUnusedOptions = filterByPrevArgs(allOptions, prevFlags);
      const filteredOptions = filterByPrefix(filteredUnusedOptions, env.last);

      tabtab.log(filteredOptions, shell);
      return true;
    }

    return true;
  }
  return false;
};
