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
 * @param {boolean} options.isCreateTsConfig
 * @param {boolean} options.isMergeTsConfig
 * @param {boolean} options.isRegenTsConfig
 * @param {object} settings
 * @param {string} settings.configFilename
 * @param {object} settings.consoleMessage
 * @param {Function} settings.createFile
 * @param {boolean} settings.isMessaging Helps with standalone configuration
 * @returns {undefined|{compilerOptions: {noEmit: boolean, allowJs: boolean, outDir: string}}}
 */
const createTsConfig = (
  { _BUILD_DIST_DIR: DIST_DIR } = OPTIONS.dotenv || {},
  { baseTsConfig, contextPath, isCreateTsConfig, isMergeTsConfig, isRegenTsConfig } = OPTIONS,
  {
    configFilename = 'tsconfig.json',
    consoleMessage: aliasConsoleMessage = consoleMessage,
    createFile: aliasCreateFile = createFile,
    isMessaging = true
  } = {}
) => {
  const currentConfigPath = path.join(contextPath, configFilename);
  const isCurrentConfig = fs.existsSync(currentConfigPath);

  if (isCurrentConfig && isMessaging) {
    aliasConsoleMessage.info(`Current ${configFilename} found: ${currentConfigPath}`);
  }

  if (!isCreateTsConfig) {
    if (isMessaging) {
      aliasConsoleMessage.info(`Ignoring ${configFilename}`);
    }

    return undefined;
  }

  let currentConfig;
  let presetConfig;

  if (isMergeTsConfig) {
    try {
      currentConfig = require(currentConfigPath);
    } catch (e) {
      if (isMessaging) {
        aliasConsoleMessage.warn(`No ${configFilename} found.`);
      }
    }
  }

  if (baseTsConfig) {
    try {
      presetConfig = require(`@tsconfig/${baseTsConfig}/${configFilename}`);
    } catch (e) {
      if (isMessaging) {
        aliasConsoleMessage.warn(`No preset ${configFilename} specified, using basic properties only.`);
      }
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

  aliasCreateFile(`${JSON.stringify(customTsConfig, null, 2)}\n`, {
    dir: contextPath,
    filename: configFilename
  });

  if (isCreateTsConfig && isMessaging) {
    aliasConsoleMessage.success(
      `${(isMergeTsConfig && 'Merged') || (isRegenTsConfig && 'Regenerated') || 'Created'} config: ${path.join(
        contextPath,
        configFilename
      )}`
    );
  }

  return customTsConfig;
};

module.exports = {
  createTsConfig
};
