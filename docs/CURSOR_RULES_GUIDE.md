# Comprehensive Guide to Using Cursor Rules
> Made with ❤️ in Cursor IDE, dogfooding `cursor-rules`

This guide provides detailed information on creating, configuring, and using Cursor rules effectively to enhance AI assistance in your projects.

## Understanding Cursor Rules

Cursor rules are special markdown files that provide contextual information and guidelines to AI assistants in the Cursor IDE, helping them understand your project's structure, conventions, and preferences.

## Rule Locations

- **Project Root**: Global visibility
- **`.cursor/rules/` Directory**: Recommended for organized management

## Rule File Format

```markdown
---
description: typescript-conventions
globs: [**/*.ts]
alwaysApply: boolean
---

# Rule Title

Brief description of what this rule covers

## Content Section 1
Detailed information and instructions...

## Content Section 2
More detailed guidelines...
```

### Metadata Options

- `description`: Tells AI when to use this rule
- `globs`: File pattern this rule applies to (e.g., `**/*.ts`)
- `alwaysApply`: Whether to auto-attach rule to every AI prompt (boolean)

## Creating Effective Rules

1. **Be Specific**
   ```markdown
   ❌ "Follow good coding practices"
   ✅ "Use camelCase for variables and PascalCase for classes"
   ```

2. **Include Examples**
   ```markdown
   ## API Endpoint Format
   Endpoints should follow this pattern:
   - GET /api/v1/resources
   - POST /api/v1/resources
   - GET /api/v1/resources/:id
   ```

3. **Structure Hierarchically**
   ```markdown
   ## Database Models
   ### User Model
   Fields: id, name, email...
   ### Product Model
   Fields: id, name, price...
   ```

4. **Reference Existing Files**
   ```markdown
   @Button.tsx for reference implementation
   ```

## Using Rules with Cursor CLI

```bash
# Basic usage
cursor-rules [command] [options]

# Available commands
init          # Start the setup process
list          # List all rules
repomix       # Generate repository overview

# Global options
-q, --quiet     # Disable all output
-v, --version   # Show version information
--verbose       # Enable verbose logging
--help, -h      # Display help

# init command options
-f, --force     # Overwrite existing rules
-r, --repomix   # Generate repomix output
-o, --overwrite # Overwrite selected rules
```

## Rule Templates

Our CLI provides these default templates:

- **cursor-rules.md**: Meta-guidelines for using and managing rules
- **project-structure.md**: Documents project organization and architecture
- **task-list.md**: Conventions for tracking project tasks


## Troubleshooting

- **Rule Not Applied**: Check location, glob pattern, and format
- **Conflicting Rules**: Review priority settings, make glob patterns more specific, or consolidate rules

## Best Practices

1. Start simple, expand as needed
2. Review and update rules as project evolves
3. Maintain consistency across rules
4. Provide context for preferred patterns
5. Reference official documentation when applicable

## Additional Resources

- [Cursor IDE Rules for AI](https://docs.cursor.com/context/rules-for-ai)
- [GitHub Repository](https://github.com/gabimoncha/cursor-rules-cli)
- [Inbox Zero Rules](https://github.com/elie222/inbox-zero/tree/main/.cursor/rules) 
- [Inbox Zero Rules Video](https://www.youtube.com/watch?v=ABozvKmctkc) 