# Cursor Rules CLI
> Made with ❤️ in Cursor IDE, dogfooding `cursor-rules`

A command-line tool for managing AI-assisted guidance in your projects through Cursor IDE rules.

<img src="https://github.com/user-attachments/assets/7ace785a-fb5f-4537-963c-68eea490def1" width="80%" height="80%"/>

## What are Cursor Rules?

[YouTube presentation](https://www.youtube.com/watch?v=RphQhNX9xB0)

Cursor rules are markdown files with structured metadata that provide AI with instructions on how to interact with your codebase. These rules enhance the AI's understanding of:

- Project structure and organization
- Coding conventions and patterns
- Task management approaches
- Best practices specific to your codebase

## Features

- 🚀 **Rule Installation**: Easily add Cursor rules to any project
- 📋 **Template Rules**: Includes default rule templates for common use cases
- 💬 **Interactive Setup**: Guided setup process using command-line prompts
- 🔍 **Security Scan**: Detect and fix vulnerable rule files with `scan` command
- ⌨️ **Shell Autocompletion**: One-command tab-completion powered by `tabtab`
- 📊 **Repomix Integration**: Packs repository in a single file for AI analysis
- 📁 **Project Structure**: Creates standardized rule organization

## Installation

```bash
# Global install
bun add -g @gabimoncha/cursor-rules

# Project install
bun add -d @gabimoncha/cursor-rules

# (works with npm, pnpm & yarn too)
```

## Usage

```bash
cursor-rules -v # show version
cursor-rules -h # show help

# start the setup process
cursor-rules init [options]

Options:
  -f, --force      # overwrites already existing rules if filenames match
  -r, --repomix    # packs entire repository in a single file for AI analysis
  -o, --overwrite  # overwrite existing rules

# packs entire repository in a single file for AI analysis
cursor-rules repomix

# scan and check all files in the specified path
cursor-rules scan [options]

Options:
  -p, --path <path>        # path to scan (default: ".")
  -f, --filter <filter>    # filter allowing only directories and files that contain the string (similar to node test)
  -P, --pattern <pattern>  # regex pattern to apply to the scanned files (default: "\.cursorrules|.*\.mdc")
  -s, --sanitize           # (recommended) sanitize the files that are vulnerable

# list all rules
cursor-rules list

# setup shell completion
cursor-rules completion --install

Options:
  -i, --install    # install tab autocompletion
  -u, --uninstall  # uninstall tab autocompletion
```

## Default Rule Templates

The CLI provides three default templates:

- **cursor-rules.md**: Guidelines for adding and organizing AI rules
- **task-list.md**: Framework for tracking project progress with task lists
- **project-structure.md**: Template for documenting project structure
- **use-bun-instead-of-node.md**: Use Bun instead of Node.js, npm, pnpm, or vite

## Awesome Rules Templates

The CLI also provides rules from [awesome-cursorrules](https://github.com/PatrickJS/awesome-cursorrules/tree/7e4db830d65c8951463863dd25cc39b038d34e02/rules-new) repository

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
