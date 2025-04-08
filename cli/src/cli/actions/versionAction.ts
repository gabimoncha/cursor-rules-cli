import pc from 'picocolors';
import { getVersion } from '~/core/packageJsonParse.js';
import { logger } from '~/shared/logger.js';

export const runVersionAction = async (): Promise<void> => {
  const version = await getVersion();
  logger.log(pc.dim(`\n📦 Cursor Rules v${version}\n`));
};
