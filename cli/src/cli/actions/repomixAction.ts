import path from 'path';
import { writeFileSync } from 'fs';
import { log } from '@clack/prompts';
import { runCli as repomixAction, RepomixConfig } from 'repomix';
import { DEFAULT_REPOMIX_CONFIG, REPOMIX_OPTIONS, TEMPLATE_DIR } from '~/shared/constants.js';
import { logger } from '~/shared/logger.js';

const repomixInstructionsDir = path.join(TEMPLATE_DIR, 'repomix-instructions');

export const runRepomixAction = async () => {
  log.step('Creating repomix config...');

  const repomixOptions = {
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

  log.step('Running repomix...');
  await repomixAction(['.'], process.cwd(), {
    ...REPOMIX_OPTIONS,
    instructionFilePath: path.join(repomixInstructionsDir, 'instruction-project-structure.md'),
  });
  log.success('Repomix done!');
  log.info(`Open AI Chat in Agent Mode and ask to execute the instructions from the file`)
  log.info(`You can check the instructions at the bottom of the file here:\n${path.join(process.cwd(), 'repomix.output.xml')}`);
}

export const writeRepomixConfig = async (config: RepomixConfig) => {
  try {
    const configPath = path.join(process.cwd(), 'repomix.config.json');
    writeFileSync(configPath, JSON.stringify(config, null, 2));
    log.success('Repomix config saved!');
    log.info(`You can edit the config file here:\n${configPath}`);
  } catch (err) {
    log.warn('Error saving repomix config!');
  }
}