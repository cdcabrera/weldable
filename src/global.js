const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { consoleMessage } = require('./logger');

/**
 * @module Global
 */

/**
 * Handle a variety of error types consistently.
 *
 * @param {string|Array|object|any} errors
 * @returns {string|any|any[]}
 */
const errorMessageHandler = errors => {
  const parseErrorObject = err => {
    if (typeof err === 'string') {
      return err;
    }

    if (err.message) {
      return err.message;
    }

    const updatedEntries = [];
    Object.entries(err).forEach(([key, value]) => updatedEntries.push(`${key}: ${value}`));
    return updatedEntries.join('\n');
  };

  if (typeof errors === 'string') {
    return errors;
  }

  if (Array.isArray(errors)) {
    const updatedErrors = [];
    errors.forEach(err => updatedErrors.push(parseErrorObject(err)));
    return updatedErrors;
  }

  if (typeof errors === 'object') {
    return parseErrorObject(errors);
  }

  return errors;
};

/**
 * Check if "is a Promise", "Promise like".
 *
 * @param {Promise|*} obj
 * @returns {boolean}
 */
const isPromise = obj => /^\[object (Promise|Async|AsyncFunction)]/.test(Object.prototype.toString.call(obj));

/**
 * Import module regardless of CommonJS or ES.
 *
 * @param {string} file
 * @returns {Promise<any>}
 */
const dynamicImport = async file => {
  let result;
  try {
    if (process.env._WELDABLE_TEST === 'true') {
      result = require(file);
    } else {
      // eslint-disable-next-line node/no-unsupported-features/es-syntax
      result = await import(file);
    }
  } catch (e) {
    consoleMessage.warn(`Dynamic import for ${file}: ${e.message}`);
  }

  return result;
};

/**
 * Global context path. On load set path.
 *
 * @type {string}
 */
const contextPath = (() => {
  if (process.env._WELDABLE_TEST === 'true') {
    return path.join('..', '__fixtures__');
  }

  if (process.env._WELDABLE_DEV === 'true') {
    return path.join(__dirname, '..', './__fixtures__');
  }

  return process.cwd();
})();

/**
 * Create a file with a fallback name based on hashed contents.
 *
 * @param {string} contents
 * @param {object} options
 * @param {string} options.dir
 * @param {string} options.ext
 * @param {string} options.encoding
 * @param {string} options.filename
 * @param {boolean} options.resetDir
 * @returns {{path: string, file: (*|string), contents: string, dir: string}}
 */
const createFile = (
  contents,
  { dir = path.resolve(contextPath), ext = 'txt', encoding = 'utf8', filename, resetDir = false } = {}
) => {
  const updatedFileName = filename || crypto.createHash('md5').update(contents).digest('hex');
  const file = path.extname(updatedFileName) ? updatedFileName : `${updatedFileName}.${ext}`;
  const filePath = path.join(dir, file);

  if (resetDir && fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true });
  }

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  let updatedContents;

  try {
    fs.writeFileSync(filePath, contents, { encoding });
    updatedContents = fs.readFileSync(filePath, { encoding });
  } catch (e) {
    consoleMessage.error(e.message);
  }

  return { dir, file, path: filePath, contents: updatedContents };
};

/**
 * Global options/settings. One time _set, then freeze.
 *
 * @type {{contextPath: string, _set: *}}
 */
const OPTIONS = {
  contextPath,
  set _set(obj) {
    Object.entries(obj).forEach(([key, value]) => {
      if (typeof value === 'function') {
        this[key] = value.call(this);
        return;
      }

      this[key] = value;
    });
    delete this._set;
    Object.freeze(this);
  }
};

module.exports = { contextPath, createFile, dynamicImport, errorMessageHandler, isPromise, OPTIONS };
