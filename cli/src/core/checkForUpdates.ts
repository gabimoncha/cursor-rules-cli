import path from 'path';
import fs from 'fs/promises';
import { existsSync, mkdirSync, readFileSync } from 'fs';
import { logger } from '~/shared/logger.js';
import { getPackageManager, getPackageName, getVersion } from '~/core/packageJsonParse.js';
import semver from 'semver';
import { execSync } from 'child_process';
import pc from 'picocolors';

const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds


// Function to check for updates and notify user
export async function checkForUpdates() {
  try {
    const { currentVersion, latestVersion, updateAvailable } = await getLatestVersion();    
    if (updateAvailable) {

      const isLocal = checkIfLocal();
      logger.debug(`cursor-rules installed ${isLocal ? 'locally' : 'globally'}`);

      const updateCommand = await getPackageManager(isLocal ? 'upgrade' : 'global');
      
      const updateMessage = [
        '',
        pc.bold(pc.yellow('Update available! ')) + pc.dim(`${currentVersion} → `) + pc.bold(pc.cyan(`${latestVersion}`)),
        pc.dim('Run: ') + pc.bold(updateCommand) + pc.dim(' to update'),
        ''
      ].join('\n ');

      return updateMessage;
    }
  } catch (error) {
    // Silently fail if update check fails
    logger.debug('Failed to check for updates:', error);
  }
}

async function getLatestVersion(): Promise<{
  currentVersion: string;
  latestVersion: string;
  updateAvailable: boolean;
}> {
  try {
    const currentVersion = await getVersion();
    const cachedData = readCache();

    if (cachedData && Date.now() - cachedData.timestamp < CACHE_TTL) {
      writeCache({
        latestVersion: cachedData.latestVersion,
        timestamp: Date.now()
      });
      return { 
        currentVersion, 
        latestVersion: cachedData.latestVersion, 
        updateAvailable: semver.gt(cachedData.latestVersion, currentVersion)
      };
    }

    const packageName = await getPackageName();
    const response = await fetch(`https://registry.npmjs.org/${packageName}`);
    
    if (!response.ok) {
      logger.debug(`Failed to fetch latest version: ${response.status}`);
      return { currentVersion, latestVersion: currentVersion, updateAvailable: false };
    }
    
    const data = await response.json() as { 'dist-tags'?: { latest: string } };
    const latestVersion = data['dist-tags']?.latest;
    
    if (!latestVersion) {
      return { currentVersion, latestVersion: currentVersion, updateAvailable: false };
    }
    
    // Compare versions (simple string comparison works for semver format)
    const updateAvailable = semver.gt(latestVersion, currentVersion);
    
    // Cache the result
    try {
      writeCache({
        latestVersion,
        timestamp: Date.now()
      });
      logger.debug('Update check result cached');
    } catch (error) {
      logger.debug('Error caching update check result:', error);
    }
    
    return { currentVersion, latestVersion, updateAvailable };
  } catch (error) {
    throw new Error('Error checking for updates:', { cause: error });
  }
};

// Get the cache directory path for storing update check results
function getCacheDir() {
  // Use the user's home directory for the cache
  const homeDir = process.env.HOME ||  '.';
  const cacheDir = path.join(checkIfLocal() ? process.cwd() : homeDir, '.cursor-rules-cli', 'cache');
  
  // Ensure the cache directory exists
  if (!existsSync(cacheDir)) {
    mkdirSync(cacheDir, { recursive: true });
  }
  
  return cacheDir;
};

function checkIfLocal() {
  const cursorRulesPath = execSync('which cursor-rules').toString();
  return cursorRulesPath.includes('node_modules');
}

type CachedData = {
  latestVersion: string;
  timestamp: number;
}

function readCache(): CachedData | null {
  const cacheFile = path.join(getCacheDir(), 'update-check.json');
  if (existsSync(cacheFile)) {
    const cacheContent = readFileSync(cacheFile, 'utf-8');
    return JSON.parse(cacheContent) as CachedData;
  }

  return null;
}

async function writeCache(data: CachedData) {
  const cacheFile = path.join(getCacheDir(), 'update-check.json');
  fs.writeFile(cacheFile, JSON.stringify(data));
}