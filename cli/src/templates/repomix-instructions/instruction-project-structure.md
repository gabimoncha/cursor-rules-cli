This file contains the entire codebase of library. Create or edit the current `.cursor/rules/project-structure.mdc` rules, to include the project's main purpose, key features, directory structure and overall architecture. Use `directory_structure` from this file, to create a formatted tree structure of the project, with a short description for each folder.

Example PROJECT_STRUCTURE.md output:

```markdown
---
description: Project structure and file organization guidelines
globs: 
alwaysApply: false
---
# Project name

Short description of the project

## Purpose

The purpose of the project

## Key features

- Feature 1: do something
- Feature 2: do something else

## Directory structure

```tree
.
├── parent_folder/             # this is the parent_folder description
│   ├── child_folder/             # this is the child_folder description
│   │   ├──   file1.md                # this is the file1.md description
│   │   └──   file2.md                # this is the file2.md description
│   └── other_child_folder/       # this is the other_child_folder description
│       ├──   file3.md                # this is the file3.md description
│       └──   file4.md                # this is the file4.md description
└── single_folder/             # this is the single folder description
```

## Architecture

The flow diagram of the project and its logic

## Usage

Run command 

## Technical implementation

The project is built with:
- TypeScript: for type-safe code

## Future Enhancements

- Add support for feature 3
- Enhance feature 2

```

After editing the file, tell the user he might need to refresh the Explorer or restart Cursor to see the applied changes.