import fs from 'node:fs/promises';
import path from 'node:path';
import { $ } from 'bun';
import pc from 'picocolors';
import { checkFile } from '../cli/src/cli/actions/scanRulesAction';
import { logger } from '../cli/lib/shared/logger';

export async function copyTemplates() {
  // Create the templates directory
  const templatesDir = path.join(process.cwd(), 'lib', 'templates', 'rules-default');
  await fs.mkdir(templatesDir, { recursive: true });

  // Copy default rules
  const rulesDefault = path.join(process.cwd(), 'src', 'templates', 'rules-default');
  const rulesDefaultFiles = await fs.readdir(rulesDefault, { recursive: true });

  for (const file of rulesDefaultFiles) {
    const input = Bun.file(path.join(rulesDefault, file));
    const output = Bun.file(path.join(templatesDir, file));
    await Bun.write(output, input);
  }

  let count = 0;

  try {
    await $`wget https://raw.githubusercontent.com/oven-sh/bun/refs/heads/main/src/init/rule.md -O ${templatesDir}/use-bun-instead-of-node-vite-npm-pnpm.md`.quiet();

    const bunRule = path.join(
      'lib',
      'templates',
      'rules-default',
      'use-bun-instead-of-node-vite-npm-pnpm.md'
    );

    count += checkFile(bunRule, true);
  } catch (error) {
    console.warn(pc.yellow('Bun rule.md link is probably broken'));
  }

  // Copy the awesome cursor rules after checking for vulnerabilities
  if (process.env.CI) {
    console.log('Skipping awesome cursor rules copy in CI');
    return;
  }

  const awesomeTemplatesDir = path.join(process.cwd(), 'lib', 'templates', 'awesome-cursorrules');
  await fs.mkdir(awesomeTemplatesDir, { recursive: true });

  const awesomeRulesNew = path.join(process.cwd(), '..', 'awesome-cursorrules', 'rules-new');

  const rulesNewFiles = await fs.readdir(awesomeRulesNew, { recursive: true });

  const awesomeRules = path.join('..', 'awesome-cursorrules', 'rules-new');

  for (const file of rulesNewFiles) {
    count += checkFile(path.join(awesomeRules, file), true);
    const input = Bun.file(path.join(awesomeRulesNew, file));
    const output = Bun.file(path.join(awesomeTemplatesDir, file));
    await Bun.write(output, input);
  }

  const noun = count === 1 ? 'file' : 'files';
  if (count === 0) {
    logger.info(pc.green('\nAll files are safe ✅'));
  } else {
    logger.info(pc.green(`\nFixed ${count} ${noun} ✅`));
  }
}

export async function copyRepomixInstructions() {
  // Create the templates directory
  const repomixInstructionsDir = path.join(
    process.cwd(),
    'lib',
    'templates',
    'repomix-instructions'
  );
  await fs.mkdir(repomixInstructionsDir, { recursive: true });

  // Copy repomix instructions
  const repomixInstructions = path.join(process.cwd(), 'src', 'templates', 'repomix-instructions');

  const file = 'instruction-project-structure.md';

  const input = Bun.file(path.join(repomixInstructions, file));
  const output = Bun.file(path.join(repomixInstructionsDir, file));
  await Bun.write(output, input);
}

(async () => {
  await copyTemplates();
  await copyRepomixInstructions();
})();
