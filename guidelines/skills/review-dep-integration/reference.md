# Review Dependency Integration — Reference (`weldable`)

## Quick `weldable` dependency facts

- **Dual Role of `dependencies`:** Almost every package in `package.json` `dependencies` is both:
  1. Used internally by `weldable` configs/CLI (or provided for consumer webpack extensions), **and**
  2. Re-exported as CommonJS (`require` and `require.resolve`) in `lib/packages.js` via `scripts/generatePackagesLib.js` (with its license bundled in `lib/packagesLicenses.txt`).
- **Exceptions (`@tsconfig/*`):** `@tsconfig/*` packages only ship `tsconfig.json` (no JS export), so `scripts/generatePackagesLib.js` skips them (`N/A` in `DOCS.md`), and `src/ts.js` loads them via `require('@tsconfig/${baseTsConfig}/tsconfig.json')`.
- **Cooldown Policy:**
  - **Minor & Major bumps:** Must be published **>= 14 days ago** (`.github/dependabot.yml` `cooldown.default-days: 14`).
  - **Patch bumps:** Must be published **>= 7 days ago**.
- **Batching Policy:** Group related non-breaking updates into small domain batches (Webpack & plugins, Styles & preprocessors, Babel & CLI, TypeScript & `@tsconfig/*`, DevDependencies) rather than a single monolithic update.

## Priority rules (`weldable`)

| Priority | When |
| :--- | :--- |
| **P0** | Unit/integration tests fail, `npm run build:packages-lib` fails or drops an exported package/license, pure-ESM break in CommonJS `require()`, `engines.node` incompatibility, or runtime CLI/webpack build breaks |
| **P1** | Used plugin/loader option or schema changed; `src/standalone.js` template or dependency list needs synchronization; snapshots (`*.snap`) or `lib/packagesLicenses.txt` need updating |
| **P2** | Optional hygiene (e.g., updating `DOCS.md` examples/tables, adopting newer non-breaking plugin options, cleaning up deprecated options before next major) |
| **None** | Feature/API not used by `weldable` and package re-export in `lib/packages.js` remains intact with passing tests |

## Key files and coupled surfaces

| File | Dependency Role |
| :--- | :--- |
| `package.json` | Direct `dependencies` (exact versions) and `devDependencies` (`^` ranges); `engines.node` (`>=22.0.0`) |
| `src/wpConfigs.js` | Instantiates `CopyPlugin`, `CssMinimizerPlugin`, `HtmlWebpackPlugin`, `HtmlReplaceWebpackPlugin`, `MiniCssExtractPlugin`, `SvgToMiniDataURI`, `TerserJSPlugin`; resolves `babelLoaderResolve`, `babelPresetEnvResolve`, `cssLoaderResolve`, `tsLoaderResolve` |
| `src/wp.js` | Runs `webpack`, `WebpackDevServer`, `webpack-merge` (`merge`), and `rimraf` (`rimrafSync`) |
| `src/dotenv.js` | Runs `dotenv`, `dotenv-expand`, and `dotenv-webpack` |
| `src/ts.js` | Loads `@tsconfig/${baseTsConfig}/tsconfig.json` |
| `src/standalone.js` | Serializes `wpConfigs.js` + `dotenv.js` functions into `webpack.config.js` and installs `webpackResources`, `preprocessLoaderResources`, and `baseConfigResources` |
| `bin/cli.js` | Configures `yargs` CLI options and `--tsconfig` preset choices |
| `scripts/generatePackagesLib.js` | Dynamically imports all `dependencies`, checks `LICENSE{,-MIT,.txt,.md}`, and writes `lib/packages.js` + `lib/packagesLicenses.txt` |
| `jest.setupTests.js` | Mocks `./lib/packages` (`babelLoaderResolve`, `babelPresetEnvResolve`, `cssLoaderResolve`, `tsLoaderResolve`) and normalizes snapshot paths |
| `eslint.config.mjs` | Configures `@cdcabrera/eslint-config-toolkit` (`node`, `jest`) for `npm run test:lint` |
| `DOCS.md` & `README.md` | Documents CLI options, `--tsconfig` choices, and the Exposed Packages table |

## Grep patterns

Canonical inventory commands (replace `<pkg>` with the package name or camelCase identifier, e.g., `dotenv-webpack` or `dotenvWebpack`):

