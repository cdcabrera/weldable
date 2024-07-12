const path = require('path');
const setupDotenv = require('dotenv');
const { expand: dotenvExpand } = require('dotenv-expand');
const { consoleMessage } = require('./logger');
const { OPTIONS } = require('./global');

/**
 * @module dotenv
 */

/**
 * Set up a webpack dotenv plugin config.
 *
 * @param {string} filePath
 * @param {object} settings
 * @param {object} settings.consoleMessage
 * @returns {undefined|*}
 */
const setupWebpackDotenvFile = (filePath, { consoleMessage: aliasConsoleMessage = consoleMessage } = {}) => {
  const settings = {
    systemvars: true,
    silent: true
  };

  if (filePath) {
    settings.path = filePath;
  }

  try {
    // eslint-disable-next-line
    const DotEnv = require('dotenv-webpack');
    return new DotEnv(settings);
  } catch (e) {
    aliasConsoleMessage.warn(`Failed loading dotenv-webpack package: ${e.message}`);
  }

  return undefined;
};

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
const setupWebpackDotenvFilesForEnv = (
  { directory = OPTIONS.contextPath, env } = {},
  {
    consoleMessage: aliasConsoleMessage = consoleMessage,
    setupWebpackDotenvFile: aliasSetupWebpackDotenvFile = setupWebpackDotenvFile
  } = {}
) => {
  const dotenvWebpackSettings = [];

  try {
    if (env) {
      dotenvWebpackSettings.push(aliasSetupWebpackDotenvFile(path.resolve(directory, `.env.${env}.local`)));
      dotenvWebpackSettings.push(aliasSetupWebpackDotenvFile(path.resolve(directory, `.env.${env}`)));
    }

    dotenvWebpackSettings.push(aliasSetupWebpackDotenvFile(path.resolve(directory, '.env.local')));
    dotenvWebpackSettings.push(aliasSetupWebpackDotenvFile(path.resolve(directory, '.env')));
  } catch (e) {
    aliasConsoleMessage.warn(`setupWebpackDotenvFilesForEnv: ${e.message}`);
  }

  return dotenvWebpackSettings;
};

/**
 * Set up, and access, a dotenv file and the related set of parameters.
 *
 * @param {string} filePath
 * @returns {void}
 */
const setupDotenvFile = filePath => {
  const dotenvInitial = setupDotenv.config({ path: filePath });
  dotenvExpand(dotenvInitial);
};

/**
 * Set an array of dotenv params
 *
 * @param {Array<{param: string, value: string, ignoreIfSet: boolean}>} params
 */
const setDotenvParam = (params = []) => {
  params.forEach(({ param, value, ignoreIfSet } = {}) => {
    if (ignoreIfSet && process.env[param]) {
      return;
    }

    process.env[param] = value;
  });
};

/**
 * A function for use with non-webpack configurations. Set up and access local and specific dotenv file parameters.
 * dotenv parameters are string based, failed or missing dotenv parameters return an empty string.
 *
 * @param {object} params
 * @param {string} params.env
 * @param {string} [params.relativePath=<OPTIONS.contextPath>]
 * @param {string} [params.dotenvNamePrefix=BUILD] Add an internal prefix to dotenv parameters used for configuration to avoid overlap.
 * @param {boolean} [params.setBuildDefaults=true]
 * @param {boolean} [params.isMessaging=false]
 * @param {boolean} [params.setExposedParams=false] Ignore the potential for dotenv parameter overlap and attempt to set non-prefixed configuration parameters if not already set.
 * @param {object} settings
 * @param {object} settings.consoleMessage
 * @param {Function} settings.setDotenvParam
 * @param {Function} settings.setupDotenvFile
 * @returns {object}
 */
