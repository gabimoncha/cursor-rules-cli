import { readFileSync, writeFileSync } from 'node:fs';
import { join, resolve, relative } from 'node:path';
import { logger } from '~/shared/logger.js';
import pc from 'picocolors';
import outOfChar from 'out-of-character';
import { matchRegex } from '~/audit/matchRegex.js';
import { regexTemplates } from '~/audit/regex.js';
import { scanPath } from '~/core/scanPath.js';

export interface ScanOptions {
  path: string;
  filter?: string;
  pattern: string;
  sanitize?: boolean;
}

export const runScanRulesAction = ({
  path,
  filter,
  pattern,
  sanitize,
}: ScanOptions) => {
  try {
    const targetPath = resolve(path);
    logger.info(pc.blue(`📂 Scanning path: ${path}`));

    const pathMap = scanPath(targetPath, pattern);

    // Apply filter to directory keys if provided
    let filteredPathMap = pathMap;
    if (filter) {
      filteredPathMap = new Map();
      for (const [dirPath, dirInfo] of pathMap) {
        // Check if filter matches directory path
        const matchesDirectory = dirPath.includes(filter);

        // Check if filter matches any file path within this directory
        const matchesFile = dirInfo.files.filter((filename) => {
          const fullFilePath =
            dirPath === '.' ? filename : `${dirPath}/${filename}`;
          return fullFilePath.includes(filter);
        });

        if (matchesDirectory || matchesFile.length > 0) {
          filteredPathMap.set(dirPath, {
            ...dirInfo,
            count: matchesFile.length,
            files: matchesFile,
          });
        }
      }

      if (filteredPathMap.size === 0) {
        logger.warn(
          `No directories or files found matching filter: "${filter}"`
        );
        return;
      }

      logger.info(pc.yellow(`🔍 Filtering by: "${filter}"`));
    }

    const totalFiles = Array.from(filteredPathMap.values()).reduce(
      (sum, dirInfo) => sum + dirInfo.count,
      0
    );

    if (totalFiles === 0) {
      logger.warn('No files found matching the criteria');
      return;
    }

    logger.info(pc.green(`\nFound ${totalFiles} files total:`));

    for (const [directory, dirInfo] of filteredPathMap) {
      const noun = dirInfo.count === 1 ? 'rule' : 'rules';

      logger.log(
        `  ${pc.dim('•')} Found ${dirInfo.count} ${noun} in ${pc.cyan(
          directory
        )}`
      );
    }

    const pathsToScan = [];
    for (const [directory, dirInfo] of filteredPathMap) {
      for (const file of dirInfo.files) {
        pathsToScan.push(join(directory, file));
      }
    }

    let count = 0;
    pathsToScan.forEach((file) => (count += checkFile(file, sanitize)));

    const noun = count === 1 ? 'file' : 'files';
    if (count === 0) {
      logger.info(pc.green(`\nAll files are safe ✅`));
    } else if (sanitize) {
      logger.info(pc.green(`\nFixed ${count} ${noun} ✅`));
    } else {
      logger.info(
        `\nRun ${pc.yellow(
          'cursor-rules scan --sanitize'
        )} to fix the ${noun} ⚠️`
      );
    }
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Failed to scan path: ${error.message}`);
    } else {
      logger.error('Unknown error occurred while scanning path');
    }
    throw error;
  }
};

export function checkFile(file: string, sanitize?: boolean) {
  try {
    const filePath = join(process.cwd(), file);
    const content = readFileSync(filePath).toString();

    const matchedRegex = matchRegex(content);
    const matched = Object.entries(matchedRegex);

    const outOfCharResult = outOfChar.detect(content);

    const isVulnerable = outOfCharResult?.length > 0 || matched.length > 0;
    if (!isVulnerable) return 0;

    logger.prompt.message(
      `${pc.red('Vulnerable file:')} ${pc.yellow(
        relative(process.cwd(), filePath)
      )}`
    );

    if (matched.length > 0) {
      matched.forEach(([template, decoded]) => {
        const foundMsg = `Found${decoded ? ' hidden' : ''} ${template}`;
        const decodedMsg = `${decoded ? `:\n${decoded}` : ''}`;
        logger.prompt.message(`${pc.blue(foundMsg)}${decodedMsg}`);
      });
    }

    if (outOfCharResult && outOfCharResult.length > 0) {
      const noun = outOfCharResult.length > 1 ? 'characters' : 'character';
      logger.prompt.message(pc.blue(`Hidden ${noun}:`));
      const hiddenChars = outOfCharResult.reduce(
        (acc: { [key: string]: number }, obj: any) => {
          if (acc[obj.name]) {
            acc[obj.name]++;
          } else {
            acc[obj.name] = 1;
          }
          return acc;
        },
        {}
      );
      Object.entries(hiddenChars).forEach(([name, count]) => {
        const noun = count > 1 ? 'chars' : 'char';
        logger.prompt.message(
          pc.dim(`${pc.red('•')} '${name}': ${count} ${noun}`)
        );
      });
    }
    if (!sanitize) return 1;

    let fixedContent = content;
    if (matched.length > 0) {
      matched.forEach(([template]) => {
        fixedContent = fixedContent.replace(
          regexTemplates[template as keyof typeof regexTemplates],
          ''
        );
      });
    }

    if (outOfCharResult?.length > 0) {
      fixedContent = outOfChar.replace(fixedContent);
    }

    writeFileSync(filePath, fixedContent);
    return 1;
  } catch (e) {
    console.log(e);
    logger.quiet(pc.yellow(`\n No ${file} found.`));
    return 0;
  }
}
