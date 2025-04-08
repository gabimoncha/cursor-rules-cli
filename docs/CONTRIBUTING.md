# Contributing to Cursor Rules CLI
> Made with ❤️ in Cursor IDE, dogfooding `cursor-rules`

Thank you for your interest in contributing to the Cursor Rules CLI project! This document provides guidelines and instructions for contributing to the project.

## Code of Conduct

Please read and follow our [Code of Conduct](CODE_OF_CONDUCT.md). We expect all contributors to adhere to these guidelines to create a positive and respectful community.

## How to Contribute

There are many ways to contribute to the Cursor Rules CLI project:

1. Reporting bugs
2. Suggesting enhancements
3. Improving documentation
4. Submitting code changes
5. Writing tests
6. Reviewing pull requests

### Reporting Bugs

If you encounter a bug while using Cursor Rules CLI, please report it by creating an issue on our [GitHub repository](https://github.com/gabimoncha/cursor-rules-cli/issues). When reporting a bug, please include:

- A clear and descriptive title
- Steps to reproduce the bug
- Expected behavior
- Actual behavior
- Any relevant screenshots or error messages
- Your environment (OS, Node.js version, etc.)

### Suggesting Enhancements

To suggest an enhancement, please create an issue on our [GitHub repository](https://github.com/gabimoncha/cursor-rules-cli/issues) with the "enhancement" label. When suggesting an enhancement, please include:

- A clear and descriptive title
- A detailed description of the proposed enhancement
- Why this enhancement would be useful
- Possible implementations or approaches

### Improving Documentation

Documentation improvements are always welcome! You can contribute to documentation by:

- Fixing typos or grammatical errors
- Adding missing information
- Improving clarity or organization
- Translating documentation to other languages

To contribute to documentation, please submit a pull request with your changes.

### Submitting Code Changes

To submit code changes, please follow these steps:

1. Fork the repository
2. Create a new branch for your changes
3. Make your changes
4. Run tests to ensure your changes don't break existing functionality
5. Submit a pull request

#### Pull Request Guidelines

When submitting a pull request, please:

- Reference any related issues
- Include a clear and descriptive title
- Provide a detailed description of the changes
- Follow the code style of the project
- Include tests for your changes
- Update documentation if necessary

### Development Setup

To set up the project for development:

```bash
# Clone your fork of the repository
git clone https://github.com/YOUR_USERNAME/cursor-rules-cli.git
cd cursor-rules-cli

# Install dependencies
bun install

# Build the project
bun prepare
```

#### Project Structure

The project follows this structure:

```
.
├── cli/                     # Main CLI implementation package
│   ├── bin/                   # CLI executable scripts
│   ├── src/                   # Source code
│   │   ├── cli/                 # CLI implementation components
│   │   │   ├── actions/           # Command action handlers
│   │   │   ├── cliRun.ts          # CLI runner functionality
│   │   │   ├── types.ts           # CLI type definitions
│   │   ├── core/                # Core business logic
│   │   ├── shared/              # Shared utilities and constants
│   │   ├── templates/           # Rule templates
│   │   ├── index.ts             # Main entry point
├── docs/                    # Documentation
├── example/                 # Example project for testing
```

Please see the [project structure documentation](../.cursor/rules/project-structure.mdc) for a more detailed overview of the project's organization.

### Testing (WIP)

Please write tests for any new code you contribute. We use Jest for testing:

```bash
# Run all tests
bun test

# Run specific tests
bun test -- -t "test name"
```

## Release Process (WIP)

Our release process follows these steps:

1. We gather and prioritize changes for the next release
2. We create a release branch
3. We perform final testing and validation
4. We publish the new version to npm
5. We create a GitHub release with release notes

## Getting Help

If you have questions or need help with your contributions, please:

- Ask in the GitHub issue you're working on
- Reach out to maintainers via email or [X](https://x.com/gabimoncha)

## Thank You

Your contributions are what make the open-source community great. Thank you for taking the time to help improve Cursor Rules CLI! 