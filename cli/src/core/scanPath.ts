import { lstatSync, readdirSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { logger } from '~/shared/logger.js';

interface DirectoryInfo {
  count: number;
  path: string;
  files: string[];
}

export function scanPath(
  pathStr: string,
  pattern: string,
  isList: boolean = false
): Map<string, DirectoryInfo> {
  const pathInfo = new Map<string, DirectoryInfo>();

  try {
    const isDir = lstatSync(pathStr).isDirectory();

    if (isList && !isDir) {
      logger.warn(`${pathStr} is not a directory`);
      process.exit(1);
    }

    if (!isDir && !isList) {
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
