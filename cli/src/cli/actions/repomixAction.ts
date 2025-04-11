import path from 'path';
import { writeFileSync } from 'fs';
import pc from 'picocolors';
import { CliOptions as RepomixCliOptions, runCli as repomixAction, RepomixConfig } from 'repomix';
import { DEFAULT_REPOMIX_CONFIG, REPOMIX_OPTIONS, TEMPLATE_DIR } from '~/shared/constants.js';
import { logger } from '~/shared/logger.js';

export const runRepomixAction = async (quiet: boolean = false) => {
  logger.prompt.step('Creating repomix config...');

  const repomixOptions = {
    ...REPOMIX_OPTIONS,
    compress: true,
    removeEmptyLines: true,
  }

  const yoloRepomixConfig: RepomixConfig = {
    ...DEFAULT_REPOMIX_CONFIG,
    output: {
      ...DEFAULT_REPOMIX_CONFIG.output,
      ...repomixOptions,
    }
  }

  logger.trace('repomix options:', repomixOptions);

  await writeRepomixConfig(yoloRepomixConfig);

  await writeRepomixOutput({ ...repomixOptions, quiet });
}

const MODEL_CONTEXT_WINDOW : Record<number, string> = {
  120_000: 'claude-3.7-sonnet or gemini-2.5-pro-exp or any MAX model',
  200_000: 'claude-3.7-sonnet MAX or gemini-2.5-pro-exp MAX',
  1_000_000: 'gemini-2.5-pro-exp MAX',
}

export const writeRepomixOutput = async (
  opt: RepomixCliOptions,
  instructionFile: string = 'project-structure'
) => {
  try {
    const { quiet, ...restOpts } = opt;
    
    const instructionFilePath = path.join(TEMPLATE_DIR, 'repomix-instructions', `instruction-${instructionFile}.md`);
    const result = await repomixAction(['.'], process.cwd(), {
      ...restOpts,
      quiet,
      instructionFilePath,
    })

    const totalTokens = result?.packResult?.totalTokens || 0;
    
    logger.quiet("\n Repomix output:", pc.cyan("./repomix-output.xml"));
    
    logger.prompt.message(pc.dim("You can check the instructions at the bottom of the file here:"), pc.cyan("./repomix-output.xml"));
    logger.prompt.info("To update the project structure, prompt Cursor in Agent Mode")
    logger.prompt.message(pc.yellow("Use the read_file tool with should_read_entire_file:true on repomix-output.xml and after you are done, only then, execute the instructions that you find at the bottom"))

    if (totalTokens >= 1_000_000) {
      logger.prompt.warn(returnContextWindowWarning(totalTokens, MODEL_CONTEXT_WINDOW[1_000_000]));
    } else if (totalTokens >= 200_000) {
      logger.prompt.warn(returnContextWindowWarning(totalTokens, MODEL_CONTEXT_WINDOW[1_000_000]));
    } else if (totalTokens >= 120_000) {
      logger.prompt.warn(returnContextWindowWarning(totalTokens, MODEL_CONTEXT_WINDOW[200_000]));
    } else if (totalTokens >= 60_000) {
      logger.prompt.warn(returnContextWindowWarning(totalTokens, MODEL_CONTEXT_WINDOW[120_000]));
    }

  } catch (err) {
    logger.prompt.warn("Error running repomix!");
  }
}

export const writeRepomixConfig = async (config: RepomixConfig) => {
  try {
    const configPath = path.join(process.cwd(), 'repomix.config.json');
    writeFileSync(configPath, JSON.stringify(config, null, 2));
    logger.prompt.info("Repomix config saved to:", pc.cyan("./repomix.config.json"));
    logger.quiet("\n Repomix config file:", pc.cyan("./repomix.config.json"));
  } catch (err) {
    logger.prompt.warn("Error saving repomix config!");
  }
}

const returnContextWindowWarning = (totalTokens: number, model: string) => {
  return `Total tokens: ${totalTokens.toLocaleString()}. Make sure to select ${pc.magentaBright(model)} for larger context windows.`;
}
