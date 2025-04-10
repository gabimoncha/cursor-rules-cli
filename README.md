# Cursor Rules CLI
> Made with ❤️ in Cursor IDE, dogfooding `cursor-rules`

A command-line tool for managing AI-assisted guidance in your projects through Cursor IDE rules.

<img src="https://github.com/user-attachments/assets/7ace785a-fb5f-4537-963c-68eea490def1" width="80%" height="80%"/>

## What are Cursor Rules?

Cursor rules are markdown files with structured metadata that provide AI with instructions on how to interact with your codebase. These rules enhance the AI's understanding of:

- Project structure and organization
- Coding conventions and patterns
- Task management approaches
- Best practices specific to your codebase

## Features

- 🚀 **Rule Installation**: Easily add Cursor rules to any project
- 📋 **Template Rules**: Includes default rule templates for common use cases
- 💬 **Interactive Setup**: Guided setup process using command-line prompts
- 📊 **Repomix Integration**: Generate repository overviews using Repomix for AI analysis
- 📁 **Project Structure**: Creates standardized rule organization

## Installation

```bash
# Global install

# bun
bun add -g @gabimoncha/cursor-rules

# yarn
yarn global add @gabimoncha/cursor-rules

# npm
npm install -g @gabimoncha/cursor-rules

# Project install

# bun
bun add -d @gabimoncha/cursor-rules

# yarn
yarn add -D @gabimoncha/cursor-rules

# npm
npm install --save-dev @gabimoncha/cursor-rules
```

## Usage

```bash
# Initialize cursor rules
cursor-rules init

# Generate repomix file
cursor-rules repomix

# Initialize and generate repomix
cursor-rules init -r

# Force overwrite existing rules
cursor-rules init -f

# List existing rules
cursor-rules list

# Display version or help
cursor-rules --version
cursor-rules --help
```

## Default Rule Templates

The CLI provides three default templates:

- **cursor-rules.md**: Guidelines for adding and organizing AI rules
- **task-list.md**: Framework for tracking project progress with task lists
- **project-structure.md**: Template for documenting project structure

## How Cursor Rules Work

1. Cursor IDE detects rules in `.cursor/rules` directory or project root
2. AI assistant reads these rules to understand project context
3. When requesting assistance, AI follows guidelines in your rules
4. Results in more contextually appropriate and project-aware responses

## Documentation

For more detailed documentation, visit:
- [Cursor Rules Guide](https://github.com/gabimoncha/cursor-rules-cli/blob/main/docs/CURSOR_RULES_GUIDE.md)
- [CLI Commands](https://github.com/gabimoncha/cursor-rules-cli/blob/main/docs/CLI_COMMANDS.md)
- [Contributing Guide](https://github.com/gabimoncha/cursor-rules-cli/blob/main/docs/CONTRIBUTING.md)

## Development

```bash
# Clone the repository
git clone https://github.com/gabimoncha/cursor-rules-cli.git
cd cursor-rules-cli

# Install dependencies
bun install

# Run the CLI locally
bun --cwd cli prepare
bun --cwd cli prompt
```

## License

MIT

## Acknowledgements

- Idea inspired by **[Elie Steinbock](https://x.com/elie2222)** [OSS Cursor rules announcement](https://x.com/elie2222/status/1906985581835419915)
- Codebase inspired from and using **[repomix](https://github.com/yamadashy/repomix.git)**
