// @ts-nocheck
import { describe, it, expect, beforeEach } from 'bun:test';
import { Command, Option } from 'commander';
import {
  getCommands,
  getOptions,
  filterByPrefix,
  findCommand,
  filterByPrevArgs,
} from '../commander-tabtab.js';
import { RootProgram, setupProgram } from '../../cli/cliRun.js';

describe('commander-tabtab', () => {
  let program: Command;

  beforeEach(() => {
    // Create a fresh program instance for testing with the real CLI setup
    program = setupProgram(new RootProgram('cursor-rules'));
  });

  describe('getCommands', () => {
    it('should extract all commands', () => {
      const commands = getCommands(program);
      expect(commands).toHaveLength(5);

      const listOfCommands = commands.map(({ name, description }) => name);

      expect(listOfCommands).toMatchObject([
        'init',
        'repomix',
        'scan',
        'list',
        'completion',
      ]);
    });

    it('should extract all command names and descriptions', () => {
      const commands = getCommands(program);

      expect(commands).toHaveLength(5);

      expect(commands).toContainEqual({
        name: 'init',
        description: 'start the setup process',
      });
      expect(commands).toContainEqual({
        name: 'repomix',
        description: 'generate repomix output with recommended settings',
      });
      expect(commands).toContainEqual({
        name: 'scan',
        description: 'scan and check all files in the specified path',
      });
      expect(commands).toContainEqual({
        name: 'list',
        description: 'list all rules',
      });
      expect(commands).toContainEqual({
        name: 'completion',
        description: 'setup shell completion',
      });
    });
  });

  describe('getOptions', () => {
    it('should extract version option', () => {
      const options = getOptions(program);

      expect(options).toHaveLength(1);

      const listOfOptions = options.map(([long, short]) => [
        long.name,
        short?.name,
      ]);

      expect(listOfOptions).toMatchObject([['--version', '-v']]);
    });

    it('should extract all option names and descriptions', () => {
      const options = getOptions(program);
      expect(options).toHaveLength(1);

      expect(options).toContainEqual([
        {
          name: '--version',
          description: 'show version information',
        },
        {
          name: '-v',
          description: 'show version information',
        },
      ]);
    });
    it('should return all options for init command', () => {
      const initCommand = findCommand(program, 'init');
      const options = getOptions(initCommand);

      const optionLongNames = options.map(([oLong]) => oLong.name);
      const optionShortNames = options
        .map(([_, oShort]) => oShort?.name)
        .filter(Boolean);

      expect(optionLongNames).toHaveLength(5);
      expect(optionShortNames).toHaveLength(4);

      expect(optionLongNames).toMatchObject([
        '--verbose',
        '--quiet',
        '--force',
        '--repomix',
        '--overwrite',
      ]);
      expect(optionShortNames).toMatchObject(['-q', '-f', '-r', '-o']);
    });

    it('should return only global options for list command', () => {
      const listCommand = findCommand(program, 'list');
      const options = getOptions(listCommand);

      const optionLongNames = options.map(([oLong]) => oLong.name);
      const optionShortNames = options
        .map(([_, oShort]) => oShort?.name)
        .filter(Boolean);

      expect(optionLongNames).toHaveLength(2);
      expect(optionShortNames).toHaveLength(1);

      expect(optionLongNames).toMatchObject(['--verbose', '--quiet']);
      expect(optionShortNames).toMatchObject(['-q']);
    });

    it('should return only global options for repomix command', () => {
      const repomixCommand = findCommand(program, 'repomix');
      const options = getOptions(repomixCommand);

      const optionLongNames = options.map(([oLong]) => oLong.name);
      const optionShortNames = options
        .map(([_, oShort]) => oShort?.name)
        .filter(Boolean);

      expect(optionLongNames).toHaveLength(2);
      expect(optionShortNames).toHaveLength(1);
      expect(optionLongNames).toMatchObject(['--verbose', '--quiet']);
      expect(optionShortNames).toMatchObject(['-q']);
    });

    it('should return all options for scan command', () => {
      const scanCommand = findCommand(program, 'scan');
      const options = getOptions(scanCommand);

      const optionLongNames = options.map(([oLong]) => oLong.name);
      const optionShortNames = options
        .map(([_, oShort]) => oShort?.name)
        .filter(Boolean);

      expect(optionLongNames).toHaveLength(6);
      expect(optionShortNames).toHaveLength(5);

      expect(optionLongNames).toMatchObject([
        '--verbose',
        '--quiet',
        '--path',
        '--filter',
        '--pattern',
        '--sanitize',
      ]);
      expect(optionShortNames).toMatchObject(['-q', '-p', '-f', '-P', '-s']);
    });

    it('should return all options for completion command', () => {
      const completionCommand = findCommand(program, 'completion');
      const options = getOptions(completionCommand);

      const optionLongNames = options.map(([oLong]) => oLong.name);
      const optionShortNames = options
        .map(([_, oShort]) => oShort?.name)
        .filter(Boolean);

      expect(optionLongNames).toHaveLength(4);
      expect(optionShortNames).toHaveLength(3);

      expect(optionLongNames).toMatchObject([
        '--verbose',
        '--quiet',
        '--install',
        '--uninstall',
      ]);
      expect(optionShortNames).toMatchObject(['-q', '-i', '-u']);
    });
  });

  describe('findCommand', () => {
    it('should find existing commands', () => {
      const initCommand = findCommand(program, 'init');

      expect(initCommand).toBeDefined();
      expect(initCommand?.name()).toBe('init');
      expect(initCommand?.description()).toBe('start the setup process');
      expect(initCommand?.options).toHaveLength(5);
    });

    it('should return undefined for non-existing commands', () => {
      const nonExistentCommand = findCommand(program, 'non-existent');
      expect(nonExistentCommand).toBeUndefined();
    });

    it('should find all defined commands from setupProgram', () => {
      const commands = getCommands(program);
      const listOfCommands = commands.map(({ name, description }) => name);

      for (const command of listOfCommands) {
        const foundCommand = findCommand(program, command);
        expect(foundCommand).toBeDefined();
        expect(foundCommand?.name()).toBe(command);
      }
    });
  });

  describe('filterByPrevArgs', () => {
    it('should return flat options', () => {
      const options = [
        [{ name: '--verbose', description: 'verbose output' }],
        [
          { name: '--version', description: 'short version' },
          { name: '-v', description: 'short version' },
        ],
      ];

      const filtered = filterByPrevArgs(options, ['-v']);
      expect(filtered).toHaveLength(1);
      expect(filtered).toContainEqual({
        name: '--verbose',
        description: 'verbose output',
      });
    });

    it('should filter available options by previous args', () => {
      const options = [
        [
          { name: '--version', description: 'show version' },
          { name: '-v', description: 'short version' },
        ],
        [{ name: '--verbose', description: 'verbose output' }],
        [
          { name: '--help', description: 'show help' },
          { name: '-h', description: 'short help' },
        ],
      ];

      const filtered = filterByPrevArgs(options, ['-v']);

      expect(filtered).toHaveLength(3);
      expect(filtered).toContainEqual({
        name: '--verbose',
        description: 'verbose output',
      });
      expect(filtered).toContainEqual({
        name: '--help',
        description: 'show help',
      });
      expect(filtered).toContainEqual({
        name: '-h',
        description: 'short help',
      });
    });

    it('should filter conflicting options by previous args', () => {
      const options = [
        [{ name: '--verbose', description: 'verbose output' }],
        [
          { name: '--quiet', description: 'quiet output' },
          { name: '-q', description: 'short quiet' },
        ],
        [
          { name: '--version', description: 'show version' },
          { name: '-v', description: 'short version' },
        ],
      ];

      let filteredVerbose = filterByPrevArgs(options, ['--quiet']);
      expect(filteredVerbose).toHaveLength(2);
      expect(filteredVerbose).toMatchObject([
        { name: '--version', description: 'show version' },
        { name: '-v', description: 'short version' },
      ]);

      filteredVerbose = filterByPrevArgs(options, ['-q']);
      expect(filteredVerbose).toHaveLength(2);
      expect(filteredVerbose).toMatchObject([
        { name: '--version', description: 'show version' },
        { name: '-v', description: 'short version' },
      ]);

      const filteredQuiet = filterByPrevArgs(options, ['--verbose']);
      expect(filteredQuiet).toHaveLength(2);
      expect(filteredQuiet).toMatchObject([
        { name: '--version', description: 'show version' },
        { name: '-v', description: 'short version' },
      ]);

      const filteredVersion = filterByPrevArgs(options, ['-v']);
      expect(filteredVersion).toHaveLength(3);
      expect(filteredVersion).toMatchObject([
        {
          name: '--verbose',
          description: 'verbose output',
        },
        {
          name: '--quiet',
          description: 'quiet output',
        },
        {
          name: '-q',
          description: 'short quiet',
        },
      ]);
    });
  });

  describe('filterByPrefix', () => {
    it('should filter available options by prefix', () => {
      const options = [
        { name: '--version', description: 'show version' },
        { name: '--verbose', description: 'verbose output' },
        { name: '-v', description: 'short version' },
        { name: '--help', description: 'show help' },
      ];

      const filtered = filterByPrefix(options, '--v');
      expect(filtered).toHaveLength(2);
      expect(filtered).toContainEqual({
        name: '--version',
        description: 'show version',
      });
      expect(filtered).toContainEqual({
        name: '--verbose',
        description: 'verbose output',
      });
    });

    it('should return empty array when no options match prefix', () => {
      const options = [
        { name: '--help', description: 'show help' },
        { name: '-h', description: 'short help' },
      ];

      const filtered = filterByPrefix(options, '--v');
      expect(filtered).toHaveLength(0);
    });

    it('should filter all commands with specific prefixes', () => {
      const commands = getCommands(program);

      // Test filtering with 's' prefix
      const sCommands = filterByPrefix(commands, 's');
      expect(sCommands).toHaveLength(1);
      expect(sCommands[0].name).toBe('scan');

      // Test filtering with 'c' prefix
      const cCommands = filterByPrefix(commands, 'c');
      expect(cCommands).toHaveLength(1);
      expect(cCommands[0].name).toBe('completion');

      // Test filtering with 'r' prefix
      const rCommands = filterByPrefix(commands, 'r');
      expect(rCommands).toHaveLength(1);
      expect(rCommands[0].name).toBe('repomix');
    });
  });
});
