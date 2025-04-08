import fs from "node:fs/promises";
import path from "node:path";
import { confirm, log, outro } from "@clack/prompts";
import pc from 'picocolors';
import { logger } from "~/shared/logger.js";

export async function installRules(templateDir: string, overwrite: boolean = false, selectedRules: string[] = []):Promise<boolean> {
  try {
    // Use current working directory as target
    const targetDir = process.cwd();

    log.step("Installing Cursor rules...");

    // Create .cursor directory if it doesn't exist
    const cursorDir = path.join(targetDir, ".cursor", "rules");
    await fs.mkdir(cursorDir, { recursive: true });

    // Get list of rule files from the package
    let templateFiles = await fs.readdir(templateDir);

    if (selectedRules.length > 0) {
      templateFiles = templateFiles.filter(file => selectedRules.includes(file));
    }

    // Copy each rule file to the project's .cursor directory
    let copied = 0;
    let overwritten = 0;
    let result = false;

    // Get list of existing rule files
    let existingFiles = await fs.readdir(cursorDir);

    for (const file of templateFiles) {
      if (!file.endsWith(".md")) continue;

      const fileName = file + 'c';

      const source = path.join(templateDir, file);
      const destination = path.join(cursorDir, fileName);

      const fileExists = existingFiles.includes(fileName);

      // Copy the rule file

      if(!fileExists) {
        log.message(`Adding ${fileName}`);
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

    if(copied > 0 || overwritten > 0) {
      result = true;
    }

    if (result) {
      log.info(`${copied} rules added, ${overwritten} rules overwritten.`);
    }
    return result;
  } catch (error) {
    // Handle case where we might not be in a project (e.g., global install)
    logger.error("Failed to install cursor rules:", error);
    process.exit(1);
  }
}

export function logInstallResult(result: boolean) {
  if (result) {
    outro(pc.green(`You're all set!`));
  } else {
    outro(pc.yellow(`Zero changes made.`));
  }
}