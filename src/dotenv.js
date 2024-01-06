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
 * A function for use with non-webpack configurations. Set up and access local and specific dotenv file parameters.
 * Failed or missing parameters return an empty string.
 *
 * @param {object} params
 * @param {string} params.env
 * @param {string} params.relativePath
 * @param {string} params.dotenvNamePrefix
 * @param {boolean} params.setBuildDefaults
 * @param {boolean} params.isMessaging
 * @returns {object}
 */
const setupDotenvFilesForEnv = ({
  env,
  relativePath,
  dotenvNamePrefix = 'BUILD',
  setBuildDefaults = true,
  isMessaging = false
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
    const DIST_DIR = path.resolve(
      relativePath,
      process.env[`${dotenvNamePrefix}_DIST_DIR`] || process.env.DIST_DIR || 'dist'
    );
    const HOST = process.env[`${dotenvNamePrefix}_HOST`] || process.env.HOST || 'localhost';
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
    const STATIC_DIR = path.resolve(
      relativePath,
      process.env[`${dotenvNamePrefix}_STATIC_DIR`] || process.env.STATIC_DIR || 'public'
    );

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

    process.env[`_${dotenvNamePrefix}_ENV`] = process.env.NODE_ENV;
    process.env[`_${dotenvNamePrefix}_STATIC_DIR`] = STATIC_DIR;
    process.env[`_${dotenvNamePrefix}_RELATIVE_DIRNAME`] = relativePath;
    process.env[`_${dotenvNamePrefix}_OPEN_PATH`] = OPEN_PATH;
    process.env[`_${dotenvNamePrefix}_PUBLIC_PATH`] = PUBLIC_PATH;
    process.env[`_${dotenvNamePrefix}_SRC_DIR`] = SRC_DIR;
    process.env[`_${dotenvNamePrefix}_DIST_DIR`] = DIST_DIR;
    process.env[`_${dotenvNamePrefix}_HOST`] = HOST;
    process.env[`_${dotenvNamePrefix}_PORT`] = PORT;
    process.env[`_${dotenvNamePrefix}_UI_NAME`] = UI_NAME;
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
  setupWebpackDotenvFile,
  setupWebpackDotenvFilesForEnv,
  setupDotenvFile,
  setupDotenvFilesForEnv
};
