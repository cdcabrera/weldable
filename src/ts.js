const fs = require('fs');
const path = require('path');
const { createFile, OPTIONS } = require('./global');
const { consoleMessage } = require('./logger');

/**
 * @module Typescript
 */

/**
 * Create, or merge, a tsconfig file.
 *
 * @param {object} dotenv
 * @param {string} dotenv._BUILD_DIST_DIR
 * @param {object} options
 * @param {string} options.baseTsConfig
 * @param {string} options.contextPath
 * @param {boolean} options.isMergeTsConfig
 * @param {boolean} options.isRegenTsConfig
 * @param {string} options.language
 * @returns {undefined|{compilerOptions: {noEmit: boolean, allowJs: boolean, outDir: string}}}
 */
const createTsConfig = (
  { _BUILD_DIST_DIR: DIST_DIR } = OPTIONS.dotenv || {},
  { baseTsConfig, contextPath, isMergeTsConfig, isRegenTsConfig, language } = OPTIONS
) => {
  const currentConfigPath = path.join(contextPath, 'tsconfig.json');
  const isCurrentConfig = fs.existsSync(currentConfigPath);

  if (language !== 'ts' || (isCurrentConfig && !isRegenTsConfig && !isMergeTsConfig)) {
    return undefined;
  }

  let currentConfig;
  let presetConfig;

  if (isMergeTsConfig) {
    try {
      // eslint-disable-next-line global-require
      currentConfig = require(currentConfigPath);
    } catch (e) {
      consoleMessage.warn(`No current tsconfig.`);
    }
  }

  if (baseTsConfig) {
    try {
      // eslint-disable-next-line global-require
      presetConfig = require(`@tsconfig/${baseTsConfig}/tsconfig.json`);
    } catch (e) {
      consoleMessage.warn(`No base tsconfig specified, using basic properties only.`);
    }
  }

  const customTsConfig = {
    ...currentConfig,
    compilerOptions: {
      allowJs: true,
      noEmit: false,
      // strict: false,
      ...currentConfig?.compilerOptions,
      ...presetConfig?.compilerOptions,
      outDir: path.basename(DIST_DIR)
    }
  };

  createFile(`${JSON.stringify(customTsConfig, null, 2)}\n`, {
    dir: contextPath,
    filename: 'tsconfig.json'
  });

  return customTsConfig;
};

module.exports = {
  createTsConfig
};
