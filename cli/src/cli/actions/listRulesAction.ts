import { existsSync } from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";
import { logger } from "~/shared/logger.js";

export async function runListRulesAction() {
  try {
    const targetDir = process.cwd();
    logger.log("Looking for Cursor rules...\n");

    // Create .cursor directory if it doesn't exist
    const cursorDir = path.join(targetDir, ".cursor", "rules");

    if (!existsSync(cursorDir)) {
      logger.warn("No .cursor/rules found.");
      logger.warn("Run `cursor-rules --init` to create a new rule.");
      return;
    }

    const files = await fs.readdir(cursorDir);

    if (files.length === 0) {
      logger.warn(".cursor/rules folder is empty.");
      return;
    }

    let count = 0;

    for(const file of files) {
      logger.log(file);
      count++;
    }

    logger.log(`\nFound ${count} Cursor rules.`);
    return;
  } catch (error) {
    // Handle case where we might not be in a project (e.g., global install)
    logger.error("Failed to list cursor rules:", error);
    process.exit(1);
  }
}
