# Agent Guidelines

## Overview

Agent-specific guidelines for the `weldable` project, optimized for machine processing.

## File Naming Convention

- `agent_*`: Guidance for autonomous agents

## Guidelines Index

### Agent Guidelines

- [Agent Behaviors](./agent_behaviors.md) - Comprehensive guide to agent behaviors, coupled surfaces, workflows, and structured output standards
- [Agent Config Management](./agent_config_management.md) - Structured process for webpack configurations, standalone templates, CLI options, and exposed packages
- [Agent Testing](./agent_testing.md) - Unit, snapshot, and integration testing procedures
- [Agent Comments](./agent_comments.md) - JSDoc and inline comment standards for `jsdoc-to-markdown` generation
- [Problematic Packages & Configs Manifest](./agent_manifest.md) - Registry for packages, serialization constraints, and configurations requiring special handling

### Skills

- [Review Dependency Integration](./skills/review-dep-integration/SKILL.md) - Review any dependency or dependency group upgrade, check cooldown rules (14d minor/major, 7d patch), map release notes to `weldable` usage across all coupled surfaces, run tests, and write `reports/YYYYMMDD-HHMMSS-{pkg}-{semver}-update-report.md` (UTC)

**Note:** `guidelines/skills/` is the canonical location for skills. Repo symlinks point here so agents can discover them: `.agents/skills` (Cursor / JetBrains), `.claude/skills` (Claude). The `.agent/` directory (no "s") is reserved for each developer's local work and is off limits—do not use it for shared skills or guidelines.

## User Guide

### Available Trigger Phrases

Agents should use these phrases as signals to consult specific documentation and source code:

| Task / Intent | Reference Document |
| :--- | :--- |
| **"review the repo guidelines"** | Scan markdown files and guidelines directory. See [AI agent context](../CONTRIBUTING.md#ai-agent). |
| **"review dep [package-name]"** / **"dep upgrade [package-name]"** / **"dep integration review"** / **"dep update report"** | Follow `guidelines/skills/review-dep-integration/SKILL.md`: cooldown check, release notes vs codebase, tests, report at `reports/YYYYMMDD-HHMMSS-{pkg}-{semver}-update-report.md` (UTC). |
| **"Verify what happens when we update/configure [loader\|plugin\|option]"** | Follow [Agent Behaviors](./agent_behaviors.md#3-trigger-based-workflows) and check [Problematic Packages & Configs Manifest](./agent_manifest.md). |
| **"Add or update config [option/plugin/loader] to support [behavior]"** | Follow the 6-step process in [Agent Config Management](./agent_config_management.md). |
| **"Synchronize standalone and exposed packages"** | Review `src/wpConfigs.js`, `src/standalone.js`, `scripts/generatePackagesLib.js`, `lib/packages.js`, and `DOCS.md` per [Agent Config Management](./agent_config_management.md). |
| **"Test config [module/option]"** | Follow [Agent Testing](./agent_testing.md) for fixture setup, snapshot content verification, and integration checks. |
| **"Update documentation for [module/option/package]"** | Follow [Agent Comments](./agent_comments.md), run `npm run build:docs`, and update `DOCS.md` / `README.md`. |

## Guidelines Processing Order

1. **Guidelines Directory** (all files in the `guidelines/` directory)
2. **Local Guidelines** (`.agent/` directory) — reserved for each user's agent interaction; gitignored and off limits for shared repo assets. Do not create or reference shared skills or guidelines in `.agent/`.

## Maintaining This Directory

### File Maintenance Principles

- Update index files (e.g., `guidelines/README.md`) immediately when adding or removing content
- Reference and index guidelines; do not duplicate content
- Update references when adding new files
- Keep descriptions concise and focused

### Adding New Guidelines

1. Add entry to "Guidelines Index" section
2. Include essential metadata
3. Provide brief description
4. Update processing order if needed

Last updated: November 24, 2026
