# Cursor Rules CLI Commands 
> Made with ❤️ in Cursor IDE, dogfooding `cursor-rules`

This document provides a comprehensive reference for all commands and options available in the Cursor Rules CLI.

## Command Overview

The Cursor Rules CLI provides several commands for managing rule files in your projects:

```
cursor-rules [options]
```

## Global Options

| Option | Description |
|--------|-------------|
| `--force`, `-f` | Overwrites existing rules |
| `--init` | Initializes Cursor rules in your project |
| `--repomix` | Bundles code into an XML file, with recommended config |
| `--list` | Lists project rules |
| `--version`, `-V` | Display the version number |
| `--verbose` | Shows more detailed output |
| `--quiet` | Reduces output to essential information only |
| `--help`, `-h` | Display help information |

## Command Examples

```bash
# Start CLI app
cursor-rules --init
```
```bash
# Generate repomix with custom config file
cursor-rules --repomix
```
```bash
# Start CLI and confirm repomix
cursor-rules --init --repomix
```
```bash
# Force overwrite existing rules
cursor-rules --force
```
```bash
# List existing rules
cursor-rules --list
```
```bash
# Display the current version
cursor-rules --version
```
```bash
# Show help information
cursor-rules --help
```

## Exit Codes

| Code | Description |
|------|-------------|
| 0 | Success |
| 1 | General error |