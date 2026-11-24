# Agent Testing

## Overview

This document provides agent guidance on testing procedures, global test helpers, snapshot verification, and integration checks for `weldable`.

## For Agents

### Processing Priority

High - Process this document when running tests, updating snapshots, or implementing changes in `src/`, `bin/`, or `scripts/`.

### Related Guidelines

See the [Guidelines Index](./README.md#guidelines-index) for a complete list of all guidelines.

### Key Concepts

- Unit tests (`src/__tests__/`) vs. Integration tests (`tests/`)
- Global test helpers in `jest.setupTests.js`
- Snapshot content verification and path normalization
- Code coverage thresholds
- Console method hygiene test (`tests/code.test.js`)

## Test Architecture

`weldable` separates tests into two Jest roots:

1. **Unit Tests (`src/__tests__/*.test.js`)**:
   - Configured in `package.json` under `"jest": { "roots": ["src"], "setupFilesAfterEnv": ["<rootDir>jest.setupTests.js"] }`.
   - Tests individual modules: `cli.test.js`, `dotenv.test.js`, `global.test.js`, `index.test.js`, `logger.test.js`, `standalone.test.js`, `ts.test.js`, `wp.test.js`, `wpConfigs.test.js`.
   - Enforces global coverage thresholds (`branches: 60%`, `functions: 75%`, `lines: 80%`, `statements: 80%`).

2. **Integration & Hygiene Tests (`tests/*.test.js`)**:
   - Run via `npm run test:integration` (`export _WELDABLE_TEST=true; jest --roots=./tests`).
   - `tests/cli.test.js`: Executes `node ./bin/cli.js` in a child process with `_WELDABLE_TEST=true` and snapshots the serialized `OPTIONS` output.
   - `tests/code.test.js`: Runs `git grep` inside `src/` to verify no unauthorized `console.[warn|log|info|error]` calls exist.

## Global Test Helpers (`jest.setupTests.js`)

`jest.setupTests.js` registers the following globals (also declared as `readonly` globals in `eslint.config.mjs`):

| Global Helper | Purpose |
| :--- | :--- |
| `global.fixturePath` | Path to checked-in `__fixtures__` directory |
| `global.tempFixturePath` | Path to temporary `.fixtures` directory (gitignored) |
| `global.generateFixture(contents, options)` | Writes a temporary fixture file in `.fixtures` (or custom `dir`) and returns `{ dir, file, path, contents, removeFixture }` |
| `global.removeFixture(file, options)` | Removes a fixture file from `.fixtures` or `__fixtures__` |
| `global.setMockResourceFunctions(mockFunctions)` | Creates deterministic string-tag mock functions (`<fn>[args]</fn>`) for snapshot testing |
| `global.mockObjectProperty(object, propertiesValues)` | Temporarily overrides properties on an object (such as `OPTIONS`) and returns `{ mockClear }` to restore original values |
| `global.cleanConfigurationPaths(value, options)` | Serializes configs/functions to JSON and normalizes local absolute paths ending in `/weldable/` to `"./` (or returns an MD5 hash when `{ isHash: true }`) |

### Automatic Mocks in `jest.setupTests.js`

- `child_process.execSync`: Mocked to return `<execSync>${JSON.stringify(args)}</execSync>` so `runCmd` in `src/standalone.js` does not execute live `npm install` commands during unit tests.
- `./lib/packages`: Mocked with static loader strings (`babelLoaderResolve`, `babelPresetEnvResolve`, `cssLoaderResolve`, `tsLoaderResolve`).

## Running Tests

### Full Unit, Lint, Spell & Coverage Suite

```bash
npm test
```

This runs:
1. `npm run test:lint` (`eslint ./bin ./src eslint.config.mjs`)
2. `npm run test:spell` (`cspell` on `./bin/**/*.js`, `./src/**/*.js`, `./tests/**/*.js`)
3. `npm run test:spell-docs` (`cspell` on `./README.md`, `./DOCS.md`, `./CONTRIBUTING.md`, `./guidelines/**/*.md`)
4. `npm run test:ci` (`CI=true _WELDABLE_TEST=true jest --collectCoverage ...`)

### Integration Suite

```bash
npm run test:integration
```

### Running a Single Test File

Always include `_WELDABLE_TEST=true` when running Jest directly so `src/global.js` sets `contextPath` to `../__fixtures__` and uses `require()` in `dynamicImport`:

```bash
_WELDABLE_TEST=true npx jest src/__tests__/wpConfigs.test.js
```

## Snapshot Testing & Verification

Snapshots are stored in `src/__tests__/__snapshots__/` and `tests/__snapshots__/`.

### Snapshot Content Verification Process

Before updating any snapshot with `-u`, agents **must** follow these steps:

1. **Run Tests Without Updating**:
   ```bash
   npm test
   npm run test:integration
   ```
2. **Inspect the Diff**:
   - **Path Sanitization Check**: Verify that no full machine paths (e.g., `/Users/.../weldable/`) appear in the snapshot diff. All repo paths must be normalized to `"./..."` by `cleanConfigurationPaths`.
   - **Preset / Dependency Diff Check**: If updating `@tsconfig/*` or a webpack plugin, verify that any added/removed property in `ts.test.js.snap`, `wp.test.js.snap`, or `wpConfigs.test.js.snap` matches the upstream package's release notes.
   - **Standalone Parity Check**: If `wpConfigs.js` or `dotenv.js` changed, verify that `standalone.test.js.snap` reflects the exact serialized function updates.
3. **Update Snapshots Only When Confirmed Intentional**:
   ```bash
   _WELDABLE_TEST=true npx jest -u
   ```
4. **Re-run Full Suites**:
   ```bash
   npm test && npm run test:integration
   ```

## Writing New Unit Tests

Follow the established pattern in `src/__tests__/` using `mockObjectProperty(OPTIONS, ...)` and `setMockResourceFunctions([...])`:

```javascript
const { OPTIONS } = require('../global');
const myModule = require('../myModule');

describe('myModule', () => {
  const mockResourceFunctions = setMockResourceFunctions(['createFile', 'consoleMessage']);

  it('should handle default configuration', () => {
    const { mockClear } = mockObjectProperty(OPTIONS, {
      contextPath: fixturePath,
      loader: 'js'
    });

    const result = myModule.myFunction(undefined, {
      ...mockResourceFunctions
    });

    expect(cleanConfigurationPaths(result)).toMatchSnapshot('default configuration');
    mockClear();
  });
});
```

## Trigger: "Test config [module/option]"

1. **Preparation**: Identify the target function in `src/` and its injected `settings` parameters.
2. **Test Case Creation**: Use `mockObjectProperty(OPTIONS, ...)` or `generateFixture(...)` (remembering to call `removeFixture()` in `afterEach` if custom paths are created).
3. **Execution & Verification**: Run `npm test` and `npm run test:integration`, inspect snapshot diffs, and verify coverage remains above thresholds (`60%` branches, `75%` functions, `80%` lines/statements).
4. **Reporting**: Summarize test coverage and snapshot verification using the structured output format in [Agent Behaviors](./agent_behaviors.md#7-structured-output-templates).

## References

- [Guidelines Index](./README.md#guidelines-index)
- [Problematic Packages & Configs Manifest](./agent_manifest.md)

Last updated: November 24, 2026
