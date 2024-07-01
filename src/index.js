const { OPTIONS } = require('./global');
const { cleanDist, createWpConfig, startWp } = require('./wp');
const { createTsConfig } = require('./ts');
const { standalone } = require('./standalone');

/**
 * Start `weldable`
 *
 * @module Init
 */

/**
 * Organize package functionality.
 *
 * @param {object} options
 * @param {boolean} options.isCreateTsConfigOnly
 * @param {boolean} options.isStandalone
 * @returns {Promise<void>}
 */
const weldable = async ({ isCreateTsConfigOnly, isStandalone } = OPTIONS) => {
  if (isStandalone) {
    standalone();
    return;
  }

  createTsConfig();

  if (isCreateTsConfigOnly) {
    return;
  }

  const webpackConfig = await createWpConfig();
  cleanDist();
  await startWp(webpackConfig);
};

module.exports = { weldable, OPTIONS };
