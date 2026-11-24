# Agent Comments

## Overview

This document provides agent templates and standards for JSDoc and inline comments in `weldable`. Because `npm run build:docs` runs `jsdoc-to-markdown` across `./src/*.js` to generate `src/README.md` (enforced by `.github/workflows/documentation_lint.yml`), consistent JSDoc formatting is mandatory.

## For Agents

### Processing Priority

Medium - Process this document when creating or modifying functions in `src/*.js`, `bin/cli.js`, or `scripts/*.js`.

### Related Guidelines

See the [Guidelines Index](./README.md#guidelines-index) for a complete list of all guidelines.

### Key Concepts

- Module JSDoc headers (`@module`)
- Function JSDoc templates (`@param`, `@returns`)
- Destructured parameter documentation with defaults
- Concise inline comments
- Regenerating `src/README.md` via `npm run build:docs`

## Comment Templates

### 1. Module Header (`src/*.js`)

Place the `@module` JSDoc block immediately after top-level `require()` statements:

```javascript
const fs = require('fs');
const path = require('path');
const { OPTIONS } = require('./global');
const { consoleMessage } = require('./logger');

/**
 * @module webpackConfigs
 */
```

### 2. Function JSDoc Block

Every function in `src/*.js` must document its purpose, destructured `dotenv` or `options` properties, injected `settings` properties, and `@returns` type (when returning a value):

```javascript
/**
 * Assumption based preprocess loader for JS
 *
 * @param {object} dotenv
 * @param {string} dotenv._BUILD_SRC_DIR
 * @param {object} settings
 * @param {Array<string>} settings.jsFileExtensions
 * @returns {{module: {rules: Array}}}
 */
const preprocessLoaderJs = (
  { _BUILD_SRC_DIR: SRC_DIR = '' } = OPTIONS.dotenv || {},
  { jsFileExtensions: aliasJsFileExtensions = jsFileExtensions } = {}
) => ({
  // ...
});
```

### 3. Documenting Optional Parameters with Defaults

When documenting public helper functions (such as `src/dotenv.js`), include default values in square brackets when helpful for `src/README.md` consumers:

```javascript
/**
 * For use with webpack configurations. Set up multiple webpack dotenv file parameters.
 *
 * @param {object} params
 * @param {string} [params.directory=<OPTIONS.contextPath>]
 * @param {string} params.env
 * @param {object} settings
 * @param {object} settings.consoleMessage
 * @param {Function} settings.setupWebpackDotenvFile
 * @returns {Array}
 */
```

### 4. Standalone Template Section Comments

In `src/standalone.js` (`outputStandaloneWebpackConfig`), use concise single-line JSDoc banners to separate sections in the generated `webpack.config.js`:

```javascript
/**
 * Set common webpack configuration
 */
const ${common.name} = ${common.toString()};
```

### 5. Inline Comments

Use concise `//` comments to explain non-obvious behavior or phase steps:

```javascript
// Dependent on loader resolutions this may, or may not, be necessary
extensions: aliasJsFileExtensions.map(ext => `.${ext}`)
```

## Spacing & Formatting Rules

1. **NO blank line** between a JSDoc block or inline comment and the declaration it documents.
2. **ONE blank line** between separate functions or logical blocks.
3. **JSDoc Alignment**:
   - Include a single blank comment line (` *`) between the description text and the first `@param` or `@type` tag.
   - Do not leave trailing spaces on empty JSDoc lines (` *`).
   - Use lowercase `{object}`, `{string}`, `{boolean}`, `{number}`, and capitalized `{Array}`, `{Function}`, `{Promise}`, `{RegExp}` to match existing ESLint / JSDoc conventions in `src/*.js`.

## Comment Conciseness Guidelines

- Keep function descriptions to 1-2 sentences focused on what the function produces or configures.
- Focus inline comments on **why** a fallback or resolution exists rather than restating the code.
- Never include raw `console.log` / `console.warn` strings inside comments in `src/*.js`—`tests/code.test.js` runs `git grep` across `src/` for `console.(warn|log|info|error)` and will fail the snapshot test if a comment matches!

## Mandatory Verification After Editing Comments in `src/*.js`

Whenever any JSDoc comment in `src/*.js` is added or modified:

```bash
npm run build:docs
```

Verify that `src/README.md` updates cleanly and that `npm test` (including `test:lint` and `test:spell-docs`) passes.

## References

- [Guidelines Index](./README.md#guidelines-index)
- [Problematic Packages & Configs Manifest](./agent_manifest.md)

Last updated: November 24, 2026
