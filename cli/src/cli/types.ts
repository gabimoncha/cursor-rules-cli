import type { OptionValues } from 'commander';

export interface CliOptions extends OptionValues {
  // Basic Options
  version?: boolean;

  // Output Options
  structure?: boolean;
  overview?: boolean;
  repomix?: boolean;

  // Configuration Options;
  init?: boolean;

  // MCP
  // mcp?: boolean;

  // Other Options
  verbose?: boolean;
  quiet?: boolean;
}
