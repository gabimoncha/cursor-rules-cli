import path from "path";
import fs from "node:fs/promises";
import { detect } from "out-of-character";

export async function copyTemplates() {
  // Create the templates directory
  const templatesDir = path.join(process.cwd(), 'lib', 'templates', 'rules-default');
  await fs.mkdir(templatesDir, { recursive: true });

  // Copy default rules
  const rulesDefault = path.join(process.cwd(), 'src', 'templates', 'rules-default')
  const rulesDefaultFiles = await fs.readdir(rulesDefault, { recursive: true });

  for (const file of rulesDefaultFiles) {
    await fs.copyFile(path.join(rulesDefault, file), path.join(templatesDir, file));
  }

  // Copy the awesome cursor rules after checking for vulnerabilities
  const awesomeRulesNew = path.join(process.cwd(), '..', 'awesome-cursorrules', 'rules-new')
  const rulesNewFiles = await fs.readdir(awesomeRulesNew, { recursive: true });

  let count = 0;

  for (const file of rulesNewFiles) {
    let text = await Bun.file(path.join(awesomeRulesNew, file)).text()
    let result = detect(text)
    
    if (result?.length > 0) {
      console.log(`${'Vulnerable'} ${file}`);
      count++;
    } else {
      await fs.copyFile(path.join(awesomeRulesNew, file), path.join(templatesDir, file));
    }
  }
}

copyTemplates()