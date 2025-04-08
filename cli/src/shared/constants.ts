import { dirname, join } from "path";
import { RepomixConfig } from "repomix";
import { fileURLToPath } from "url";

export const CURSOR_RULES_GITHUB_URL = 'https://github.com/gabimoncha/cursor-rules-cli';
export const CURSOR_RULES_ISSUES_URL = `${CURSOR_RULES_GITHUB_URL}/issues`;

export const TEMPLATE_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', 'templates');


const IGNORE_PATTERNS = [
  ".cursor",
  "lib",
  "dist",
  "build",
  "*.log",
  "repomix*",
];

export const REPOMIX_OPTIONS = {
  style: "xml" as const,
  compress: true,
  removeEmptyLines: false,
  removeComments: false,
  includeEmptyDirectories: true,
  gitSortByChanges: false,
  topFilesLength: 5,
  ignore: IGNORE_PATTERNS.join(','),
}

export const DEFAULT_REPOMIX_CONFIG: RepomixConfig = {
  output: {
    filePath: "repomix-output.xml",
    style: "xml",
    parsableStyle: false,
    fileSummary: true,
    directoryStructure: true,
    removeComments: false,
    removeEmptyLines: false,
    compress: false,
    topFilesLength: 5,
    showLineNumbers: false,
    copyToClipboard: false,
    includeEmptyDirectories: false,
    git: {
      sortByChanges: false,
      sortByChangesMaxCommits: 100
    }
  },
  include: [],
  ignore: {
    useGitignore: true,
    useDefaultPatterns: true,
    customPatterns: IGNORE_PATTERNS
  },
  security: {
    enableSecurityCheck: true
  },
  tokenCount: {
    encoding: "o200k_base"
  }
};