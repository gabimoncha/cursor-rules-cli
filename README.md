# Cursor Rules CLI (Made with AI, dogfooding `cursor-rules`)

A command-line tool for managing AI-assisted guidance in your projects through Cursor IDE rules.

## What are Cursor Rules?

Cursor rules are markdown files with structured metadata that provide AI with instructions on how to interact with your codebase. These rules help the AI understand:

- Project structure and organization
- Coding conventions and patterns
- Task management approaches
- Best practices specific to your codebase

By adding Cursor rules to your project, you enhance the AI's capability to provide more relevant and context-aware assistance.

## Features

- 🚀 **Rule Installation**: Easily add Cursor rules to any project
- 📋 **Template Rules**: Includes default rule templates for common use cases
- 💬 **Interactive Setup**: Guided setup process using command-line prompts
- 📊 **Repomix Integration**: Generate repository overviews using Repomix for AI analysis
- 📁 **Project Structure**: Creates standardized rule organization within projects

## Installation

### Global Installation

```bash
# Using bun
bun add -g @gabimoncha/cursor-rules

# Using yarn
yarn global add @gabimoncha/cursor-rules

# Using npm
npm install -g @gabimoncha/cursor-rules
```

### Project Installation

```bash
# Using bun
bun add -d @gabimoncha/cursor-rules

# Using yarn
yarn add -D @gabimoncha/cursor-rules

# Using npm
npm install --save-dev @gabimoncha/cursor-rules
```

## Usage

### Initialize Cursor Rules

Add default Cursor rules to your project:

```bash
cursor-rules --init
```

This will:
1. Create a `.cursor/rules` directory in your project
2. Add default rule templates (cursor-rules.md, project-structure.md, task-list.md)
3. Guide you through customizing these templates for your project

### Generate Repository Overview

Create a Repomix XML file for enhanced AI understanding of your codebase:

```bash
cursor-rules --repomix
```

### Available Commands

```bash
# Show help information
cursor-rules --help

# Display the current version
cursor-rules --version

# Initialize with specific templates only
cursor-rules --init --templates cursor-rules,project-structure

# Generate repomix with custom config file
cursor-rules --repomix --config ./my-repomix-config.json
```

## Default Rule Templates

The CLI provides three default rule templates:

### 1. cursor-rules.md
Guidelines for adding and organizing AI rules in your project.

### 2. project-structure.md
Overview of your project's structure, organization, and key components.

### 3. task-list.md
Framework for tracking project progress with markdown task lists.

## How Cursor Rules Work

When you create Cursor rules in your project:

1. The Cursor IDE detects these rules in the `.cursor/rules` directory or at the project root
2. The AI assistant reads these rules to understand project context
3. When you ask questions or request assistance, the AI follows the guidelines in your rules
4. This results in more contextually appropriate and project-aware responses

## Development

To contribute to this project:

```bash
# Clone the repository
git clone https://github.com/gabimoncha/cursor-rules-cli.git
cd cursor-rules-cli

# Install dependencies
bun install

# Run tests
bun test
```

## License

MIT

## Acknowledgements

- Idea inspired by **[Elie Steinbock](https://x.com/elie2222)** [OSS Cursor rules announcement](https://x.com/elie2222/status/1906985581835419915)
- Codebase inspired from **[repomix](https://github.com/yamadashy/repomix.git)**
