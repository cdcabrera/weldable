# Agent Config Management

## Overview

This document provides agent guidelines for identifying, implementing, synchronizing, and testing webpack configuration, CLI option, preset, and package changes in `weldable`.

## For Agents

### Processing Priority

High - Process this document whenever modifying `src/*.js`, `bin/cli.js`, `scripts/generatePackagesLib.js`, or `package.json` dependencies.

### Related Guidelines

See the [Guidelines Index](./README.md#guidelines-index) for a complete list of all guidelines.

### Key Concepts

- 6-step configuration & package change process
- Dependency injection (`alias*`) pattern in `src/*.js`
- Standalone serialization synchronization (`src/standalone.js`)
- Engine-aware and `@tsconfig/*` preset synchronization
- Exposed package generation (`scripts/generatePackagesLib.js`)

## Config & Package Change Process Overview

The process for changing webpack configurations, loaders, presets, or exposed packages involves six steps:

1. **Identify** the configuration, loader, plugin, preset, or dependency requirement
2. **Research** constraints in [Problematic Packages & Configs Manifest](./agent_manifest.md) and upstream docs
3. **Implement** the change across the target module and all coupled surfaces
4. **Test** the change with unit fixtures, snapshot verification, and integration tests
5. **Document** the change in JSDoc (`npm run build:docs`), `DOCS.md`, and `README.md`
6. **Submit** the changes using the structured output summary in [Agent Behaviors](./agent_behaviors.md#7-structured-output-templates)

## Step 1: Research & Coupled Surface Audit

Before modifying any file in `src/` or `bin/`:

1. Check the [Problematic Packages & Configs Manifest](./agent_manifest.md) for serialization rules, Jest mock requirements, and logger restrictions.
2. Identify which of the 4 coupled surfaces are affected:
   - **Webpack Configs** (`src/wpConfigs.js`, `src/wp.js`)
   - **Dotenv Handling** (`src/dotenv.js`)
   - **TypeScript Presets** (`src/ts.js`, `bin/cli.js`)
   - **Standalone Output** (`src/standalone.js`)
   - **Exposed Packages** (`scripts/generatePackagesLib.js`, `lib/packages.js`, `lib/packagesLicenses.txt`, `jest.setupTests.js`, `DOCS.md`)

## Step 2: Implementing Changes Across Coupled Surfaces

### 1. Follow the Dependency-Injected `alias*` Pattern

All functions in `src/*.js` use a two-parameter signature `(optionsOrDotenv = OPTIONS..., settings = {})` where external dependencies (`consoleMessage`, `createFile`, helper functions, file extension arrays) are injected via `settings` with `alias*` local bindings for unit testability and standalone serialization:

```javascript
const myConfigHelper = (
  { _BUILD_SRC_DIR: SRC_DIR = '' } = OPTIONS.dotenv || {},
  {
    consoleMessage: aliasConsoleMessage = consoleMessage,
    jsFileExtensions: aliasJsFileExtensions = jsFileExtensions
  } = {}
) => {
  // Always call aliasConsoleMessage, never raw console.* or unaliased imports
};
```

### 2. Synchronize `src/standalone.js`

`src/standalone.js` generates a self-contained `webpack.config.js` by calling `.toString()` on functions imported from `src/dotenv.js` and `src/wpConfigs.js`:

- **`outputStandaloneWebpackConfig`**:
  - Serializes `setDotenvParam`, `setupWebpackDotenvFile`, `setupWebpackDotenvFilesForEnv`, `setupDotenvFile`, `setupDotenvFilesForEnv`, `preprocessLoaderJs` / `preprocessLoaderTs` / `preprocessLoaderNone`, `common`, `development`, and `production`.
  - Any top-level plugin, loader `require.resolve`, or constant referenced inside those functions **must** also be declared in the template literal header of `outputStandaloneWebpackConfig` (lines 153-186 of `src/standalone.js`).
- **`createStandalonePackageJson`**:
  - If a new plugin or loader is used by the default webpack configs, add its package name to `webpackResources`, `preprocessLoaderResources`, or `baseConfigResources` in `createStandalonePackageJson` (lines 319-337 of `src/standalone.js`).

### 3. Synchronize Engine-Aware & `@tsconfig/*` Preset Rules

When updating supported Node.js versions or `@tsconfig/node*` packages:

1. **`package.json`**: Update `engines.node` and `@tsconfig/node*` dependencies.
2. **`bin/cli.js`**: Update the `choices` array for the `tsconfig` option (line 77).
3. **`README.md` & `DOCS.md`**:
   - Update `NodeJS version` under Requirements / Tooling requirements.
   - Update `--tsconfig` choices in `README.md` CLI help block and `DOCS.md` CLI options table.
   - Update `@tsconfig/node*` rows in the `DOCS.md` Exposed Packages table (`N/A`).
4. **`.github/workflows/*.yml`**: Update `node-version` matrices in `integration.yml`, `documentation_lint.yml`, `packages_lint.yml`, and `publish.yml`.
5. **`src/__tests__/ts.test.js`**: Verify or add preset test coverage.

### 4. Synchronize Exposed Packages (`lib/packages.js`)

Whenever adding, removing, or upgrading a package in `package.json` `dependencies`:

1. Run `npm run build:packages-lib` (`node ./scripts/generatePackagesLib.js`).
2. Verify how `scripts/generatePackagesLib.js` processes the package:
   - It dynamically imports each dependency (`dynamicImport(arg)`).
   - It looks for `LICENSE`, `LICENSE-MIT`, `LICENSE.txt`, or `LICENSE.md` in `node_modules/<pkg>/`. Packages without a recognized license file or without a default/value export (such as `@tsconfig/*`) are skipped.
   - If `defaultOrValue` is a class (`/^class/i.test(defaultOrValue.toString())`), the exported identifier is `UpperCamelCase` (e.g., `CopyWebpackPlugin`, `MinimizerWebpackPlugin`); otherwise it is `lowerCamelCase` (e.g., `webpackMerge`), while the resolve export is always `lowerCamelCaseResolve` (e.g., `copyWebpackPluginResolve`).
3. If `src/wpConfigs.js` imports a new `*Resolve` or plugin from `../lib/packages`, add a corresponding mock entry to `jest.setupTests.js` (`jest.mock('./lib/packages', ...)`).
4. Update the Exposed Packages table in `DOCS.md`.

## Step 3: Testing Configuration Changes

1. **Run Unit Tests & Lint/Spell Checks**:
   ```bash
   npm test
   ```
2. **Examine Snapshot Diffs**:
   - Inspect diffs in `src/__tests__/__snapshots__/*.snap` before updating.
   - Ensure no local absolute filesystem paths leaked into snapshots (normalized by `cleanConfigurationPaths` in `jest.setupTests.js`).
3. **Update Snapshots When Intentional**:
   ```bash
   npx jest -u
   ```
4. **Run Integration & Code Hygiene Tests**:
   ```bash
   npm run test:integration
   ```

## Step 4: Documenting Changes & Commit Messages

1. **JSDoc & Generated Markdown**:
   - Ensure all functions in `src/*.js` have accurate JSDoc `@param` and `@returns` tags.
   - Run `npm run build:docs` to regenerate `src/README.md` (enforced in CI by `.github/workflows/documentation_lint.yml`).
2. **Commit Message Conventions**:
   - Follow Conventional Commits (`<type>(<optional scope>): <description>`), keeping the subject line `<= 65` characters:
     - `feat(wpConfigs): ...` / `fix(standalone): ...`
     - `build(deps): bump prod group with N updates`
     - `build(deps-dev): bump dev group with N updates`
     - `chore(lib): package license` (when `lib/packagesLicenses.txt` or `lib/packages.js` is regenerated)
     - `docs(readme): ...` / `chore(docs): ...`

## References

- [Guidelines Index](./README.md#guidelines-index)
- [Problematic Packages & Configs Manifest](./agent_manifest.md)
- [Agent Testing](./agent_testing.md)

Last updated: November 24, 2026
