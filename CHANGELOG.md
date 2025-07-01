# Changelog

All notable changes to this project will be documented in this file.

## [0.2.0] - 2025-06-28

### Added

- `init` command now prompts for awesome rules and allows for selective installation.
- `scan` command to detect vulnerable or malformed rule files along with optional `--sanitize` flag to automatically remove any unsafe unicode characters.
- `commpletion` command to install shell autocompletion support powered by `@pnpm/tabtab` (`cursor-rules completion --install`).

### Changed

- `repomix` command now saves the configuration to `repomix.config.json` in the project root.
- README now features `bun` usage instructions. Other package managers are still supported, but omitted to reduce clutter.

### Fixed

- Miscellaneous documentation clarifications.

---