# cursor-rules
> Made with ❤️ in Cursor IDE, dogfooding `cursor-rules`

A command-line tool for managing AI-assisted guidance in your projects through Cursor IDE rules.

## What are Cursor Rules?

Cursor rules are markdown files with structured metadata that provide AI with instructions on how to interact with your codebase. These rules help the AI understand project structure, coding conventions, and best practices specific to your codebase.

## Installation

### Global Installation

```bash
# Using bun
bun add -g @gabimoncha/cursor-rules
```
```bash
# Using yarn
yarn global add @gabimoncha/cursor-rules
```
```bash
# Using npm
npm install -g @gabimoncha/cursor-rules
```

### Project Installation

```bash
# Using bun
bun add -d @gabimoncha/cursor-rules
```
```bash
# Using yarn
yarn add -D @gabimoncha/cursor-rules
```
```bash
# Using npm
npm install --save-dev @gabimoncha/cursor-rules
```

## Usage

### - init cursor rules
```bash
cursor-rules --init
```

This will:
1. Create a `.cursor/rules` directory in your project
2. Add default rule templates (cursor-rules.md, project-structure.md, task-list.md)
3. Guide you through customizing these templates for your project

### - generate repomix file to be used with AI
```bash
cursor-rules --repomix
```

### Available Commands

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

## Default Rule Templates

The CLI provides three default rule templates:

- **cursor-rules.md**: Guidelines for adding and organizing AI rules in your project
- **project-structure.md**: Overview of your project's structure and organization
- **task-list.md**: Framework for tracking project progress with markdown task lists

## Documentation

For more detailed documentation, visit:
- [Cursor Rules Guide](https://github.com/gabimoncha/cursor-rules-cli/blob/main/docs/CURSOR_RULES_GUIDE.md)
- [CLI Commands](https://github.com/gabimoncha/cursor-rules-cli/blob/main/docs/CLI_COMMANDS.md)
- [Contributing Guide](https://github.com/gabimoncha/cursor-rules-cli/blob/main/docs/CONTRIBUTING.md)

## Acknowledgements

Idea inspired by **[Elie Steinbock](https://x.com/elie2222)** [OSS Cursor rules announcement](https://x.com/elie2222/status/1906985581835419915)

## License

MIT
