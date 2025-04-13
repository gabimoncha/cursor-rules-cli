import { existsSync, readFileSync } from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";
import pc from "picocolors";
import { logger } from "~/shared/logger.js";
import outOfChar from 'out-of-character';


export async function runAuditRulesAction() {
  try {
    let count = 0;

    // check for .github/copilot-instructions.md file
    count = checkFile('.github/copilot-instructions.md', path.join(process.cwd(), '.github/copilot-instructions.md'), count);
    
    // check for .windsurfrules file
    count = checkFile('.windsurfrules', path.join(process.cwd(), '.windsurfrules'), count);
    
    // check for .clinerules and .clinerules-{mode} files
    const clineRuleFiles = (await fs.readdir(process.cwd())).filter(file => file.startsWith('.clinerules'));

    for(const file of clineRuleFiles) {
      count = checkFile(file, path.join(process.cwd(), file), count);
    }

    // check for .cursor/rules files
    const cursorRulesDir = path.join(process.cwd(), ".cursor/rules");
    
    if (!existsSync(cursorRulesDir)) {
      logger.quiet(pc.yellow("\n No .cursor/rules found."));
      return;
    }

    const files = await fs.readdir(cursorRulesDir);

    if (files.length === 0) {
      logger.quiet(pc.yellow("\n No .cursor/rules found."));
      return;
    }

    for(const file of files) {
      count = checkFile(file, path.join(cursorRulesDir, file), count);
    }

    logger.force(`\n Found ${count} vulnerabilit${count === 1 ? 'y' : 'ies'}`);
    return;
  } catch (error) {
    if((error as Error).message === "folder empty") {
      logger.info("Run `cursor-rules init` to initialize the project.");
      logger.info("Run `cursor-rules help` to see all commands.");
      
      logger.quiet(pc.yellow("\n No .cursor/rules found."));
      logger.quiet(pc.cyan("\n Run `cursor-rules init` to initialize the project."));
      return;
    }

    // Handle case where we might not be in a project (e.g., global install)
    logger.error("\n Failed to list cursor rules:", error);
    process.exit(1);
  }
}

function checkFile(file: string, filePath: string, count: number) {
  try {
    let text = readFileSync(filePath).toString();
    let result = outOfChar.detect(text);
    
    if (result?.length > 0) {
      logger.prompt.message(`${pc.red('Vulnerable')} ${path.relative(process.cwd(), filePath)}`);
      count++;
    }
  } catch(e) {
    logger.quiet(pc.yellow(`\n No ${file} found.`));
  }

  return count;
}
