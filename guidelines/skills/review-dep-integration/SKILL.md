---
name: review-dep-integration
description: Reviews any dependency or dependency group upgrade for weldable—verifies publish cooldown rules (14-day minor/major, 7-day patch), maps upstream release notes to weldable's coupled surfaces (wpConfigs, standalone, lib/packages, CLI, tsconfig, tests), runs verification suites, and writes a dated update report with impact tables and prioritized fixes. Use when bumping dependencies, on review dep, dep upgrade, dep integration review, assessing breaking changes, generating a dep update report, or reviewing Dependabot/Renovate PRs.
---

# Review Dependency Integration (`weldable`)

## When to use

- User bumps or proposes bumping **any dependency or dependency group** in `package.json` (e.g., `webpack`, `babel`, `typescript`, `sass`, `less`, `postcss`, `cssnano`, `dotenv`, `yargs`, `eslint`, `@cdcabrera/eslint-config-toolkit`, `cspell`)
- User asks for a **dependency upgrade review**, **integration review**, or **impact analysis**
- Dependabot or manual batch PR for `dependencies` or `devDependencies`
- User wants a report comparing **upstream release notes** to `weldable`'s codebase

## Workflow

1. **Versions, Cooldown Check & Release Notes**
   - Read `package.json`, `package-lock.json`, and `node_modules/<pkg>/package.json` if installed.
   - Note **previous** version from `git log -1 -- package.json` or the bump branch/commit.
   - **Cooldown Verification (Mandatory):**
     - Query publish timestamps via `npm view <pkg> time --json` and compare against current UTC date (`date -u`).
     - **Minor & Major updates:** Must be published **>= 14 days ago** (matching `.github/dependabot.yml` `default-days: 14`).
     - **Patch updates:** Must be published **>= 7 days ago** (within reason for semver patches).
     - If a target version violates the cooldown window, flag it immediately and identify the newest version that satisfies the cooldown cutoff.
   - **Module & Metadata Check:**
     - Inspect `node_modules/<pkg>/package.json` (or `npm view <pkg>`) for `type` (`"commonjs"` vs `"module"`), `exports`, `main`, `engines.node`, `peerDependencies`, and `LICENSE*` filename (`LICENSE`, `LICENSE-MIT`, `LICENSE.txt`, `LICENSE.md`).
   - **Release Notes:**
     - Fetch upstream GitHub release notes or `CHANGELOG.md` for `{from}` -> `{to}` (via web search/fetch, `npm view <pkg> repository.url`, or packaged changelog).
     - **Offline fallback:** If release notes cannot be retrieved online, state that limitation and inspect `node_modules/<pkg>` metadata, `CHANGELOG.md`, and entry point source directly.
     - Follow [reference.md — Audit depth policy](reference.md#audit-depth-policy).

2. **Repo Guidelines**
   - Read (do not paste into the report): `CONTRIBUTING.md`, `guidelines/agent_behaviors.md`, `guidelines/agent_config_management.md`, `guidelines/agent_manifest.md`, `guidelines/agent_testing.md`.

3. **Codebase Inventory (5 Coupled Surfaces)**
   - Run the inventory commands in [reference.md — Grep patterns](reference.md#grep-patterns) for `<pkg>`.
   - Check how `<pkg>` interacts with all 5 `weldable` integration points (see [reference.md — Key files and coupled surfaces](reference.md#key-files-and-coupled-surfaces)):
     1. **Core Configs & Runtime** (`src/wpConfigs.js`, `src/wp.js`, `src/dotenv.js`, `src/ts.js`, `bin/cli.js`)
     2. **Standalone Generator** (`src/standalone.js` — `outputStandaloneWebpackConfig` requires/resolves and `createStandalonePackageJson` resource arrays)
     3. **Exposed Packages Library** (`scripts/generatePackagesLib.js` -> `lib/packages.js` and `lib/packagesLicenses.txt`)
     4. **Jest Setup & Snapshots** (`jest.setupTests.js` mocks and `src/__tests__/__snapshots__/*.snap`)
     5. **Documentation** (`DOCS.md`, `README.md`, `src/README.md`)
   - Apply [reference.md — Compatibility policy (CJS & Exposed Packages)](reference.md#compatibility-policy-cjs--exposed-packages).

4. **Impact Matrix**
   - For **every** relevant release-note item (breaking changes, behavioral fixes, peer/engine requirements, packaging/ESM), add one row to the report tables.
   - Columns: **Release note / Change**, **Used in weldable?** (Yes / No / Exposed-Only — cite file or grep), **Impact** (None / Low / Medium / High), **Priority** (`P0` / `P1` / `P2` / `None`), **Recommended fix** (or `None`).
   - Priority rules: [reference.md — Priority rules](reference.md#priority-rules-weldable).
   - Always include applicable recurring hygiene checks from [reference.md — Recurring P2 checks](reference.md#recurring-p2-checks) in the report's **Recommended fixes** section.

5. **Tests & Artifact Verification**
   From repo root:

   ```bash
   npm run build:packages-lib
   npm run build:docs
   npm test
   npm run test:integration
   git status -s
   ```

   - Record pass/fail results and whether `lib/packages.js`, `lib/packagesLicenses.txt`, or `src/README.md` had diffs.
   - **P0 (tests/build/CJS export break):** Document failures in the report. Apply only minimal fixes needed to verify bump safety, re-run tests, and note any changes. Update snapshots only when output change is verified intentional (`_WELDABLE_TEST=true npx jest -u` scoped to affected files).
   - **P1 / P2:** Do not change source code during the initial review—list fixes in the report only.

6. **Write the Report**
   - **Directory:** `reports/` at repository root (gitignored). Run `mkdir -p reports` if needed; do not delete prior reports.
   - **Filename:** `YYYYMMDD-HHMMSS-{sanitized-pkg}-{semver}-update-report.md`
     - `YYYYMMDD-HHMMSS` = report timestamp in **UTC** (`date -u +"%Y%m%d-%H%M%S"`).
     - `{sanitized-pkg}` = package or group name with `@` removed and `/` replaced by `-` (e.g., `babel-core`, `webpack`, `tsconfig-bases`).
     - `{semver}` = target version without `v` (e.g., `reports/20261124-153000-dotenv-webpack-9.0.0-update-report.md`).
   - Use [reference.md — Report template](reference.md#report-template). Do not commit the report unless the user asks.

7. **User Summary**
   - Provide:
     1. Report path
     2. **Cooldown status** (Pass / Adjusted version recommendation)
     3. **Executive summary verdict table** from the report (`Code changes required`, `Standalone / Lib export impact`, `Documentation updates required`, `Risk level`)
     4. `P0` / `P1` / `P2` counts and link to release notes
   - Ask: *"Would you like me to proceed with the recommended P1/P2 fixes (or commit message) listed in the report?"*
   - Do not modify the codebase further until the user explicitly grants permission.

## Additional resources

- [reference.md](reference.md) — grep patterns, coupled surfaces table, priority rules, CJS/exposed-package compatibility policy, report template, example impact rows

## Quick checks

- [ ] Versions (from -> to), publish dates (14d minor/major, 7d patch cooldown), and release notes captured
- [ ] Guidelines read; inventory grep run across `src/`, `bin/`, `scripts/`, `tests/`, `DOCS.md`
- [ ] CJS `require()` and `LICENSE` file compatibility verified via `npm run build:packages-lib`
- [ ] Every release-note item mapped with priority (`P0`, `P1`, `P2`, `None`)
- [ ] `npm run build:packages-lib`, `npm run build:docs`, `npm test`, and `npm run test:integration` recorded
- [ ] Report written to `reports/YYYYMMDD-HHMMSS-{sanitized-pkg}-{semver}-update-report.md` (UTC)
- [ ] User asked before applying any P1/P2 code changes
