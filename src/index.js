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
 * @returns {Promise<void>}
 */
const weldable = async () => {
  createTsConfig();
  const webpackConfig = await createWpConfig();
  cleanDist();
  await startWp(webpackConfig);
};

module.exports = { weldable, OPTIONS };
