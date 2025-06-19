import { existsSync, PathOrFileDescriptor, readdirSync, readFileSync, writeFileSync } from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";
import pc from "picocolors";
import { logger } from "~/shared/logger.js";
import outOfChar from 'out-of-character';
import { confirm, isCancel } from "@clack/prompts";
import { matchRegex } from "~/audit/matchRegex.js";

const rootRulesFilter = (file: string) => {
  return file === '.windsurfrules' || file === '.cursorrules'
  || file.startsWith('.clinerules') 
  || file.endsWith('.avanterules')
}

const folderRules = [
  '.cursor/rules',
  '.github/prompts',
]


export async function runAuditRulesAction() {
  try {
    let count = 0;
    let vulnerableFiles:PathOrFileDescriptor[] = [];

    const rootRulesFiles = readdirSync(process.cwd()).filter(rootRulesFilter);

    rootRulesFiles.forEach((file) => {
      count = checkFile(file, path.join(process.cwd(), file), count, vulnerableFiles);
    });

    folderRules.forEach((folder) => {
      const ruleDir = path.join(process.cwd(), folder);

      if (!existsSync(ruleDir)) {
        logger.debug(pc.yellow(`\n No ${folder} folder found.`));
        logger.quiet(pc.yellow(`\n No ${folder} folder found.`));
        return;
      }

      const files = readdirSync(ruleDir);
      files.forEach((file) => {
        count = checkFile(file, path.join(ruleDir, file), count, vulnerableFiles);
      });
    });

    logger.force(`\n Found ${count} vulnerabilit${count === 1 ? 'y' : 'ies'}`);

    console.log('vulnerableFiles:', vulnerableFiles);

    if (vulnerableFiles.length > 0) {
      const confirmVulnerableFiles = await confirm({
        message: `\n Do you want to clean these files? (will remove all non-ASCII characters)`,
      });

      if (isCancel(confirmVulnerableFiles)) {
        process.exit(0);
      }

      if (confirmVulnerableFiles) {
        for (const file of vulnerableFiles) {
          let text = readFileSync(file).toString();
          writeFileSync(file, text.replace(/[^\x00-\x7F]/g, ''));
        }
      }
    }
  } catch (error) {
    console.log(error);
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

function checkFile(file: string, filePath: PathOrFileDescriptor, count: number, vulnerableFiles: PathOrFileDescriptor[]) {
  try {
    const text = readFileSync(filePath).toString();
    const result = outOfChar.detect(text);

    const matchedRegex = matchRegex(text);

    const matched = Object.values(matchedRegex).some(matched => !!matched);
    const isVulnerable = result?.length > 0 || matched;
    if (isVulnerable) {
      logger.prompt.message(`${pc.red('Vulnerable')} ${path.relative(process.cwd(), filePath.toString())}`);
      count++;
      vulnerableFiles.push(filePath);
    }
  } catch(e) {
    console.log(e);
    logger.quiet(pc.yellow(`\n No ${file} found.`));
  }

  return count;
}
