import fs from "node:fs/promises";
import path from "node:path";
import { select } from "@clack/prompts";
import { logger } from "~/shared/logger.js";

export async function installRules(templateDir: string, overwrite: boolean = false): Promise<boolean> {
  try {
    // Use current working directory as target
    const targetDir = process.cwd();

    logger.log("Installing Cursor rules...");

    // Create .cursor directory if it doesn't exist
    const cursorDir = path.join(targetDir, ".cursor", "rules");
    await fs.mkdir(cursorDir, { recursive: true });

    // Get list of rule files from the package
    const templateFiles = await fs.readdir(templateDir);

    // Copy each rule file to the project's .cursor directory
    let copied = 0;
    let overwritten = 0;

    // Get list of existing rule files
    let existingFiles: string[] = [];
    try {
      existingFiles = await fs.readdir(cursorDir);
    } catch {
      // If directory doesn't exist or isn't readable
    }

    for (const file of templateFiles) {
      if (!file.endsWith(".md")) continue;

      const fileName = file + 'c';

      const source = path.join(templateDir, file);
      const destination = path.join(cursorDir, fileName);

      const fileExists = existingFiles.includes(fileName);

      // Copy the rule file

      if(!fileExists) {
        logger.log(`Adding ${fileName}`);
        await fs.copyFile(source, destination);
        copied++;
        continue;
      }

      if (overwrite) {
        await fs.copyFile(source, destination);
        overwritten++;
        continue;
      }
      
      const shouldOverwrite = await select({
        message: `${fileName} already exists, overwrite?`,
        options: [
          { value: true, label: 'Yes' },
          { value: false, label: 'No' },
        ],
      });

      if (shouldOverwrite) {
        await fs.copyFile(source, destination);
        overwritten++;
      }
    }

    if (!copied && !overwritten) {
      return false;
    }

    return true;
  } catch (error) {
    // Handle case where we might not be in a project (e.g., global install)
    logger.error("Failed to install cursor rules:", error);
    process.exit(1);
  }
}
