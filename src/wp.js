const path = require('path');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const { rimrafSync } = require('rimraf');
const { merge } = require('webpack-merge');
const { createFile, dynamicImport, errorMessageHandler, isPromise, OPTIONS } = require('./global');
const { consoleMessage } = require('./logger');
const { common, development, production } = require('./wpConfigs');

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

/**
 * Webpack merge base configuration files. If available merge extended configuration files.
 *
 * @param {object} options
 * @param {string} options.nodeEnv
 * @param {object} options.dotenv
 * @param {Array<string>} options.extendedConfigs
 * @returns {Promise<object>}
 */
const createWpConfig = async ({ nodeEnv, dotenv = {}, extendedConfigs } = OPTIONS) => {
  const baseConfigs = [common(), (nodeEnv === 'development' && development()) || production()];
  const extended = [];

  if (Array.isArray(extendedConfigs) && extendedConfigs?.length) {
    const result = await Promise.allSettled(extendedConfigs.map(arg => dynamicImport(arg)));

    // Filter initial file results for fulfilled and actual values
    const filteredResults = result.filter(({ status, value }, index) => {
      const isFulfilled = status === 'fulfilled';
      const isValue = !!value;

      if (!isFulfilled || !isValue) {
        consoleMessage.warn(`Error loading, ${extendedConfigs[index]}`);
      }

      return isFulfilled && isValue;
    });

    // Run subsequent response promises, functions, or results again
    const parsedResults = await Promise.allSettled(
      filteredResults.map(({ value }) => {
        const defaultValue = value?.default || value;

        if (isPromise(defaultValue) || typeof defaultValue === 'function') {
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
          const isValue = !!value;

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
 * @param {undefined|string} options.statsFile
 * @param {undefined|string} options.statsPath
 */
const startWpErrorStatsHandler = (err, stats, { statsFile, statsPath } = OPTIONS) => {
  if (err) {
    consoleMessage.error('Production build errors...', errorMessageHandler(err));
    return;
  }

  if (stats?.toJson && statsFile && statsPath) {
    createFile(JSON.stringify(stats.toJson(), null, 2), {
      dir: statsPath,
      filename: statsFile
    });
    consoleMessage.success('Stats file created');
  }

  if (stats?.hasErrors && stats.hasErrors()) {
    const compileErrors = errorMessageHandler(stats?.compilation?.errors);

    consoleMessage.error(
      'Production compile errors...',
      ...((Array.isArray(compileErrors) && compileErrors) || [compileErrors])
    );
    return;
  }

  if (stats?.toString) {
    consoleMessage.log(
      'Stats...',
      stats
        .toString()
        .split('\n')
        .map(v => (!/^\s/.test(v) && ` * ${v}`) || `  ${v}`)
        .join('\n')
    );
  }

  consoleMessage.success('Build completed');
};

/**
 * Start webpack development or production.
 *
 * @param {object} webpackConfig
 * @param {object} options
 * @param {string} options.nodeEnv
 * @param {object} settings
 * @param {Function} settings.startWpErrorStatsHandler
 * @param {Function} settings.webpack
 * @param {Function} settings.WebpackDevServer
 * @returns {Promise<void>}
 */
const startWp = async (
  webpackConfig,
  { nodeEnv } = OPTIONS,
  {
    startWpErrorStatsHandler: aliasStartWpErrorStatsHandler = startWpErrorStatsHandler,
    webpack: aliasWebpack = webpack,
    WebpackDevServer: AliasWebpackDevServer = WebpackDevServer
  } = {}
) => {
  if (webpackConfig?.devServer && nodeEnv === 'development') {
    consoleMessage.info('Development starting....');
    const compiler = aliasWebpack(webpackConfig);
    const server = new AliasWebpackDevServer(webpackConfig.devServer, compiler);
    await server.start();
    return;
  }

  consoleMessage.info('Production build starting....');

  aliasWebpack(webpackConfig, (err, stats) => {
    aliasStartWpErrorStatsHandler(err, stats);
  });
};

module.exports = {
  cleanDist,
  createWpConfig,
  merge,
  startWp,
  startWpErrorStatsHandler
};
