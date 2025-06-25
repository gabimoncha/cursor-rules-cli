import { readdirSync, statSync } from 'node:fs';
import { join, resolve, relative, dirname } from 'node:path';
import { logger } from '~/shared/logger.js';
import pc from 'picocolors';

export interface ScanOptions {
  filter: string;
  path: string;
}

export const runScanPathAction = (options: ScanOptions) => {
  try {
    const targetPath = resolve(options.path);
    logger.info(pc.blue(`📂 Scanning path: ${options.path}`));

    const directoriesInfo = scanDirectory(targetPath, options.filter);

    // Apply filter to directory keys if provided
    let filteredDirectoriesInfo = directoriesInfo;
    if (options.filter) {
      filteredDirectoriesInfo = new Map();
      for (const [dirPath, dirInfo] of directoriesInfo) {
        // Check if filter matches directory path
        const matchesDirectory = dirPath.includes(options.filter);

        // Check if filter matches any file path within this directory
        const matchesFile = dirInfo.files.filter((filename) => {
          const fullFilePath =
            dirPath === '.' ? filename : `${dirPath}/${filename}`;
          return fullFilePath.includes(options.filter);
        });

        if (matchesDirectory || matchesFile.length > 0) {
          filteredDirectoriesInfo.set(dirPath, {
            ...dirInfo,
            count: matchesFile.length,
            files: matchesFile,
          });
        }
      }

      if (filteredDirectoriesInfo.size === 0) {
        logger.warn(
          `No directories or files found matching filter: "${options.filter}"`
        );
        return;
      }

      logger.info(pc.yellow(`🔍 Filtering by: "${options.filter}"`));
    }

    const totalFiles = Array.from(filteredDirectoriesInfo.values()).reduce(
      (sum, dirInfo) => sum + dirInfo.count,
      0
    );

    if (totalFiles === 0) {
      logger.warn('No files found matching the criteria');
      return;
    }

    logger.info(pc.green(`\n✅ Found ${totalFiles} files total:`));

    for (const [directory, dirInfo] of filteredDirectoriesInfo) {
      logger.log(
        `  ${pc.dim('•')} Found ${dirInfo.count} files in ${pc.cyan(directory)}`
      );
    }

    // Additional processing could go here
    // For example, analyzing cursor rules files, linting, etc.
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

function scanDirectory(
  dirPath: string,
  filter: string
): Map<string, DirectoryInfo> {
  const directoriesInfo = new Map<string, DirectoryInfo>();

  try {
    const baseDirs = readdirSync(dirPath);
    const filteredBaseDirs = baseDirs.filter((entry) =>
      excludeDefaultDirs(entry)
    );

    // Recursively scan each filtered directory
    for (const entry of filteredBaseDirs) {
      const fullPath = join(dirPath, entry);
      const stats = statSync(fullPath);

      if (stats.isDirectory()) {
        // Recursively scan subdirectory and merge results
        const subDirectoriesInfo = scanDirectory(fullPath, filter);
        for (const [dir, dirInfo] of subDirectoriesInfo) {
          if (directoriesInfo.has(dir)) {
            // Merge with existing directory info
            const existing = directoriesInfo.get(dir)!;
            existing.count += dirInfo.count;
            existing.files.push(...dirInfo.files);
          } else {
            // Add new directory info
            directoriesInfo.set(dir, {
              count: dirInfo.count,
              path: dirInfo.path,
              files: [...dirInfo.files],
            });
          }
        }
      } else if (stats.isFile() && isCursorRulesFile(entry)) {
        // Check if file matches include/exclude patterns
        const parentDir = dirname(fullPath);
        const relativeParentDir = relative(process.cwd(), parentDir);
        const displayDir = relativeParentDir || '.';

        if (directoriesInfo.has(displayDir)) {
          // Update existing directory info
          const existing = directoriesInfo.get(displayDir)!;
          existing.count++;
          existing.files.push(entry);
        } else {
          // Create new directory info
          directoriesInfo.set(displayDir, {
            count: 1,
            path: parentDir,
            files: [entry],
          });
        }
      }
    }
  } catch (error) {
    logger.warn(`Could not read directory: ${dirPath}`);
  }

  return directoriesInfo;
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

function isCursorRulesFile(filename: string) {
  return filename === '.cursorrules' || filename.endsWith('.mdc');
}
