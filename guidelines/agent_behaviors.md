# Agent Behaviors

## Overview

Comprehensive guide to agent behaviors, coupled architecture surfaces, workflows, and structured output standards for `weldable`.

## For Agents

### Processing Priority

Critical - Process first when working with the repository.

### Related Guidelines

See the [Guidelines Index](./README.md#guidelines-index) for all guidelines.

### Key Concepts

- Repository context and coupled surfaces
- Core behavior standards
- Trigger-based workflows
- Decision-making principles
- Structured output templates

## 1. Repository Context

`weldable` provides:
- **Default Webpack Configurations**: Minimal-preference `development` and `production` webpack builds (`src/wpConfigs.js`, `src/wp.js`)
- **Preprocess Loaders & Presets**: Built-in support for JS (`babel-loader`), TypeScript (`ts-loader` + `@tsconfig/*`), and `none` (`src/wpConfigs.js`, `src/ts.js`)
- **Cascading Dotenv Support**: Environment variable loading and `dotenv-webpack` integration (`src/dotenv.js`)
- **Standalone Code Generation**: Eject-free `--standalone` generator that outputs `webpack.config.js`, `babel.config.js`, `tsconfig.json`, and updates `package.json` (`src/standalone.js`)
- **Exposed Packages Library**: CommonJS re-exports (`require` and `require.resolve`) of build dependencies (`lib/packages.js`, `lib/packagesLicenses.txt`)

**Core Directories**:
- `bin/`: CLI entry point (`bin/cli.js`)
- `src/`: Core configuration modules and unit tests (`src/__tests__/`)
- `lib/`: Entry point (`lib/index.js`) and generated package/license exports (`lib/packages.js`, `lib/packagesLicenses.txt`)
- `scripts/`: Build and CI helper scripts (`generatePackagesLib.js`, `readme.docs.js`, `actions.coverage.js`)
- `tests/`: Integration and code-hygiene tests (`tests/cli.test.js`, `tests/code.test.js`)
- `__fixtures__/`: Checked-in test fixtures
- `guidelines/`: Agent guidelines and skills
- `.agent/`: Local agent state (gitignored)
- `reports/`: Dependency research reports (gitignored)

### The 4 Coupled Surfaces (Mandatory Synchronization)

Whenever modifying webpack configurations, loaders, plugins, or dependencies, agents **must** evaluate all four coupled surfaces:

1. **Core Webpack & Tooling Modules** (`src/wpConfigs.js`, `src/wp.js`, `src/dotenv.js`, `src/ts.js`, `src/global.js`)
2. **Standalone Generator** (`src/standalone.js`):
   - `outputStandaloneWebpackConfig` serializes functions from `src/wpConfigs.js` and `src/dotenv.js` directly into `webpack.config.js` via `.toString()`.
   - `createStandalonePackageJson` maintains explicit arrays (`webpackResources`, `preprocessLoaderResources`, `baseConfigResources`) of packages installed in standalone projects.
3. **Exposed Packages & Test Mocks** (`scripts/generatePackagesLib.js` -> `lib/packages.js`, `lib/packagesLicenses.txt`, `jest.setupTests.js`, `DOCS.md`)
4. **CLI & Generated Docs** (`bin/cli.js`, `README.md`, `DOCS.md`, `src/README.md` via `npm run build:docs`)

## 2. Core Behavior Standards

- **Sequential Processing**: Ask questions one at a time; process requests in logical order; complete one task before starting another
- **Reference-Based Implementation**: Review git history (`git log`); study existing dependency injection and default parameter patterns (`alias*` conventions in `src/*.js`); maintain CommonJS code style consistency
- **Validation Required**: Follow checklists; verify coupled surfaces; run both unit (`npm test`) and integration (`npm run test:integration`) suites; verify CI scripts (`npm run build:packages-lib`, `npm run build:docs`)
- **Confirmation Required**: Confirm success; summarize changes using structured output templates; explain snapshot diffs before updating
- **State Management**: Use `.agent/` directory for local state; write dependency upgrade reports to `reports/`; preserve session information

## 3. Trigger-Based Workflows

### Trigger: "Verify what happens when we update/configure [loader|plugin|option]"

1. **Research**
   - Check the [Problematic Packages & Configs Manifest](./agent_manifest.md) for existing constraints
   - Check upstream webpack/loader/plugin documentation
   - Inspect coupled surfaces (`src/wpConfigs.js`, `src/standalone.js`, `lib/packages.js`, `jest.setupTests.js`)

2. **Analysis**
   - Inspect or create a test case in `src/__tests__/`
   - Run `npm test` and `npm run test:integration`
   - Analyze configuration output and snapshot diffs

3. **Report**
   - Summarize behavior using the **Structured Verification Output Template** (Section 7)
   - Highlight coupled surface impacts (`standalone.js`, `lib/packages.js`, snapshots)
   - Provide recommendations

### Trigger: "Add or update config [option/plugin/loader] to support [behavior]"

1. **Research**
   - Check the [Problematic Packages & Configs Manifest](./agent_manifest.md)
   - Verify how the option/plugin/loader interacts with `common`, `development`, `production`, and `preprocessLoader*` in `src/wpConfigs.js`

2. **Implement**
   - Update the target module in `src/` following the `alias*` dependency-injection parameter pattern
   - Synchronize `src/standalone.js` (`outputStandaloneWebpackConfig` and/or `createStandalonePackageJson`) if applicable
   - Update `jest.setupTests.js` if a new `lib/packages` loader resolution is imported

3. **Test**
   - Add/update unit tests in `src/__tests__/` and integration tests in `tests/`
   - Verify snapshot changes before running `npx jest -u`

4. **Document & Build Artifacts**
   - Update JSDoc comments and run `npm run build:docs` (`src/README.md`)
   - Run `npm run build:packages-lib` if dependencies changed
   - Update `DOCS.md` and `README.md` if user-facing behavior or exposed packages changed

5. **Validate**
   - Run `npm test` and `npm run test:integration`
   - Present the **Structured Implementation Output Template** (Section 7)

### Trigger: "review dep [package-name]" / "dep upgrade [package-name]"

1. Follow the [Review Dependency Integration Skill](./skills/review-dep-integration/SKILL.md)
2. Enforce the repository cooldown policy (**14 days** for minor/major updates, **7 days** for patch updates)
3. Generate the dated report in `reports/YYYYMMDD-HHMMSS-{pkg}-{semver}-update-report.md` (UTC)

## 4. Decision-Making Guidelines

1. **Minimal Preferences vs. Extensibility**
   - `weldable` intentionally avoids framework-specific opinions in core configs when `--extend` (`-x`) can be used
   - Favor keeping core configs minimal while exposing packages via `lib/packages.js`

2. **Consistency vs. Improvement**
   - Favor consistency with existing `src/*.js` patterns (CommonJS `require`/`module.exports`, `OPTIONS` defaults, `alias*` injected settings, `consoleMessage` logger)
   - Never use raw `console.log`, `console.warn`, `console.info`, or `console.error` in `src/*.js` (enforced by `tests/code.test.js`)

3. **Backward Compatibility**
   - Minimize breaking changes in patch/minor releases
   - Group non-breaking dependency updates into small domain-related batches (`webpack`, `styles`, `babel/cli`, `typescript`, `dev`)

## 5. Validation Procedures

For all workflows:

1. **Unit, Lint & Spell Check**: `npm test` (runs `test:lint`, `test:spell`, `test:spell-docs`, and `test:ci` with coverage thresholds)
2. **Integration & Console Hygiene Check**: `npm run test:integration` (runs `tests/cli.test.js` and `tests/code.test.js`)
3. **Generated Artifacts Check**:
   - `npm run build:packages-lib` -> verify `git status` on `lib/packages.js` and `lib/packagesLicenses.txt` (enforced by `.github/workflows/packages_lint.yml`)
   - `npm run build:docs` -> verify `git status` on `src/README.md` (enforced by `.github/workflows/documentation_lint.yml`)

## 6. Guidance Authoring Principles

1. **Clarity**: Be specific and unambiguous about which files and functions are affected
2. **Hierarchy**: Use clear section organization
3. **Context**: Provide rationale for architectural constraints (e.g., why `src/standalone.js` uses `.toString()`)
4. **Machine-Actionable**: Structure checklists and templates for deterministic agent execution

## 7. Structured Output Templates

When completing a configuration change, dependency batch, or verification task, agents **must** structure their final response using the appropriate template below.

### Template A: Configuration / Feature Implementation Summary

```markdown
### [Feature / Config] Implementation Summary

#### 1. Configuration Changes
- **Target Module(s)**: `src/[file].js` (`[functionName]`)
- **Purpose**: [Concise explanation of what changed and why]

#### 2. Coupled Surface Synchronization
| Surface | File(s) | Impact / Action Taken |
| :--- | :--- | :--- |
| **Core Config** | `src/wpConfigs.js` / `src/dotenv.js` / `src/ts.js` | [Updated / No change] |
| **Standalone Output** | `src/standalone.js` | [Updated `outputStandaloneWebpackConfig` / `createStandalonePackageJson` / No change] |
| **Exposed Packages** | `lib/packages.js`, `lib/packagesLicenses.txt` | [Regenerated via `npm run build:packages-lib` / No change] |
| **Test Mocks** | `jest.setupTests.js` | [Added mock / No change] |
| **Docs & CLI** | `bin/cli.js`, `DOCS.md`, `README.md`, `src/README.md` | [Updated / Regenerated via `npm run build:docs` / No change] |

#### 3. Verification & Snapshot Review
- **Unit & Coverage (`npm test`)**: [Pass/Fail + coverage summary]
- **Integration (`npm run test:integration`)**: [Pass/Fail]
- **Snapshot Diffs**: [None / Verified intentional changes in `src/__tests__/__snapshots__/*.snap`]

#### 4. Suggested Commit Message
```text
<type>(<scope>): <concise subject under 65 chars>

* <bulleted detail of changes>
```
```

### Template B: Dependency Batch Commit Summary

When reviewing or preparing a dependency batch commit, provide both the **Dependabot Group Style** and **Concise Manual Style** commit messages:

```markdown
### Commit Review (`<short-sha>`)

* **Files Changed**: `package.json`, `package-lock.json`
* **Cooldown Check (14d minor/major, 7d patch)**:
  * `<pkg>`: `<from>` -> `<to>` (`semver-<type>`, published `<N>` days ago)

---

### Git Commit Message (Subject & Body)

#### Subject
```text
build(deps): bump <group> group with <N> <domain> updates
```

#### Option 1: Dependabot Group Style
[Full Dependabot-formatted markdown with release notes/changelog/commits links and `updated-dependencies:` YAML footer]

#### Option 2: Concise Manual Style
```text
* <pkg>, from <from> to <to>
```
```

## Date and Time Management

Run `$ date -u` (or `$ date`) to get the system date before applying timestamps. Used for:
- Naming reports in `reports/YYYYMMDD-HHMMSS-{pkg}-{semver}-update-report.md` (UTC)
- Evaluating the 14-day minor/major and 7-day patch dependency cooldown windows
- Updating `Last updated:` footers in `guidelines/*.md`

## References

- [Guidelines Index](./README.md#guidelines-index)
- [Webpack Documentation](https://webpack.js.org/configuration/)

Last updated: November 24, 2026
