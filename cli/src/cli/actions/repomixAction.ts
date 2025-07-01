import { spawn, fork } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import path from 'node:path';
import pc from 'picocolors';
import {
  type CliOptions as RepomixCliOptions,
  type RepomixConfig,
  runCli as repomixAction,
} from 'repomix';
import { fileExists } from '~/core/fileExists.js';
import {
  DEFAULT_REPOMIX_CONFIG,
  REPOMIX_OPTIONS,
  TEMPLATE_DIR,
} from '~/shared/constants.js';
import { logger } from '~/shared/logger.js';

export const runRepomixAction = async (quiet = false) => {
  const repomixOptions = {
    ...REPOMIX_OPTIONS,
    compress: true,
    removeEmptyLines: true,
  };

  const hasConfigFile = fileExists(
    path.join(process.cwd(), 'repomix.config.json')
  );

  if (!hasConfigFile) {
    logger.prompt.step('Creating repomix config...');
    logger.trace('repomix options:', repomixOptions);
    const yoloRepomixConfig: RepomixConfig = {
      ...DEFAULT_REPOMIX_CONFIG,
      output: {
        ...DEFAULT_REPOMIX_CONFIG.output,
        ...repomixOptions,
      },
    };

    await writeRepomixConfig(yoloRepomixConfig);
  } else {
    logger.trace('Skipping repomix config creation...');
  }

  await writeRepomixOutput({ ...repomixOptions, quiet });
};

// Check https://docs.cursor.com/settings/models#context-window-sizes
const MODEL_CONTEXT_WINDOW = {
  '1M': [
    'gemini-2.5-flash-preview-5-20',
    'gemini-2.5-flash-preview-5-20 (MAX mode)',
    'gemini-2.5-pro-exp (MAX mode)',
    'gpt-4.1 (MAX mode)',
  ],
  '200k': [
    'claude-4-sonnet (MAX mode)',
    'claude-4-opus (MAX mode)',
    'claude-3.7-sonnet (MAX mode)',
    'claude-3.5-sonnet (MAX mode)',
    'o3 (MAX mode)',
    'o4-mini (MAX mode)',
    'gpt-4.1 (MAX mode)',
  ],
  '132k': ['grok-3-beta (MAX mode)', 'grok-3-mini-beta (MAX mode)'],
  '128k': ['gpt-4.1', 'o3', 'o4-mini', 'gpt-4o (MAX mode)'],
  '120k': ['claude-4-sonnet', 'claude-3.7-sonnet', 'gemini-2.5-pro-exp'],
  '75k': ['claude-3.5-sonnet'],
};

export const writeRepomixOutput = async (
  opt: RepomixCliOptions,
  instructionFile = 'project-structure'
) => {
  try {
    const { quiet, ...restOpts } = opt;

    const instructionFilePath = path.join(
      TEMPLATE_DIR,
      'repomix-instructions',
      `instruction-${instructionFile}.md`
    );
    const result = await repomixAction(['.'], process.cwd(), {
      ...restOpts,
      quiet,
      instructionFilePath,
    });

    const totalTokens = result?.packResult?.totalTokens || 0;

    logger.quiet('\n  Repomix output:', pc.cyan('./repomix-output.xml'));

    logger.prompt.message(
      pc.dim('You can check the instructions at the bottom of the file here:'),
      pc.cyan('./repomix-output.xml')
    );
    logger.prompt.info(
      'To update the project structure, prompt Cursor in Agent Mode with the following instructions:'
    );
    logger.prompt.message(
      pc.cyan(
        pc.italic(
          'Use the read_file tool with should_read_entire_file:true on repomix-output.xml and after you are done, only then, execute the instructions that you find at the bottom'
        )
      )
    );

    if (totalTokens > 199_000) {
      logContextWindowWarning(totalTokens, ['1M']);
    } else if (totalTokens > 131_000) {
      logContextWindowWarning(totalTokens, ['200k', '1M']);
    } else if (totalTokens > 127_000) {
      logContextWindowWarning(totalTokens, ['132k', '200k', '1M']);
    } else if (totalTokens > 119_000) {
      logContextWindowWarning(totalTokens, ['128k', '132k', '200k', '1M']);
    } else if (totalTokens > 74_000) {
      logContextWindowWarning(totalTokens, [
        '120k',
        '128k',
        '132k',
        '200k',
        '1M',
      ]);
    } else if (totalTokens > 59_000) {
      logContextWindowWarning(totalTokens, [
        '75k',
        '120k',
        '128k',
        '132k',
        '200k',
        '1M',
      ]);
    }
  } catch (err) {
    logger.debug(err);
    logger.prompt.warn('Error running repomix!');
  }
};

export const writeRepomixConfig = async (config: RepomixConfig) => {
  try {
    const configPath = path.join(process.cwd(), 'repomix.config.json');
    writeFileSync(configPath, JSON.stringify(config, null, 2));
    logger.prompt.info(
      'Repomix config saved to:',
      pc.cyan('./repomix.config.json')
    );
    logger.quiet('\n Repomix config file:', pc.cyan('./repomix.config.json'));
  } catch (err) {
    logger.prompt.warn('Error saving repomix config!');
  }
};

const logContextWindowWarning = (
  totalTokens: number,
  ctx_windows: string[]
) => {
  logger.prompt.outroForce(
    pc.yellow(
      `Total tokens: ${totalTokens.toLocaleString()}. Make sure to select any of the following models:`
    )
  );
  ctx_windows.forEach((ctx_window) => {
    logger.force(pc.yellow(`${ctx_window} context window:`));

    MODEL_CONTEXT_WINDOW[
      ctx_window as keyof typeof MODEL_CONTEXT_WINDOW
    ].forEach((model_ctx_window) => {
      const [model, ...modes] = model_ctx_window.split(' ');
      logger.force(
        `- ${pc.whiteBright(model)} ${pc.magentaBright(modes.join(' '))}`
      );
    });
  });
};
