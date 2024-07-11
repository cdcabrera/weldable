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
 * @param {object} settings
 * @param {Function} settings.cleanDist
 * @param {Function} settings.createTsConfig
 * @param {Function} settings.createWpConfig
 * @param {Function} settings.standalone
 * @param {Function} settings.startWp
 * @returns {Promise<void>}
 */
const weldable = async (
  { isCreateTsConfigOnly, isStandalone } = OPTIONS,
  {
    cleanDist: aliasCleanDist = cleanDist,
    createTsConfig: aliasCreateTsConfig = createTsConfig,
    createWpConfig: aliasCreateWpConfig = createWpConfig,
    standalone: aliasStandalone = standalone,
    startWp: aliasStartWp = startWp
  } = {}
) => {
  if (isStandalone) {
    aliasStandalone();
    return;
  }

  aliasCreateTsConfig();

  if (isCreateTsConfigOnly) {
    return;
  }

  const webpackConfig = await aliasCreateWpConfig();
  aliasCleanDist();
  await aliasStartWp(webpackConfig);
};

module.exports = { weldable, OPTIONS };
