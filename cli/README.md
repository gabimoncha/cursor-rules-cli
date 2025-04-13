# cursor-rules
> Made with ❤️ in Cursor IDE, dogfooding `cursor-rules`

A CLI tool for managing AI-assisted guidance in your projects through Cursor IDE rules.

<img src="https://github.com/user-attachments/assets/7ace785a-fb5f-4537-963c-68eea490def1" width="80%" height="80%"/>

## What are Cursor Rules?

Cursor rules are markdown files with structured metadata that provide AI with instructions on how to interact with your codebase. These rules help the AI understand project structure, coding conventions, and best practices.

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

# Audit existing rules
cursor-rules audit

# Display version or help
cursor-rules --version
cursor-rules --help
```

When you initialize cursor rules, the CLI will:
1. Create a `.cursor/rules` directory in your project
2. Add default rule templates
3. Guide you through customization

## Default Rule Templates

- **cursor-rules.md**: Guidelines for adding and organizing AI rules
- **project-structure.md**: Overview of project structure and organization
- **task-list.md**: Framework for tracking project progress

## Awesome Rules Templates

The CLI also provides rules from [awesome-cursorrules](https://github.com/PatrickJS/awesome-cursorrules/tree/7e4db830d65c8951463863dd25cc39b038d34e02/rules-new) repository

## Documentation

For more detailed documentation, visit:
- [Cursor Rules Guide](https://github.com/gabimoncha/cursor-rules-cli/blob/main/docs/CURSOR_RULES_GUIDE.md)
- [CLI Commands](https://github.com/gabimoncha/cursor-rules-cli/blob/main/docs/CLI_COMMANDS.md)
- [Contributing Guide](https://github.com/gabimoncha/cursor-rules-cli/blob/main/docs/CONTRIBUTING.md)

## Acknowledgements

- Idea inspired by **[Elie Steinbock](https://x.com/elie2222)** [OSS Cursor rules announcement](https://x.com/elie2222/status/1906985581835419915)
- Codebase inspired from and using **[repomix](https://github.com/yamadashy/repomix.git)**

## License

MIT
