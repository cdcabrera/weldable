const path = require('path');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const { rimrafSync } = require('rimraf');
const { merge } = require('webpack-merge');
const { createFile, dynamicImport, errorMessageHandler, isPromise, OPTIONS } = require('./global');
const { color, consoleMessage } = require('./logger');
const { common, development, preprocessLoader, production } = require('./wpConfigs');

/**
 * @module webpack
 */

/**
 * Clean the "distribution" directory. Compensate for Webpack not cleaning output on development.
 *
 * @param {object} dotenv
 * @param {string} dotenv._BUILD_DIST_DIR
 */
const cleanDist = ({ _BUILD_DIST_DIR: DIST_DIR } = OPTIONS.dotenv || {}) => {
  rimrafSync(path.join(DIST_DIR, '*'), { glob: true });
};

// ToDo: review allowing mergeWithCustom
/**
 * Webpack merge base configuration files. If available merge extended configuration files.
 *
 * @param {object} options
 * @param {string} options.nodeEnv
 * @param {object} options.dotenv
 * @param {Array<string>} options.extendedConfigs
 * @param {object} settings
 * @param {Function} settings.consoleMessage
 * @param {Function} settings.dynamicImport
 * @param {Function} settings.isPromise
 * @param {Function} settings.webpackCommonConfig
 * @param {Function} settings.webpackDevelopmentConfig
 * @param {Function} settings.webpackPreprocessLoaderConfig
 * @param {Function} settings.webpackProductionConfig
 * @returns {Promise<object>}
 */
const createWpConfig = async (
  { nodeEnv, dotenv = {}, extendedConfigs } = OPTIONS,
  {
    consoleMessage: aliasConsoleMessage = consoleMessage,
    dynamicImport: aliasDynamicImport = dynamicImport,
    isPromise: aliasIsPromise = isPromise,
    webpackCommonConfig = common,
    webpackDevelopmentConfig = development,
    webpackPreprocessLoaderConfig = preprocessLoader,
    webpackProductionConfig = production
  } = {}
) => {
  const baseConfigs = [
    webpackCommonConfig(),
    webpackPreprocessLoaderConfig(),
    (nodeEnv === 'development' && webpackDevelopmentConfig()) || webpackProductionConfig()
  ];
  const extended = [];

  if (Array.isArray(extendedConfigs) && extendedConfigs?.length) {
    const result = await Promise.allSettled(extendedConfigs.map(arg => aliasDynamicImport(arg)));

    // Filter initial file results for fulfilled and actual values
    const filteredResults = result.filter(({ status, value }, index) => {
      const isFulfilled = status === 'fulfilled';
      const isValue = Boolean(value);

      if (!isFulfilled || !isValue) {
        aliasConsoleMessage.warn(`Error loading, ${extendedConfigs[index]}`);
      }

      return isFulfilled && isValue;
    });

    // Run subsequent response promises, functions, or results again
    const parsedResults = await Promise.allSettled(
      filteredResults.map(({ value }) => {
        const defaultValue = value?.default || value;

        if (aliasIsPromise(defaultValue) || typeof defaultValue === 'function') {
          return defaultValue(dotenv);
        }

        return defaultValue;
      })
    );

    // Filter the subsequent promise, functions, or results again
    extended.push(
      ...parsedResults
        .filter(({ status, value }) => {
          const isFulfilled = status === 'fulfilled';
          const isValue = Boolean(value);

          return isFulfilled && isValue;
        })
        .map(({ value }) => value)
    );
  }

  return merge(...baseConfigs, ...extended);
};

/**
 * webpack callback error and stats handler. Separated for testing.
 *
 * @param {*} err
 * @param {*} stats
 * @param {object} options
 * @param {undefined|string} options.stats
 * @param {undefined|string} options.statsFile
 * @param {undefined|string} options.statsPath
 * @param {object} settings
 * @param {object} settings.color
 * @param {Function} settings.consoleMessage
 * @param {Function} settings.createFile
 * @param {Function} settings.errorMessageHandler
 */
const startWpErrorStatsHandler = (
  err,
  stats,
  { stats: statsLevel, statsFile, statsPath } = OPTIONS,
  {
    color: aliasColor = color,
    consoleMessage: aliasConsoleMessage = consoleMessage,
    createFile: aliasCreateFile = createFile,
    errorMessageHandler: aliasErrorMessageHandler = errorMessageHandler
  } = {}
) => {
  if (err) {
    aliasConsoleMessage.error('Production build errors...', aliasErrorMessageHandler(err));

    return;
  }

  if (stats?.toJson && statsFile && statsPath) {
    aliasCreateFile(JSON.stringify(stats.toJson(statsLevel), null, 2), {
      dir: statsPath,
      filename: statsFile
    });
    aliasConsoleMessage.success('Stats file created');
  }

  if (stats?.hasErrors && stats.hasErrors()) {
    const compileErrors = aliasErrorMessageHandler(stats?.compilation?.errors);

    aliasConsoleMessage.error(
      'Production compile errors...',
      ...((Array.isArray(compileErrors) && compileErrors) || [compileErrors])
    );

    return;
  }

  if (stats?.toString) {
    const formattedStats = stats
      .toString(statsLevel)
      .split('\n')
      .map(v => (!/^\s*/.test(v) && ` * ${v}`) || `  ${v}`)
      .join('\n');

    aliasConsoleMessage.log(
      `Stats level ${aliasColor.YELLOW || ''}${statsLevel}${aliasColor.NOCOLOR || ''}...`,
      (formattedStats.trim() === '' && '  No stats output') || formattedStats
    );
  }

  aliasConsoleMessage.success('Build completed');
};

/**
 * Start webpack development or production.
 *
 * @param {object} webpackConfig
 * @param {object} options
 * @param {string} options.nodeEnv
 * @param {object} settings
 * @param {Function} settings.consoleMessage
 * @param {Function} settings.startWpErrorStatsHandler
 * @param {Function} settings.webpack
 * @param {Function} settings.WebpackDevServer
 * @returns {Promise<void>}
 */
const startWp = async (
  webpackConfig,
  { nodeEnv } = OPTIONS,
  {
    consoleMessage: aliasConsoleMessage = consoleMessage,
    startWpErrorStatsHandler: aliasStartWpErrorStatsHandler = startWpErrorStatsHandler,
    webpack: aliasWebpack = webpack,
    WebpackDevServer: AliasWebpackDevServer = WebpackDevServer
  } = {}
) => {
  if (webpackConfig?.devServer && nodeEnv === 'development') {
    aliasConsoleMessage.info('Development starting....');
    const compiler = aliasWebpack(webpackConfig);
    const server = new AliasWebpackDevServer(webpackConfig.devServer, compiler);

    await server.start();

    return;
  }

  aliasConsoleMessage.info('Production build starting....');

  aliasWebpack(webpackConfig, (err, stats) => {
    aliasStartWpErrorStatsHandler(err, stats);
  });
};

module.exports = {
  cleanDist,
  createWpConfig,
  startWp,
  startWpErrorStatsHandler
};
