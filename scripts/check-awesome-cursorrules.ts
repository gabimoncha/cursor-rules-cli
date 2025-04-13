import fs from 'node:fs/promises'
import path from 'node:path';
import { detect } from 'out-of-character'

export async function checkForVulnerability() {
  let count = 0;
  
  const awesomeRulesNew = path.join(process.cwd(), 'awesome-cursorrules', 'rules-new')
  const rulesNewFiles = await fs.readdir(awesomeRulesNew, { recursive: true });

  for(const file of rulesNewFiles) {
    let text = await Bun.file(path.join(awesomeRulesNew, file)).text()
    let result = detect(text)
    
    if (result?.length > 0) {
      console.log(`${'Vulnerable'} ${file}`);
      count++;
    }
  }

  const awesomeRules = path.join(process.cwd(), 'awesome-cursorrules', 'rules')
  const rulesFiles = await fs.readdir(awesomeRules, { recursive: true });

  const rulesFilesFiltered = rulesFiles.filter(f => f.endsWith('.mdc') || f === '.cursorrules')

  for(const file of rulesFilesFiltered) {
    let text = await Bun.file(path.resolve(awesomeRules, file)).text()
    let result = detect(text)
    
    if (result?.length > 0) {
      console.log(`${'Vulnerable'} ${file}`);
      count++;
    }
  }

  console.log(`Found ${count} vulnerable rules`);
  if (count > 0) {
    process.exit(1)
  }
}

checkForVulnerability()