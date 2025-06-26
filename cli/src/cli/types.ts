import type { OptionValues } from 'commander';
import type { SupportedShell } from '@pnpm/tabtab';

export interface CliOptions extends OptionValues {
  // Basic Options
  list?: boolean;
  version?: boolean;

  // Rules Options
  force?: boolean;
  repomix?: boolean;
  overwrite?: boolean;

  // Scan Options
  path?: string;
  filter?: string;
  pattern?: string;
  sanitize?: boolean;

  // Completion Options
  install?: boolean;
  uninstall?: boolean;

  // MCP
  // mcp?: boolean;

  // Other Options
  verbose?: boolean;
  quiet?: boolean;
}

export const SHELL_LOCATIONS: Record<SupportedShell, string> = {
  bash: '~/.bashrc',
  zsh: '~/.zshrc',
  fish: '~/.config/fish/config.fish',
  pwsh: '~/Documents/PowerShell/Microsoft.PowerShell_profile.ps1',
};
