import type { OptionValues } from 'commander';
import type { SupportedShell } from '@pnpm/tabtab';

export interface CliOptions extends OptionValues {
  // Rules Options
  force?: boolean;
  repomix?: boolean;
  overwrite?: boolean;

  // Scan Options
  path?: string;
  pattern?: string; // list option too
  filter?: string;
  sanitize?: boolean;

  // Completion Options
  install?: boolean;
  uninstall?: boolean;

  // MCP
  // mcp?: boolean;

  // Other Options
  version?: boolean;
  verbose?: boolean;
  quiet?: boolean;
}

export const SHELL_LOCATIONS: Record<SupportedShell, string> = {
  bash: '~/.bashrc',
  zsh: '~/.zshrc',
  fish: '~/.config/fish/config.fish',
  pwsh: '~/Documents/PowerShell/Microsoft.PowerShell_profile.ps1',
};
