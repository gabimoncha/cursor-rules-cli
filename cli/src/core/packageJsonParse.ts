import * as fs from 'node:fs/promises';
import path from 'node:path';
import * as url from 'node:url';
import { logger } from '~/shared/logger.js';
import { detect } from 'package-manager-detector/detect'
import { resolveCommand } from 'package-manager-detector/commands';

export const getVersion = async (): Promise<string> => {
  try {
    const packageJson = await parsePackageJson();

    if (!packageJson.version) {
      logger.warn('No version found in package.json');
      return 'unknown';
    }

    return packageJson.version;
  } catch (error) {
    logger.error('Error reading package.json:', error);
    return 'unknown';
  }
};

export const getPackageName = async (): Promise<string> => {
  try {
    const packageJson = await parsePackageJson();

    if (!packageJson.name) {
      logger.warn('No name found in package.json');
      return 'unknown';
    }

    return packageJson.name;
  } catch (error) {
    logger.error('Error reading package.json:', error);
    return 'unknown';
  }
};

export const getPackageManager = async (commandType: 'global' | 'upgrade') => {
  try {
    const pm = await detect({
      strategies: ['install-metadata', 'lockfile']
    })
    if (!pm) {
      logger.debug('Could not detect package manager')
      throw new Error('Could not detect package manager')
    }

    const version = commandType === 'global' ? '@latest' : ''

    const { command, args } = resolveCommand(pm.agent, commandType, [`@gabimoncha/cursor-rules${version}`]) || {}
    return `${command} ${args?.join(' ') || ''}`
  } catch (error) {
    logger.error('Error detecting package manager:', error);
    throw new Error('Error detecting package manager', { cause: error })
  }
};

const parsePackageJson = async (): Promise<{
  name: string;
  version: string;
}> => {
  const dirName = url.fileURLToPath(new URL('.', import.meta.url));
  const packageJsonPath = path.join(dirName, '..', '..', 'package.json');
  const packageJsonFile = await fs.readFile(packageJsonPath, 'utf-8');
  const packageJson = JSON.parse(packageJsonFile);
  return packageJson;
};
