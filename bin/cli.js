#!/usr/bin/env node

const yargs = require('yargs');
const packageJson = require('../package');

/**
 * Setup yargs
 */
yargs
  .usage('Use a webpack configuration for development and production.\n\nUsage: weldable [options]')
  .help('help')
  .alias('h', 'help')
  .version('version', packageJson.version)
  .alias('v', 'version')
  .wrap(yargs.terminalWidth()).argv;