```bash
# 1. Direct usage across source, CLI, scripts, tests, and docs
grep -rnE "<pkg>" src bin scripts tests lib DOCS.md README.md jest.setupTests.js eslint.config.mjs

# 2. Check cooldown / publish timestamps and metadata for target package
npm view <pkg> version time engines peerDependencies type exports --json

# 3. Check installed package metadata and license files
ls -la node_modules/<pkg>/LICENSE* && node -e "const p = require('./node_modules/<pkg>/package.json'); console.log({ version: p.version, type: p.type, main: p.main, exports: p.exports, engines: p.engines, peerDependencies: p.peerDependencies });"
```

## Audit depth policy

| Source | Frequency | Objective |
| :--- | :--- | :--- |
| **Cooldown & Metadata** | Always | Verify 14d minor/major & 7d patch age, `engines.node`, `peerDependencies`, and `LICENSE` file presence. |
| **Release Notes / Changelog** | Always | Identify breaking changes, option deprecations, and behavioral shifts. |
| **Module Export & `generatePackagesLib` Audit** | Minor/Major Bumps | Verify `dynamicImport` + `require('<pkg>')` in `lib/packages.js` and `UpperCamelCase` vs `lowerCamelCase` export naming. |

## Compatibility policy (CJS & Exposed Packages)

1. **CommonJS Re-Export Preservation (`lib/packages.js`):**
   - `weldable` consumers rely on `const packages = require('weldable/lib/packages')`.
   - Before accepting any major/minor bump of a production dependency, run `npm run build:packages-lib` and `node -e "require('./lib/packages')"` to confirm every exported package can be `require()`d without `ERR_REQUIRE_ESM` or missing export errors.
2. **Export Naming Stability:**
   - `scripts/generatePackagesLib.js` determines whether an export key is `UpperCamelCase` (if `/^class/i.test(defaultOrValue.toString())`) or `lowerCamelCase`.
   - If a dependency upgrade changes a function to a `class` (or vice versa), `lib/packages.js` will change the casing of the exported identifier! Flag any export name change in `lib/packages.js` as a **P1/P0 breaking change** for consumers and update `DOCS.md` if intentional.
3. **License Bundling (`lib/packagesLicenses.txt`):**
   - Confirm the package still ships `LICENSE`, `LICENSE-MIT`, `LICENSE.txt`, or `LICENSE.md`. If upstream renamed its license file, `scripts/generatePackagesLib.js` must be updated so the package is not dropped from `lib/packages.js`.

## Recurring P2 checks

Include these checks in the **Recommended fixes (P2)** section of reports when applicable:

- **DO**: Verify `DOCS.md` Exposed Packages table matches all exports in `lib/packages.js`.
- **DO**: Verify `src/standalone.js` `createStandalonePackageJson` resource arrays match the plugins/loaders required by `src/wpConfigs.js` and `src/dotenv.js`.
- **DO**: When updating `lib/packagesLicenses.txt`, commit with `chore(lib): package license` (separate from or noted alongside `build(deps)`).
- **DO NOT**: Upgrade minor/major versions published `< 14` days ago or patch versions published `< 7` days ago unless fixing a critical security vulnerability.

## Report template

Save as: **`reports/YYYYMMDD-HHMMSS-{sanitized-pkg}-{semver}-update-report.md`** (`YYYYMMDD-HHMMSS` = UTC timestamp when the report is written, e.g., `reports/20261124-153000-dotenv-webpack-9.0.0-update-report.md`). The `reports/` directory is gitignored; run `mkdir -p reports` to preserve previous reports.

