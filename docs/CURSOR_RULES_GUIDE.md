# Comprehensive Guide to Using Cursor Rules (Made with AI, dogfooding `cursor-rules`)

This guide provides detailed information on how to create, configure, and use Cursor rules effectively to enhance AI assistance in your projects.

## Understanding Cursor Rules

Cursor rules are special markdown files that provide contextual information and guidelines to AI assistants in the Cursor IDE. They help the AI understand your project's structure, conventions, and preferences, leading to more accurate and helpful assistance.

## Rule Locations

Cursor rules can be placed in two locations:

1. **Project Root**: Place rules at your project's root directory for global visibility
2. **`.cursor/rules/` Directory**: Place rules in this directory for organized rule management

## Rule File Format

A typical Cursor rule follows this format:

```markdown
---
description: typescript-conventions
globs: **/*.ts
alwaysApply: boolean
---

# Rule Title

Brief description of what this rule covers

## Content Section 1

Detailed information and instructions...

## Content Section 2

More detailed guidelines...
```

### Key Components

- **Metadata**: Configuration parameters enclosed in `---` tags at the top of the file
- **Title**: Clear, descriptive title of the rule
- **Description**: Brief explanation of the rule's purpose
- **Content Sections**: Detailed information organized in sections

### Metadata Options

- `description`: Tells AI Agent when to use this rule
- `globs`: File pattern this rule applies to (e.g., `**/*.ts`)
- `alwaysApply`: Auto-attach rule to every AI prompt or let Agent choose when (boolean)

## Creating Effective Rules

### 1. Be Specific

Write clear, specific guidelines rather than general statements:

```markdown
❌ "Follow good coding practices"
✅ "Use camelCase for variable names and PascalCase for class names"
```

### 2. Include Examples

Provide examples that demonstrate the correct approach:

```markdown
## API Endpoint Format

Endpoints should follow this pattern:
- GET /api/v1/resources
- POST /api/v1/resources
- GET /api/v1/resources/:id
```

### 3. Structure Hierarchically

Organize information in a logical hierarchy using markdown headings:

```markdown
## Database Models
### User Model
Fields: id, name, email...
### Product Model
Fields: id, name, price...
```

### 4. Reference Existing Files

Point to example files in your codebase:

```markdown
[Button.tsx](md:/path/to/Button.tsx) for reference implementation
```

## Using Rules with Cursor CLI

### Command Options

```bash
# Basic usage
cursor-rules [options]

# Available options
--init          # Initialize Cursor rules in your project
--repomix       # Generate repository overview XML file
--list          # List all project rules
--force, -f     # Overwrite existing rules
--version, -V   # Display version number
--verbose       # Show detailed output
--quiet         # Reduce output to essentials
--help, -h      # Display help information
```

### Adding Rules with the CLI

```bash
# Initialize default rules
cursor-rules --init

# Force overwrite of existing rules
cursor-rules --force
```

### Customizing Rules

After initialization, edit the generated rule files to customize them for your project:

1. Open the rule files in your preferred editor
2. Update the metadata section with appropriate values
3. Modify the content to reflect your project's specifics
4. Save the files

## Rule Templates

Our CLI provides these default templates:

### cursor-rules.md

Provides meta-guidelines on how to use and manage Cursor rules in your project.

### project-structure.md

Documents your project's organization, architecture, and important directories.

### task-list.md

Establishes conventions for tracking project tasks using markdown checklists.

## Advanced Usage

### Combining with Repomix

Generate a comprehensive overview of your repository structure:

```bash
cursor-rules --repomix
```

This creates an XML representation of your codebase that AI can use to understand your project better.

### Creating Custom Rule Templates

To create your own rule templates:

1. Create a markdown file with your rule content
2. Add appropriate metadata
3. Place it in `.cursor/rules/templates/`

### Rule Precedence

When multiple rules apply to the same files:
1. Rules with higher priority take precedence
2. More specific glob patterns take precedence over general ones
3. Rules in `.cursor/rules/` take precedence over rules in the project root

## Troubleshooting

### Rule Not Being Applied

- Check that the file is in the correct location
- Verify that the glob pattern matches the files you're working with
- Ensure the rule file has the correct format and metadata

### Conflicting Rules

If you have conflicting rules:
- Review the priority settings of conflicting rules
- Make glob patterns more specific to avoid overlap
- Consider consolidating related rules into a single rule

## Best Practices

1. **Start Simple**: Begin with basic rules and expand as needed
2. **Review Regularly**: Update rules as your project evolves
3. **Be Consistent**: Maintain consistency across all rules
4. **Include Context**: Provide context for why certain patterns are preferred
5. **Reference Documentation**: Link to official documentation when applicable

## Additional Resources

- [Cursor IDE Rules for AI](https://docs.cursor.com/context/rules-for-ai)
- [GitHub Repository](https://github.com/gabimoncha/cursor-rules-cli)
- [Inbox Zero Rules](https://github.com/elie222/inbox-zero/tree/main/.cursor/rules) 
- [Inbox Zero Rules Video](https://www.youtube.com/watch?v=ABozvKmctkc) 