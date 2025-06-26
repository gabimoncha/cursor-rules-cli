import fs from 'node:fs/promises';
import path from 'node:path';
import { detect } from 'out-of-character';
import { $ } from 'bun';
import pc from 'picocolors';

export async function copyTemplates() {
  // Create the templates directory
  const templatesDir = path.join(
    process.cwd(),
    'lib',
    'templates',
    'rules-default'
  );
  await fs.mkdir(templatesDir, { recursive: true });

  // Copy default rules
  const rulesDefault = path.join(
    process.cwd(),
    'src',
    'templates',
    'rules-default'
  );
  const rulesDefaultFiles = await fs.readdir(rulesDefault, { recursive: true });

  for (const file of rulesDefaultFiles) {
    const input = Bun.file(path.join(rulesDefault, file));
    const output = Bun.file(path.join(templatesDir, file));
    await Bun.write(output, input);
  }

  try {
    await $`wget https://raw.githubusercontent.com/oven-sh/bun/refs/heads/main/src/init/rule.md -O ${templatesDir}/use-bun-instead-of-node-vite-npm-pnpm.md`.quiet();
  } catch (error) {
    console.warn(pc.yellow('Bun rule.md link is probably broken'));
  }

  // Copy the awesome cursor rules after checking for vulnerabilities
  if (process.env.CI) {
    console.log('Skipping awesome cursor rules copy in CI');
    return;
  }

  const awesomeTemplatesDir = path.join(
    process.cwd(),
    'lib',
    'templates',
    'awesome-cursorrules'
  );
  await fs.mkdir(awesomeTemplatesDir, { recursive: true });

  const awesomeRulesNew = path.join(
    process.cwd(),
    '..',
    'awesome-cursorrules',
    'rules-new'
  );
  const rulesNewFiles = await fs.readdir(awesomeRulesNew, { recursive: true });

  let count = 0;

  for (const file of rulesNewFiles) {
    const text = await Bun.file(path.join(awesomeRulesNew, file)).text();
    const result = detect(text);

    if (result?.length > 0) {
      console.log(`${'Vulnerable'} ${file}`);
      count++;
    } else {
      const input = Bun.file(path.join(awesomeRulesNew, file));
      const output = Bun.file(path.join(awesomeTemplatesDir, file));
      await Bun.write(output, input);
    }
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
  const repomixInstructions = path.join(
    process.cwd(),
    'src',
    'templates',
    'repomix-instructions'
  );

  const file = 'instruction-project-structure.md';

  const input = Bun.file(path.join(repomixInstructions, file));
  const output = Bun.file(path.join(repomixInstructionsDir, file));
  await Bun.write(output, input);
}

(async () => {
  await copyTemplates();
  await copyRepomixInstructions();
})();
