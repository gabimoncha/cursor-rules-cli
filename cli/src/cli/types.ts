import type { OptionValues } from 'commander';

export interface CliOptions extends OptionValues {
  // Basic Options
  list?: boolean;
  version?: boolean;

  // Rules Options
  force?: boolean;
  init?: boolean;
  repomix?: boolean;
  
  // MCP
  // mcp?: boolean;
  
  // Other Options
  verbose?: boolean;
  quiet?: boolean;
}
