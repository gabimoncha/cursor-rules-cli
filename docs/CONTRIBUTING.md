# Contributing to Cursor Rules CLI
> Made with ❤️ in Cursor IDE, dogfooding `cursor-rules`

Thank you for your interest in contributing to the Cursor Rules CLI project!

## How to Contribute

1. **Report bugs** with clear steps to reproduce, expected behavior, and environment info
2. **Suggest enhancements** with detailed descriptions and possible implementations
3. **Improve documentation** by fixing errors or adding missing information
4. **Submit code changes** via pull requests
5. **Write tests** for new features or bug fixes
6. **Review pull requests** from other contributors

## Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/cursor-rules-cli.git
cd cursor-rules-cli

# Install dependencies
bun install

# Build the project
bun prepare
```

## Project Structure

```
.
├── cli/                     # Main CLI implementation 
│   ├── bin/                   # CLI executables
│   ├── src/                   # Source code
│   │   ├── cli/                 # CLI components
│   │   ├── core/                # Business logic
│   │   ├── shared/              # Utilities, constants
│   │   ├── templates/           # Rule templates
│   │   ├── index.ts             # Entry point
├── docs/                    # Documentation
├── example/                 # Example project
```

See [project-structure.mdc](../.cursor/rules/project-structure.mdc) for detailed overview.

## Pull Request Guidelines

- Reference related issues
- Include clear title and description
- Follow project code style
- Include tests for changes
- Update documentation if needed

## Testing (WIP)

```bash
# Run all tests
bun test

# Run specific tests
bun test -- -t "test name"
```

## Getting Help

- Ask in the GitHub issue you're working on
- Reach out to maintainers via [X](https://x.com/gabimoncha)

Thank you for helping improve Cursor Rules CLI! 