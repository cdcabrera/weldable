const { OPTIONS } = require('./global');
const { cleanDist, createWpConfig, startWp } = require('./wp');
const { createTsConfig } = require('./ts');

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
 * @returns {Promise<void>}
 */
const weldable = async ({ isCreateTsConfigOnly } = OPTIONS) => {
  createTsConfig();

  if (isCreateTsConfigOnly) {
    return;
  }

  const webpackConfig = await createWpConfig();
  cleanDist();
  await startWp(webpackConfig);
};

module.exports = { weldable, OPTIONS };
