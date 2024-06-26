#!/usr/bin/env node

const path = require('path');
const yargs = require('yargs');
const packageJson = require('../package');
const { weldable, OPTIONS } = require('../src');
const { setupDotenvFilesForEnv } = require('../src/dotenv');

/**
 * Setup yargs
 */
const {
  env: nodeEnv,
  extend: extendedConfigs,
  loader,
  stats,
  statsFile,
  tsconfig: baseTsConfig,
  'tsconfig-opt': tsConfigOptions
} = yargs
  .usage('Use a webpack configuration for development and production.\n\nUsage: weldable [options]')
  .help('help')
  .alias('h', 'help')
  .version('version', packageJson.version)
  .alias('v', 'version')
  .wrap(yargs.terminalWidth())
  .option('e', {
    alias: 'env',
    describe: 'Use a default configuration type if NODE_ENV is not set to the available choices.',
    type: 'string',
    choices: ['development', 'production'],
    default: 'production'
  })
  .option('l', {
    alias: 'loader',
    describe:
      'Preprocess loader, use the classic JS (babel-loader), TS (ts-loader), or "none" to use webpack defaults, or a different loader.',
    type: 'string',
    choices: ['none', 'js', 'ts'],
    default: 'js'
  })
  .option('s', {
    alias: 'stats',
    describe: 'Stats output level for NodeJS API',
    type: 'string',
    choices: ['errors-only', 'errors-warnings', 'minimal', 'none', 'normal', 'verbose', 'detailed', 'summary'],
    default: 'normal'
  })
  .option('statsFile', {
    describe:
      'Output JSON webpack bundle stats. Use the default, or a relative project path and filename [./stats.json]',
    type: 'string',
    coerce: args => (!args && './stats.json') || args
  })
  .option('tsconfig', {
    describe:
      'Generate a base tsconfig from NPM @tsconfig/[base]. An existing tsconfig.json will override this option, see tsconfig-opt. This option can be run without running webpack.',
    type: 'string',
    choices: ['', 'create-react-app', 'node18', 'node20', 'react-native', 'recommended', 'strictest']
  })
  .option('tsconfig-opt', {
    describe: 'Regenerate or merge a tsconfig',
    type: 'string',
    choices: ['merge', 'regen'],
    implies: 'tsconfig',
    coerce: args => (!args && 'regen') || args
  })
  .option('x', {
    alias: 'extend',
    describe:
      'Extend, or override, the default configs with your own relative path webpack configs using webpack merge.',
    requiresArg: true,
    type: 'array',
    coerce: args => args.flat()
  }).argv;

/**
 * Set global OPTIONS
 *
 * @type {{statsFile: string, dotenv: object, isRegenTsConfig: boolean, isCreateTsConfig: boolean,
 *     stats: string, loader: string, isCreateTsConfigOnly: boolean, baseTsConfig: string, extendedConfigs: Array<string>,
 *     isMergeTsConfig: boolean, statsPath: string, nodeEnv: string}}
 * @private
 */
OPTIONS._set = {
  baseTsConfig,
  nodeEnv,
  extendedConfigs: function () {
    return extendedConfigs?.map(configPath => path.join(this.contextPath, configPath));
  },
  dotenv: function () {
    if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'production') {
      this.nodeEnv = process.env.NODE_ENV;
    } else if (!process.env.NODE_ENV) {
      process.env.NODE_ENV = nodeEnv;
    }

    return setupDotenvFilesForEnv({
      env: process.env.NODE_ENV,
      relativePath: this.contextPath,
      isMessaging: true,
      setExposedParams: true
    });
  },
  isCreateTsConfig: function () {
    const isBaseTsConfig = typeof baseTsConfig === 'string';
    return (loader === 'ts' && isBaseTsConfig) || isBaseTsConfig;
  },
  isCreateTsConfigOnly: function () {
    const isBaseTsConfig = typeof baseTsConfig === 'string';
    return (loader !== 'ts' && isBaseTsConfig) || false;
  },
  isMergeTsConfig: function () {
    return tsConfigOptions === 'merge';
  },
  isRegenTsConfig: function () {
    return tsConfigOptions === 'regen';
  },
  loader,
  stats,
  statsFile: function () {
    return (statsFile && path.basename(statsFile)) || undefined;
  },
  statsPath: function () {
    return (statsFile && this.contextPath) || undefined;
  }
};

/**
 * Expose options for testing or continue.
 */
if (process.env._WELDABLE_TEST === 'true') {
  process.stdout.write(JSON.stringify(OPTIONS));
} else {
  weldable();
}
