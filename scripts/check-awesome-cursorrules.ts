import path from 'node:path';
import { runScanRulesAction } from '../cli/src/cli/actions/scanRulesAction';

export async function checkForVulnerability() {
  const awesomeRulesNew = path.join(process.cwd(), 'awesome-cursorrules', 'rules-new');
  runScanRulesAction({
    path: awesomeRulesNew,
    pattern: '.*',
    sanitize: true,
  });

  // const awesomeRules = path.join(process.cwd(), 'awesome-cursorrules', 'rules');

  // runScanRulesAction({
  //   path: awesomeRules,
  //   pattern: '.*',
  //   sanitize: true,
  // });
}

checkForVulnerability();
