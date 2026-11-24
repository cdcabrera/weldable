# Problematic Packages & Configs Manifest

This manifest serves as a central registry for modules, packages, and testing mechanics in `weldable` that have strict coupling constraints or have historically caused subtle regressions.

## Manifest Maintenance Principles

- **Canonical Focus**: Only document modules, packages, and test mechanics actively used within `weldable`.
- **Instance Independence**: Do not reference local, gitignored directories (e.g., `.agent/` or `reports/`) or machine-specific paths. All mandatory logic must be self-contained.

## `src/standalone.js` (`Function.prototype.toString()` Serialization)

- **Issues**: `outputStandaloneWebpackConfig` in `src/standalone.js` generates a standalone `webpack.config.js` by calling `.toString()` on functions imported from `src/wpConfigs.js` (`common`, `development`, `production`, `preprocessLoaderJs`, `preprocessLoaderTs`, `preprocessLoaderNone`) and `src/dotenv.js` (`setDotenvParam`, `setupWebpackDotenvFile`, `setupWebpackDotenvFilesForEnv`, `setupDotenvFile`, `setupDotenvFilesForEnv`).
- **Mandatory Logic/Configuration**:
  - **Self-Contained Scope**: Never reference module-scoped helper variables or imports inside `src/wpConfigs.js` or `src/dotenv.js` functions unless those exact identifiers are either injected via default parameter bindings (`alias*`) or explicitly declared in the template header of `outputStandaloneWebpackConfig` in `src/standalone.js`.
  - **Dependency Lists**: Any package added to the default webpack configuration must also be added to `webpackResources`, `preprocessLoaderResources`, or `baseConfigResources` in `createStandalonePackageJson` (`src/standalone.js`).

## `scripts/generatePackagesLib.js` & `lib/packages.js`

- **Issues**: `weldable` is a CommonJS package (`"type": "commonjs"`), while `scripts/generatePackagesLib.js` uses `dynamicImport` (`await import(file)`) to inspect `package.json` `dependencies` and generates `require()` / `require.resolve()` statements in `lib/packages.js` plus bundled licenses in `lib/packagesLicenses.txt`.
- **Mandatory Logic/Configuration**:
  - **License Requirement**: `loadPackages` checks `LICENSE`, `LICENSE-MIT`, `LICENSE.txt`, and `LICENSE.md` in `node_modules/<pkg>/`. If an upstream package renames its license file outside those four names, it will silently be omitted from `lib/packages.js` with a console warning.
  - **CJS `require()` Compatibility**: Because `lib/packages.js` emits `require('<pkg>')`, upgrading a production dependency to a pure-ESM version that drops CommonJS `exports` or uses top-level `await` without Node `require(esm)` compatibility will break consumers importing `weldable/lib/packages`.
  - **CI Enforcement**: `.github/workflows/packages_lint.yml` runs `npm run build:packages-lib` and fails if `git status` shows uncommitted diffs in `lib/packages.js` or `lib/packagesLicenses.txt`. Always run `npm run build:packages-lib` after dependency updates.

## `jest.setupTests.js` (`./lib/packages` Mock & `cleanConfigurationPaths`)

- **Issues**:
  1. Loading the full `lib/packages.js` inside Jest unit tests triggers module loading issues for certain packages.
  2. Snapshot tests serialize webpack configuration objects containing absolute directory paths (`process.cwd()` / `__fixtures__`).
- **Mandatory Logic/Configuration**:
  - **`./lib/packages` Mock**: `jest.setupTests.js` mocks `./lib/packages` with static strings (`babelLoaderResolve`, `babelPresetEnvResolve`, `cssLoaderResolve`, `tsLoaderResolve`). If `src/wpConfigs.js` destructures any additional export from `../lib/packages`, it **must** be added to `jest.mock('./lib/packages', ...)` in `jest.setupTests.js`.
  - **`cleanConfigurationPaths` Regex**: Line 151 of `jest.setupTests.js` uses `new RegExp('"[a-z0-9/_.,*()\\s-]*\\/${projectName}\\/', 'gi')` to normalize absolute paths before `/weldable/` to `"./`. Keep the hyphen `-` at the **end** of the character class `[...]` (never `/-_`, which creates an ASCII range from `47` to `95` that excludes `-` ASCII `45` and breaks snapshots whenever a parent directory name contains a hyphen).

## `tests/code.test.js` (Console Method Restriction)

- **Issues**: `tests/code.test.js` (run during `npm run test:integration`) executes `git grep -n -E "(console.warn|console.log|console.info|console.error)"` inside `src/` and compares the output against `tests/__snapshots__/code.test.js.snap`.
- **Mandatory Logic/Configuration**:
  - Never use raw `console.log`, `console.info`, `console.warn`, or `console.error` in any `src/*.js` file (outside `src/logger.js` and `src/standalone.js`'s `const consoleMessage = console;`).
  - Always import and use `consoleMessage` from `./logger` (injected as `consoleMessage: aliasConsoleMessage = consoleMessage`).

## `scripts/readme.docs.js` & `src/README.md`

- **Issues**: `.github/workflows/documentation_lint.yml` runs `npm run build:docs` (`jsdoc-to-markdown` on `./src/*.js` -> `./src/README.md`) and fails if `git status` is dirty.
- **Mandatory Logic/Configuration**:
  - Any change to JSDoc comments or function signatures in `src/*.js` requires running `npm run build:docs` and committing the updated `src/README.md`.

Last updated: November 24, 2026
