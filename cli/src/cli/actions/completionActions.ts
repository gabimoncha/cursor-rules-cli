import { getShellFromEnv, isShellSupported, install, uninstall } from '@pnpm/tabtab';
import { logger } from '~/shared/logger.js';
import { SHELL_LOCATIONS } from '~/cli/types.js';

const shell = getShellFromEnv(process.env);

export const runInstallCompletionAction = async () => {
  try {
    logger.info('Installing tab completion...');

    if (!shell || !isShellSupported(shell)) {
      throw new Error(`${shell} is not supported`);
    }

    await install({
      name: 'cursor-rules',
      completer: 'cursor-rules',
      shell: shell,
    });

    logger.info('✅ Tab completion installed successfully!');
    logger.info(`Please restart your terminal or run: source ${SHELL_LOCATIONS[shell]}`);
  } catch (error) {
    logger.error('Failed to install completion:', error);
  }
};

export const runUninstallCompletionAction = async () => {
  try {
    logger.info('Uninstalling tab completion...');

    if (!shell || !isShellSupported(shell)) {
      throw new Error(`${shell} is not supported`);
    }

    await uninstall({
      name: 'cursor-rules',
      shell: shell,
    });

    logger.info('✅ Tab completion uninstalled successfully!');
    logger.info(`Please restart your terminal or run: source ${SHELL_LOCATIONS[shell]}`);
  } catch (error) {
    logger.error('Failed to uninstall completion:', error);
  }
};
