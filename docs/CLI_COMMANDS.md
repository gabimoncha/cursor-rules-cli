# Cursor Rules CLI Commands 
> Made with ❤️ in Cursor IDE, dogfooding `cursor-rules`

A reference for all commands and options available in the Cursor Rules CLI.

## Commands

| Command | Description |
|---------|-------------|
| `init` | Start the setup process |
| `list` | List all rules |
| `repomix` | Generate repomix output with recommended settings |

## Global Options

| Option | Description |
|--------|-------------|
| `-q, --quiet` | Disable all output to stdout |
| `-v, --version` | Show version information |
| `--verbose` | Enable verbose logging for detailed output |
| `--help`, `-h` | Display help information |

## Command Options

### init

| Option | Description |
|--------|-------------|
| `-f, --force` | Overwrites already existing rules if filenames match |
| `-r, --repomix` | Generate repomix output with recommended settings |
| `-o, --overwrite` | Overwrite existing rules |

## Usage Examples

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

# Show version information
cursor-rules -v
```

## Exit Codes

| Code | Description |
|------|-------------|
| 0 | Success |
| 1 | General error |