const setupDotenvFilesForEnv = (
  {
    env,
    relativePath = OPTIONS.contextPath,
    dotenvNamePrefix = 'BUILD',
    setBuildDefaults = true,
    isMessaging = false,
    setExposedParams = false
  } = {},
  {
    consoleMessage: aliasConsoleMessage = consoleMessage,
    setDotenvParam: aliasSetDotenvParam = setDotenvParam,
    setupDotenvFile: aliasSetupDotenvFile = setupDotenvFile
  } = {}
) => {
  if (isMessaging) {
    aliasConsoleMessage.info(`Parsing dotenv files at: ${relativePath}`);
  }

  try {
    if (env) {
      aliasSetupDotenvFile(path.resolve(relativePath, `.env.${env}.local`));
      aliasSetupDotenvFile(path.resolve(relativePath, `.env.${env}`));
    }

    aliasSetupDotenvFile(path.resolve(relativePath, '.env.local'));
    aliasSetupDotenvFile(path.resolve(relativePath, '.env'));
  } catch (e) {
    aliasConsoleMessage.warn(`setupDotenvFilesForEnv: ${e.message}`);
  }

  if (setBuildDefaults) {
    // Core Build
    const APP_INDEX_PREFIX =
      process.env[`${dotenvNamePrefix}_APP_INDEX_PREFIX`] || process.env.APP_INDEX_PREFIX || 'index';
    const DIST_DIR = path.resolve(
      relativePath,
      process.env[`${dotenvNamePrefix}_DIST_DIR`] || process.env.DIST_DIR || 'dist'
    );
    const HOST = process.env[`${dotenvNamePrefix}_HOST`] || process.env.HOST || 'localhost';
    const HTML_INDEX_DIR = path.resolve(
      relativePath,
      process.env[`${dotenvNamePrefix}_HTML_INDEX_DIR`] || process.env.HTML_INDEX_DIR || 'src'
    );
    const OPEN_PATH = process.env[`${dotenvNamePrefix}_OPEN_PATH`] || process.env.OPEN_PATH || '';
    const PORT = process.env[`${dotenvNamePrefix}_PORT`] || process.env.PORT || '3000';
    const PUBLIC_PATH =
      process.env[`${dotenvNamePrefix}_PUBLIC_PATH`] ||
      process.env.PUBLIC_PATH ||
      process.env[`${dotenvNamePrefix}_PUBLIC_URL`] ||
      process.env.PUBLIC_URL ||
      '/';
    const SRC_DIR = path.resolve(
      relativePath,
      process.env[`${dotenvNamePrefix}_SRC_DIR`] || process.env.SRC_DIR || 'src'
    );

    let STATIC_DIR = process.env[`${dotenvNamePrefix}_STATIC_DIR`] || process.env.STATIC_DIR || '';
    STATIC_DIR = (STATIC_DIR && path.resolve(relativePath, STATIC_DIR)) || STATIC_DIR;

    // Build Extras - Display name, HTML title
    const UI_NAME = process.env[`${dotenvNamePrefix}_UI_NAME`] || process.env.UI_NAME || '';

    /**
     * Note: Add dotenv parameters to your project's dotenv file(s) instead of adding additional
     * build specific dotenv parameters for webpack here.
     */

    if (!process.env.NODE_ENV && env) {
      if (isMessaging) {
        aliasConsoleMessage.info(`Setting NODE_ENV: ${env}`);
      }

      process.env.NODE_ENV = env;
    }

    aliasSetDotenvParam([
      { param: `_${dotenvNamePrefix}_APP_INDEX_PREFIX`, value: APP_INDEX_PREFIX },
      { param: `_${dotenvNamePrefix}_DIST_DIR`, value: DIST_DIR },
      { param: `_${dotenvNamePrefix}_ENV`, value: process.env.NODE_ENV },
      { param: `_${dotenvNamePrefix}_HOST`, value: HOST },
      { param: `_${dotenvNamePrefix}_HTML_INDEX_DIR`, value: HTML_INDEX_DIR },
      { param: `_${dotenvNamePrefix}_OPEN_PATH`, value: OPEN_PATH },
      { param: `_${dotenvNamePrefix}_PORT`, value: PORT },
      { param: `_${dotenvNamePrefix}_PUBLIC_PATH`, value: PUBLIC_PATH },
      { param: `_${dotenvNamePrefix}_RELATIVE_DIRNAME`, value: relativePath },
      { param: `_${dotenvNamePrefix}_SRC_DIR`, value: SRC_DIR },
      { param: `_${dotenvNamePrefix}_STATIC_DIR`, value: STATIC_DIR },
      { param: `_${dotenvNamePrefix}_UI_NAME`, value: UI_NAME }
    ]);

    if (setExposedParams) {
      aliasSetDotenvParam([
        { param: `APP_INDEX_PREFIX`, value: APP_INDEX_PREFIX, ignoreIfSet: true },
        { param: `DIST_DIR`, value: DIST_DIR, ignoreIfSet: true },
        { param: `HOST`, value: HOST, ignoreIfSet: true },
        { param: `HTML_INDEX_DIR`, value: HTML_INDEX_DIR, ignoreIfSet: true },
        { param: `OPEN_PATH`, value: OPEN_PATH, ignoreIfSet: true },
        { param: `PORT`, value: PORT, ignoreIfSet: true },
        { param: `PUBLIC_PATH`, value: PUBLIC_PATH, ignoreIfSet: true },
        { param: `RELATIVE_DIRNAME`, value: relativePath, ignoreIfSet: true },
        { param: `SRC_DIR`, value: SRC_DIR, ignoreIfSet: true },
        { param: `STATIC_DIR`, value: STATIC_DIR, ignoreIfSet: true },
        { param: `UI_NAME`, value: UI_NAME, ignoreIfSet: true }
      ]);
    }
  }

  return process.env;
};

/**
 * Package for lib
 *
 * @type {{setupDotenvFilesForEnv: setupDotenvFilesForEnv, setupWebpackDotenvFilesForEnv: setupWebpackDotenvFilesForEnv }}
 */
const dotenv = { setupDotenvFilesForEnv, setupWebpackDotenvFilesForEnv };

module.exports = {
  dotenv,
  setDotenvParam,
  setupWebpackDotenvFile,
  setupWebpackDotenvFilesForEnv,
  setupDotenvFile,
  setupDotenvFilesForEnv
};
