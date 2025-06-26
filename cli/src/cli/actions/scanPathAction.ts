import { readdirSync, readFileSync, lstatSync, writeFileSync } from 'node:fs';
import { join, resolve, relative, dirname } from 'node:path';
import { logger } from '~/shared/logger.js';
import pc from 'picocolors';
import outOfChar from 'out-of-character';
import { matchRegex } from '~/audit/matchRegex.js';
import { regexTemplates } from '~/audit/regex.js';

export interface ScanOptions {
  path: string;
  filter?: string;
  pattern: string;
  sanitize?: boolean;
}

export const runScanPathAction = ({
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
      logger.log(
        `  ${pc.dim('•')} Found ${dirInfo.count} files in ${pc.cyan(directory)}`
      );
    }

    // Additional processing could go here
    // For example, analyzing cursor rules files, linting, etc.
    const pathsToScan = [];
    for (const [directory, dirInfo] of filteredPathMap) {
      for (const file of dirInfo.files) {
        pathsToScan.push(join(directory, file));
      }
    }

    let count = 0;
    pathsToScan.forEach((file) => (count += checkFile(file, sanitize)));

    if (count === 0) {
      logger.info(pc.green(`\nAll files are safe ✅`));
    } else if (sanitize) {
      logger.info(pc.green(`\nFixed ${count} files ✅`));
    } else {
      logger.info(
        `\nRun ${pc.yellow('cursor-rules scan --sanitize')} to fix the file${
          count > 1 ? 's' : ''
        } ⚠️`
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

interface DirectoryInfo {
  count: number;
  path: string;
  files: string[];
}

function scanPath(
  pathStr: string,
  pattern: string
): Map<string, DirectoryInfo> {
  const pathInfo = new Map<string, DirectoryInfo>();

  try {
    const isDir = lstatSync(pathStr).isDirectory();

    if (!isDir) {
      const parentDir = dirname(pathStr);
      const relativePath = relative(process.cwd(), parentDir) || '.';
      const filename = pathStr.split('/').pop()!;

      if (!matchFileName(filename, pattern)) {
        return pathInfo;
      }

      pathInfo.set(relativePath, {
        count: 1,
        path: parentDir,
        files: [filename],
      });

      return pathInfo;
    }

    readdirSync(pathStr)
      .filter((entry) => excludeDefaultDirs(entry))
      .forEach((entry) => {
        const fullPath = join(pathStr, entry);
        const stats = lstatSync(fullPath);

        if (stats.isDirectory()) {
          // Recursively scan subdirectory and merge results
          const subpathInfo = scanPath(fullPath, pattern);
          for (const [subdir, subdirInfo] of subpathInfo) {
            if (pathInfo.has(subdir)) {
              // Merge with existing directory info
              const existing = pathInfo.get(subdir)!;
              existing.count += subdirInfo.count;
              existing.files.push(...subdirInfo.files);
            } else {
              // Add new directory info
              pathInfo.set(subdir, {
                count: subdirInfo.count,
                path: subdirInfo.path,
                files: [...subdirInfo.files],
              });
            }
          }
        } else if (stats.isFile() && matchFileName(entry, pattern)) {
          // Check if file matches include/exclude patterns
          const parentDir = dirname(fullPath);
          const relativeParentDir = relative(process.cwd(), parentDir);
          const displayDir = relativeParentDir || '.';

          if (pathInfo.has(displayDir)) {
            // Update existing directory info
            const existing = pathInfo.get(displayDir)!;
            existing.count++;
            existing.files.push(entry);
          } else {
            // Create new directory info
            pathInfo.set(displayDir, {
              count: 1,
              path: parentDir,
              files: [entry],
            });
          }
        }
      });
  } catch (error) {
    logger.warn(`Could not read directory: ${pathStr}`);
  }

  return pathInfo;
}

const excludedDirs = ['node_modules', '__pycache__'];
const excludedDotDirs = [
  '.git',
  '.github',
  '.vscode',
  '.egg-info',
  '.venv',
  '.next',
  '.nuxt',
  '.cache',
  '.sass-cache',
  '.gradle',
  '.DS_Store',
  '.ipynb_checkpoints',
  '.pytest_cache',
  '.mypy_cache',
  '.tox',
  '.hg',
  '.svn',
  '.bzr',
  '.lock-wscript',
  '.Python',
  '.jupyter',
  '.history',
  '.yarn',
  '.yarn-cache',
  '.eslintcache',
  '.parcel-cache',
  '.cache-loader',
  '.nyc_output',
  '.node_repl_history',
  '.pnp$',
];
const defaultExcludePattern =
  excludedDirs.join('$|^') + '$|^\\' + excludedDotDirs.join('$|^\\');

function excludeDefaultDirs(filename: string) {
  const excludeRegex = new RegExp(defaultExcludePattern);
  const matchesExclude = excludeRegex.test(filename);

  return !matchesExclude;
}

function matchFileName(filename: string, pattern: string) {
  try {
    // Use RegExp constructor for user-provided patterns
    const patternRegex = new RegExp(pattern, 'gv');
    return patternRegex.test(filename);
  } catch (error) {
    logger.warn(
      `Invalid regex pattern: ${pattern}. Error: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`
    );
    // Fall back to only cursor rules regex if pattern is invalid
    return false;
  }
}

function checkFile(file: string, sanitize?: boolean) {
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
