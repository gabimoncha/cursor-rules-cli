import { resolve } from 'node:path';
import pc from 'picocolors';
import { logger } from '~/shared/logger.js';
import { scanPath } from '~/core/scanPath.js';

export async function runListRulesAction(pattern: string) {
  try {
    const targetPath = resolve('.');
    logger.info(pc.blue(`📂 Scanning path: ${targetPath}`));

    const pathMap = scanPath(targetPath, pattern, true);

    const totalFiles = Array.from(pathMap.values()).reduce(
      (sum, dirInfo) => sum + dirInfo.count,
      0
    );

    if (totalFiles === 0) {
      logger.warn('No rules were found');
      return;
    }

    logger.info(pc.green(`\nFound ${totalFiles} rules:`));

    for (const [directory, dirInfo] of pathMap) {
      const noun = dirInfo.count === 1 ? 'rule' : 'rules';
      logger.log(`  ${pc.dim('•')} Found ${dirInfo.count} ${noun} in ${pc.cyan(directory)}`);
    }

    return;
  } catch (error) {
    if ((error as Error).message === 'folder empty') {
      logger.info('Run `cursor-rules init` to initialize the project.');
      logger.info('Run `cursor-rules help` to see all commands.');

      logger.quiet(pc.yellow('\n No .cursor/rules found.'));
      logger.quiet(pc.cyan('\n Run `cursor-rules init` to initialize the project.'));
      return;
    }

    // Handle case where we might not be in a project (e.g., global install)
    logger.error('\n Failed to list cursor rules:', error);
    process.exit(1);
  }
}
