import { existsSync } from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";
import pc from "picocolors";
import { logger } from "~/shared/logger.js";

export async function runListRulesAction() {
  try {
    // Create .cursor directory if it doesn't exist
    const cursorDir = path.join(process.cwd(), ".cursor", "rules");

    if (!existsSync(cursorDir)) {
      logger.warn("\nNo .cursor/rules found.\n");
      throw new Error("folder empty");

    }

    const files = await fs.readdir(cursorDir);

    if (files.length === 0) {
      logger.warn("\n.cursor/rules folder is empty.\n");
      throw new Error("folder empty");
    }

    let count = 0;
    
    logger.log('\n');
    logger.prompt.intro(`Found ${files.length} Cursor rules:`);

    for(const file of files) {
      logger.prompt.message(file);
      count++;
    }
    
    logger.prompt.outro(``);
    logger.quiet(`\nFound ${files.length} Cursor rules`);

    return;
  } catch (error) {
    if((error as Error).message === "folder empty") {
      logger.info("Run `cursor-rules init` to initialize the project.");
      logger.info("Run `cursor-rules help` to see all commands.");
      
      logger.quiet(pc.yellow("\nNo .cursor/rules found."));
      logger.quiet(pc.cyan("\nRun `cursor-rules init` to initialize the project."));
      return;
    }

    // Handle case where we might not be in a project (e.g., global install)
    logger.error("\nFailed to list cursor rules:", error);
    process.exit(1);
  }
}
