const path = require('path');
const setupDotenv = require('dotenv');
const { expand: dotenvExpand } = require('dotenv-expand');
const { consoleMessage } = require('./logger');

/**
 * @module dotenv
 */

/**
 * Set up a webpack dotenv plugin config.
 *
 * @param {string} filePath
 * @returns {undefined|*}
 */
const setupWebpackDotenvFile = filePath => {
  const settings = {
    systemvars: true,
    silent: true
  };

  if (filePath) {
    settings.path = filePath;
  }

  try {
    // eslint-disable-next-line global-require
    const DotEnv = require('dotenv-webpack');
    return new DotEnv(settings);
  } catch (e) {
    consoleMessage.warn(`Failed loading dotenv-webpack package: ${e.message}`);
  }

  return undefined;
};

/**
 * For use with webpack configurations. Set up multiple webpack dotenv file parameters.
 *
 * @param {object} params
 * @param {string} params.directory
 * @param {string} params.env
 * @returns {Array}
 */
const setupWebpackDotenvFilesForEnv = ({ directory = '', env } = {}) => {
  const dotenvWebpackSettings = [];

  if (env) {
    dotenvWebpackSettings.push(setupWebpackDotenvFile(path.resolve(directory, `.env.${env}.local`)));
    dotenvWebpackSettings.push(setupWebpackDotenvFile(path.resolve(directory, `.env.${env}`)));
  }

  dotenvWebpackSettings.push(setupWebpackDotenvFile(path.resolve(directory, '.env.local')));
  dotenvWebpackSettings.push(setupWebpackDotenvFile(path.resolve(directory, '.env')));

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
 * @param {string} params.relativePath
 * @param {string} params.dotenvNamePrefix Add an internal prefix to dotenv parameters used for configuration to avoid overlap.
 * @param {boolean} params.setBuildDefaults
 * @param {boolean} params.isMessaging
 * @param {boolean} params.setExposedParams Ignore the potential for dotenv parameter overlap and attempt to set non-prefixed configuration parameters if not already set.
 * @returns {object}
 */
const setupDotenvFilesForEnv = ({
  env,
  relativePath,
  dotenvNamePrefix = 'BUILD',
  setBuildDefaults = true,
  isMessaging = false,
  setExposedParams = false
} = {}) => {
  if (isMessaging) {
    consoleMessage.info(`Parsing dotenv files at: ${relativePath}`);
  }

  if (env) {
    setupDotenvFile(path.resolve(relativePath, `.env.${env}.local`));
    setupDotenvFile(path.resolve(relativePath, `.env.${env}`));
  }

  setupDotenvFile(path.resolve(relativePath, '.env.local'));
  setupDotenvFile(path.resolve(relativePath, '.env'));

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
        consoleMessage.info(`Setting NODE_ENV: ${env}`);
      }

      process.env.NODE_ENV = env;
    }

    setDotenvParam([
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
      setDotenvParam([
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