```markdown
# {Package Name} {version} Update Report — weldable

**Date:** YYYY-MM-DD
**Package versions:** {from} -> {to}
**Publish date & cooldown:** YYYY-MM-DD ({N} days ago — Passes/Fails 14d minor-major / 7d patch rule)
**Release reference:** [{Package} v{X.Y.Z}](https://github.com/{org}/{repo}/releases/tag/v{X.Y.Z})

## Executive summary

| Verdict | Detail |
| :--- | :--- |
| **Cooldown status** | Pass ({N}d old) / Fail (use {fallback_version} instead) |
| **Code changes required** | None / ... |
| **Standalone / Lib export impact** | None / `lib/packagesLicenses.txt` updated / `lib/packages.js` export changed |
| **Documentation updates required** | None / ... |
| **Risk level** | Low / Medium / High |

[1-2 sentences on overall safety and coupled surface impact.]

---

## Test and build verification

| Command | Result |
| :--- | :--- |
| `npm run build:packages-lib` | Pass / Diff in `lib/packages*` |
| `npm run build:docs` | Pass / Diff in `src/README.md` |
| `npm test` | Pass / Fail (coverage summary) |
| `npm run test:integration` | Pass / Fail |
| `node -e "require('./lib/packages')"` | Pass / Fail |

---

## Dependency & metadata context

| Property | Previous ({from}) | Target ({to}) | Notes |
| :--- | :--- | :--- | :--- |
| **Module `type` / `exports`** | | | CJS `require()` compatibility |
| **`engines.node`** | | | Repo requires `>=22.0.0` |
| **`peerDependencies`** | | | |
| **License file** | | | Bundled in `lib/packagesLicenses.txt` |

---

## Usage inventory across `weldable` coupled surfaces

| Surface | File(s) | Usage / Export Status |
| :--- | :--- | :--- |
| **Core Configs / CLI** | `src/wpConfigs.js`, `src/wp.js`, `src/dotenv.js`, `src/ts.js`, `bin/cli.js` | |
| **Standalone Generator** | `src/standalone.js` | |
| **Exposed Packages Lib** | `lib/packages.js`, `lib/packagesLicenses.txt` | |
| **Jest Setup & Snapshots** | `jest.setupTests.js`, `src/__tests__/__snapshots__/` | |
| **Documentation** | `DOCS.md`, `README.md`, `src/README.md` | |

---

## Release notes vs. `weldable`

### Potentially breaking changes

| Release note | Used in weldable? | Impact | Priority | Recommended fix |
| :--- | :--- | :--- | :--- | :--- |
| | Yes / No / Exposed-Only | None / Low / Medium / High | P0 / P1 / P2 / None | |

### Other behavioral fixes & features

| Release note | Used in weldable? | Impact | Priority | Recommended fix |
| :--- | :--- | :--- | :--- | :--- |
| | | | | |

### Packaging, peer dependencies & engines

| Release note / Metadata | Impact on weldable | Priority | Recommended fix |
| :--- | :--- | :--- | :--- |
| | | | |

---

## Recommended fixes (consolidated)

Sorted by priority.

### P0 — Must fix

| Item | Recommended fix |
| :--- | :--- |
| | |

### P1 — Should fix

| Item | Recommended fix |
| :--- | :--- |
| | |

### P2 — Optional

| Item | Recommended fix |
| :--- | :--- |
| | |

---

## Suggested commit message

### Subject
```text
build(deps): bump <pkg-or-group> from {from} to {to}
```

### Body (Concise)
```text
* {pkg}, from {from} to {to}
```

---

## Conclusion

[Final verdict.]

---

## References

- [{Package} release notes](URL)
- Bump commit: `hash` (if applicable)
```

## Example impact rows (`weldable`)

Use these patterns when mapping target release notes:

| Release note | Used in weldable? | Impact | Priority | Recommended fix |
| :--- | :--- | :--- | :--- | :--- |
| `@tsconfig/strictest` removes `"checkJs": true` | Yes — `src/ts.js` (`createTsConfig`) & `src/__tests__/ts.test.js` | Low — merged `tsconfig.json` snapshot omits `checkJs` | P1 | Verify diff and update `src/__tests__/__snapshots__/ts.test.js.snap` |
| `sass` consolidates duplicate license blocks in `LICENSE` | Exposed-Only — `scripts/generatePackagesLib.js` | Low — `lib/packagesLicenses.txt` changes | P1 | Run `npm run build:packages-lib` and commit `lib/packagesLicenses.txt` with `chore(lib): package license` |
| `webpack-dev-server` v6 changes `devServer` schema options | Yes — `development()` in `src/wpConfigs.js` & `src/standalone.js` | High — invalid schema options fail `startWp` | P0 | Update `devServer` object in `src/wpConfigs.js`, verify `src/standalone.js` serialization, and update snapshots |
| Package switches to pure ESM (`"type": "module"`, no CJS export) | Exposed-Only — `lib/packages.js` | High — `require('<pkg>')` in `lib/packages.js` may fail | P0 | Verify `node -e "require('./lib/packages')"`; check if Node 22+ `require(esm)` handles it or if `generatePackagesLib.js` needs adjustment |
