import fs from 'node:fs/promises';
import path from 'node:path';
import { confirm } from '@clack/prompts';
import pc from 'picocolors';
import { logger } from '~/shared/logger.js';

export async function installRules(
  templateDir: string,
  overwrite = false,
  selectedRules: string[] = []
): Promise<boolean> {
  try {
    logger.prompt.step('Installing Cursor rules...');

    // Create .cursor directory if it doesn't exist
    const cursorDir = path.join(process.cwd(), '.cursor', 'rules');
    await fs.mkdir(cursorDir, { recursive: true });

    // Get list of rule files from the package
    let templateFiles = await fs.readdir(templateDir);

    if (selectedRules.length > 0) {
      templateFiles = templateFiles.filter((file) => selectedRules.includes(file));
    }

    // Copy each rule file to the project's .cursor directory
    let copied = 0;
    let overwritten = 0;
    let result = false;

    // Get list of existing rule files
    const existingFiles = await fs.readdir(cursorDir);

    for (const file of templateFiles) {
      let fileName: string;

      if (file.endsWith('.md')) {
        fileName = `${file}c`;
      } else if (file.endsWith('.mdc')) {
        fileName = file;
      } else {
        continue;
      }

      const source = path.join(templateDir, file);
      const destination = path.join(cursorDir, fileName);

      const fileExists = existingFiles.includes(fileName);

      // Copy the rule file

      if (!fileExists) {
        logger.prompt.message(`Adding ${fileName}`);
        await fs.copyFile(source, destination);
        copied++;
        continue;
      }

      if (overwrite) {
        await fs.copyFile(source, destination);
        overwritten++;
        continue;
      }

      const shouldOverwrite = await confirm({
        message: `${fileName} already exists, overwrite?`,
      });

      if (shouldOverwrite) {
        await fs.copyFile(source, destination);
        overwritten++;
      }
    }

    if (copied > 0 || overwritten > 0) {
      result = true;
    }

    if (result) {
      logger.prompt.info(`${copied} rules added, ${overwritten} rules overwritten.`);
    }
    return result;
  } catch (error) {
    // Handle case where we might not be in a project (e.g., global install)
    logger.error('Failed to install cursor rules:', error);
    process.exit(1);
  }
}

export function logInstallResult(changesMade: boolean) {
  if (changesMade) {
    logger.prompt.outro(pc.green("You're all set!"));
    logger.quiet(pc.green("\n You're all set!"));
  } else {
    logger.prompt.outro(pc.yellow('No rules were added.'));
    logger.quiet(pc.yellow('\n No rules were added.'));
  }
}
