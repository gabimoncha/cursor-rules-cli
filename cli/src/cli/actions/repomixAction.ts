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

export const writeRepomixOutput = async (
  opt: RepomixCliOptions,
  instructionFile: string = 'project-structure'
) => {
  try {
    const { quiet, ...restOpts } = opt;
    
    const instructionFilePath = path.join(TEMPLATE_DIR, 'repomix-instructions', `instruction-${instructionFile}.md`);
    await repomixAction(['.'], process.cwd(), {
      ...restOpts,
      quiet,
      instructionFilePath,
    })
    
    logger.quiet("\nRepomix output:", pc.cyan("./repomix-output.xml"));
    
    logger.prompt.info("You can check the instructions at the bottom of the file here:", pc.cyan("./repomix-output.xml"));
    logger.prompt.info("Open the AI Chat in Agent Mode, ask it to execute the instructions and tag repomix-output.xml")
  } catch (err) {
    logger.prompt.warn("Error running repomix!");
  }
}

export const writeRepomixConfig = async (config: RepomixConfig) => {
  try {
    const configPath = path.join(process.cwd(), 'repomix.config.json');
    writeFileSync(configPath, JSON.stringify(config, null, 2));
    logger.prompt.info("Repomix config saved to:", pc.cyan("./repomix.config.json"));
    logger.quiet("\nRepomix config file:", pc.cyan("./repomix.config.json"));
  } catch (err) {
    logger.prompt.warn("Error saving repomix config!");
  }
}