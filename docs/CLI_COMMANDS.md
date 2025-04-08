# Cursor Rules CLI Commands (Made with AI, dogfooding `cursor-rules`)

This document provides a comprehensive reference for all commands and options available in the Cursor Rules CLI.

## Command Overview

The Cursor Rules CLI provides several commands for managing rule files in your projects:

```
cursor-rules [options] [command]
```

## Global Options

| Option | Description |
|--------|-------------|
| `--version`, `-V` | Display the version number |
| `--help`, `-h` | Display help information |

## Commands

### Initialize Rules

```bash
cursor-rules --init [options]
```

Initializes Cursor rules in your project.

#### Options

| Option | Description |
|--------|-------------|
| `--templates <names>` | Comma-separated list of rule templates to install (default: all templates) |
| `--force` | Overwrite existing rules |
| `--no-interactive` | Skip interactive prompts |

#### Examples

```bash
# Initialize all default templates
cursor-rules --init

# Initialize only specific templates
cursor-rules --init --templates cursor-rules,project-structure

# Initialize rules with no prompts, overwriting existing files
cursor-rules --init --no-interactive --force
```

### Generate Repomix

```bash
cursor-rules --repomix [options]
```

Generates a Repomix XML file with repository overview for enhanced AI context.

#### Options

| Option | Description |
|--------|-------------|
| `--config <path>` | Path to custom Repomix config file |
| `--output <path>` | Output path for the generated XML file (default: `repomix-output.xml`) |

#### Examples

```bash
# Generate repomix with default settings
cursor-rules --repomix

# Generate repomix with custom config
cursor-rules --repomix --config ./custom-repomix.json

# Generate repomix with custom output path
cursor-rules --repomix --output ./docs/repo-structure.xml
```

### Create Custom Rule

```bash
cursor-rules --create <rule-name> [options]
```

Creates a new custom rule file.

#### Options

| Option | Description |
|--------|-------------|
| `--template <name>` | Base template to use (default: blank) |
| `--glob <pattern>` | File glob pattern for the rule |
| `--priority <level>` | Priority level (high, medium, low) |

#### Examples

```bash
# Create a basic rule
cursor-rules --create typescript-conventions

# Create a rule with specific options
cursor-rules --create react-components --template component --glob "**/*.tsx" --priority high
```

### List Rules

```bash
cursor-rules --list [options]
```

Lists all installed Cursor rules in the project.

#### Options

| Option | Description |
|--------|-------------|
| `--format <fmt>` | Output format (table, json, list) |

#### Examples

```bash
# List all rules in default directory
cursor-rules --list
```

### Validate Rules

```bash
cursor-rules --validate [options]
```

Validates all rules for proper formatting and metadata.

#### Options

| Option | Description |
|--------|-------------|
| `--fix` | Attempt to fix issues automatically |

#### Examples

```bash
# Validate all rules
cursor-rules --validate

# Validate and fix rules
cursor-rules --validate --fix
```

## Environment Variables

The CLI respects the following environment variables:

| Variable | Description |
|----------|-------------|
| `CURSOR_RULES_CONFIG` | Path to configuration file |
| `CURSOR_RULES_NO_COLOR` | Disable colored output if set |

## Exit Codes

| Code | Description |
|------|-------------|
| 0 | Success |
| 1 | General error |
| 2 | Invalid arguments |
| 3 | File operation error |
| 4 | Validation error | 