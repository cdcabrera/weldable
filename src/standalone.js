const fs = require('fs');
const path = require('path');
const { dependencies } = require('../package.json');
const { createFile, jsFileExtensions, OPTIONS, runCmd, tsFileExtensions } = require('./global');
const dotenvFile = require('./dotenv');
const wpConfigsFile = require('./wpConfigs');
const { createTsConfig } = require('./ts');
const { consoleMessage } = require('./logger');

/**
 * @module standalone
 */

/**
 * Create a basic standalone tsconfig if isCreateTsConfig is false.
 * This can be overridden with CLI options, or if a tsconfig already exists.
 *
 * @param {object} aliasOptions
 * @param {boolean} aliasOptions.isCreateTsConfig
 * @param {string} aliasOptions.loader
 * @param {object} settings
 * @param {string} settings.configFilename
 * @param {object} settings.consoleMessage
 * @param {Function} settings.createTsConfig
 */
const createStandaloneTsConfig = (
  aliasOptions = OPTIONS,
  {
    configFilename = 'tsconfig.json',
    consoleMessage: aliasConsoleMessage = consoleMessage,
    createTsConfig: aliasCreateTsConfig = createTsConfig
  } = {}
) => {
  const { contextPath, loader } = aliasOptions;

  if (loader !== 'ts') {
    return;
  }

  aliasConsoleMessage.info(`  Adding ${configFilename}...`);

  if (fs.existsSync(path.join(contextPath, configFilename))) {
    aliasConsoleMessage.warn(`    ${configFilename} already exists, ignoring`);
    return;
  }

  aliasCreateTsConfig(undefined, aliasOptions, { isMessaging: false });
};

/**
 * Output a basic index file.
 *
 * @returns {string}
 */
const outputStandaloneSrcIndexFile = () => `
(() => {
  const body = document.querySelector('BODY');
  const div = document.createElement('div');
  div.innerText = 'Hello world!';
  body?.appendChild(div);
})();
`;

/**
 * Create a src/index file for webpack app entry.
 *
 * @param {object} options
 * @param {string} options.contextPath
 * @param {string} options.loader
 * @param {object} settings
 * @param {string} settings.filename
 * @param {object} settings.consoleMessage
 * @param {Function} settings.createFile
 * @param {Array<string>} settings.jsFileExtensions
 * @param {Array<string>} settings.tsFileExtensions
 * @param {Function} settings.outputStandaloneSrcIndexFile
 */
const createStandaloneSrcIndexFile = (
  { contextPath, loader } = OPTIONS,
  {
    filename = 'index',
    consoleMessage: aliasConsoleMessage = consoleMessage,
    createFile: aliasCreateFile = createFile,
    jsFileExtensions: aliasJsFileExtensions = jsFileExtensions,
    outputStandaloneSrcIndexFile: aliasOutputStandaloneSrcIndexFile = outputStandaloneSrcIndexFile,
    tsFileExtensions: aliasTsFileExtensions = tsFileExtensions
  } = {}
) => {
  const updatedFileName = `${filename}.${(loader === 'ts' && 'ts') || 'js'}`;
  const contextSrcPath = path.join(contextPath, 'src');

  aliasConsoleMessage.info(`  Adding src/${updatedFileName}...`);

  const allExistingIndexFiles = [...aliasTsFileExtensions, ...aliasJsFileExtensions]
    .map(ext => `${filename}.${ext}`)
    .filter(file => fs.existsSync(path.join(contextSrcPath, file)));

  if (allExistingIndexFiles.length) {
    aliasConsoleMessage.warn(
      `    Existing ${filename} exists, ignoring`,
      `    * ${allExistingIndexFiles.join('\n    * ')}`
    );
    return;
  }

  aliasCreateFile(aliasOutputStandaloneSrcIndexFile().trimStart(), {
    dir: contextSrcPath,
    filename: updatedFileName
  });
};

/**
 * Output a file complete webpack configuration
 *
 * @param {object} options
 * @param {string} options.loader
 * @param {object} settings
 * @param {Function} settings.common
 * @param {Function} settings.development
 * @param {Function} settings.preprocessLoaderJs
 * @param {Function} settings.preprocessLoaderTs
 * @param {Function} settings.preprocessLoaderNone
 * @param {Function} settings.production
 * @param {Function} settings.setDotenvParam
 * @param {Function} settings.setupWebpackDotenvFile
 * @param {Function} settings.setupWebpackDotenvFilesForEnv
 * @param {Function} settings.setupDotenvFile
 * @param {Function} settings.setupDotenvFilesForEnv
 * @param {Array<string>} settings.jsFileExtensions
 * @param {Array<string>} settings.tsFileExtensions
 * @returns {string}
 */
const outputStandaloneWebpackConfig = (
  { loader } = OPTIONS,
  {
    common,
    development,
    preprocessLoaderJs,
    preprocessLoaderTs,
    preprocessLoaderNone,
    production,
    setDotenvParam,
    setupWebpackDotenvFile,
    setupWebpackDotenvFilesForEnv,
    setupDotenvFile,
    setupDotenvFilesForEnv,
    jsFileExtensions: aliasJsFileExtensions = jsFileExtensions,
    tsFileExtensions: aliasTsFileExtensions = tsFileExtensions
  } = { ...dotenvFile, ...wpConfigsFile }
) => `
const fs = require('fs');
const path = require('path');
const setupDotenv = require('dotenv');
const { expand: dotenvExpand } = require('dotenv-expand');
const { merge } = require('webpack-merge');
const CopyPlugin = require('copy-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlReplaceWebpackPlugin = require('html-replace-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const SvgToMiniDataURI = require('mini-svg-data-uri');
const TerserJSPlugin = require('terser-webpack-plugin');
const cssLoaderResolve = require.resolve('css-loader');
${(loader === 'js' && `const babelLoaderResolve = require.resolve('babel-loader');`) || (loader === 'ts' && `const tsLoaderResolve = require.resolve('ts-loader');`) || ''}
${(loader === 'js' && `const babelPresetEnvResolve = require.resolve('@babel/preset-env');\n`) || ''}
/**
 * Set globals
 */
const contextPath = process.cwd();
const loader = '${loader}';
const consoleMessage = console;
const jsFileExtensions = ['${aliasJsFileExtensions.join("', '")}'];
const tsFileExtensions = ['${aliasTsFileExtensions.join("', '")}'];

/**
 * Set dependency injected options
 */
const OPTIONS = {
  nodeEnv: undefined,
  contextPath,
  dotenv: undefined,
  loader
};

/**
 * Set dotenv functions
 */
const ${setDotenvParam.name} = ${setDotenvParam.toString()};

const ${setupWebpackDotenvFile.name} = ${setupWebpackDotenvFile.toString()};

const ${setupWebpackDotenvFilesForEnv.name} = ${setupWebpackDotenvFilesForEnv.toString()};

const ${setupDotenvFile.name} = ${setupDotenvFile.toString()};

const ${setupDotenvFilesForEnv.name} = ${setupDotenvFilesForEnv.toString()};

/**
 * Create dotenv params
 */
const dotenv = setupDotenvFilesForEnv({ env: process.env.NODE_ENV || 'production' });

/**
 * Set dotenv dependency injected options
 */
 OPTIONS.nodeEnv = dotenv.NODE_ENV;
 OPTIONS.dotenv = dotenv;

/**
 * Set preprocess loader webpack configuration
 */
const preprocessLoader = ${(loader === 'js' && preprocessLoaderJs.toString()) || (loader === 'ts' && preprocessLoaderTs.toString()) || preprocessLoaderNone.toString()};

/**
 * Set common webpack configuration
 */
const ${common.name} = ${common.toString()};

/**
 * Set development webpack configuration
 */
const ${development.name} = ${development.toString()};

/**
 * Set production webpack configuration
 */
const ${production.name} = ${production.toString()};

/**
 * Create a webpack configuration. Modify and/or add your own configurations with "webpack merge".
 */
module.exports = merge(
  common(),
  preprocessLoader(),
  (OPTIONS.nodeEnv === 'development' && development()) || production()
);
`;

/**
 * Update package.json, and conditionally a babel config, in the consuming project root.
 *
 * @param {object} options
 * @param {string} options.contextPath
 * @param {object} settings
 * @param {string} settings.filename
 * @param {object} settings.consoleMessage
 * @param {Function} settings.createFile
 * @param {Function} settings.outputStandaloneWebpackConfig
 */
const createStandaloneWebpackConfig = (
  { contextPath } = OPTIONS,
  {
    filename = 'webpack.config.js',
    consoleMessage: aliasConsoleMessage = consoleMessage,
    createFile: aliasCreateFile = createFile,
    outputStandaloneWebpackConfig: aliasOutputStandaloneWebpackConfig = outputStandaloneWebpackConfig
  } = {}
) => {
  const filePath = path.join(contextPath, filename);
  aliasConsoleMessage.info('  Adding webpack configuration...');

  if (fs.existsSync(filePath)) {
    aliasConsoleMessage.warn(
      `    ${filename} already exists, ignoring`,
      "    If you want weldable to create a webpack config you'll need to remove/rename the file and rerun the option"
    );

    return;
  }

  aliasCreateFile(aliasOutputStandaloneWebpackConfig().trimStart(), {
    filename
  });
};

/**
 * Output a basic package.json
 *
 * @returns {string}
 */
const outputStandalonePackageJson = () => `
{
  "name": "temporary-app-name",
  "version": "0.1.0"
}
`;

/**
 * Update package.json, and conditionally a babel config, in the consuming project root.
 *
 * @param {object} options
 * @param {string} options.contextPath
 * @param {string} options.loader
 * @param {object} settings
 * @param {object} settings.consoleMessage
 * @param {Function} settings.createFile
 * @param {boolean} settings.isTestMode
 * @param {string} settings.packageFileName
 * @param {Function} settings.outputStandalonePackageJson
 * @param {Function} settings.runCmd
 * @param {string} settings.webpackFileName
 */
const createStandalonePackageJson = (
  { contextPath, loader } = OPTIONS,
  {
    consoleMessage: aliasConsoleMessage = consoleMessage,
    createFile: aliasCreateFile = createFile,
    isTestMode = process.env.NODE_ENV === 'test',
    packageFileName = 'package.json',
    outputStandalonePackageJson: aliasOutputStandalonePackageJson = outputStandalonePackageJson,
    runCmd: aliasRunCmd = runCmd,
    webpackFileName = 'webpack.config.js'
  } = {}
) => {
  const consumerPackageJsonPath = path.join(contextPath, packageFileName);
  const webpackResources = ['webpack', 'webpack-cli', 'webpack-dev-server'];
  const preprocessLoaderResources =
    (loader === 'js' && ['@babel/core', 'babel-loader', '@babel/preset-env']) ||
    (loader === 'ts' && ['ts-loader', 'typescript']) ||
    [];
  const baseConfigResources = [
    'dotenv',
    'dotenv-expand',
    'dotenv-webpack',
    'webpack-merge',
    'copy-webpack-plugin',
    'css-minimizer-webpack-plugin',
    'html-webpack-plugin',
    'html-replace-webpack-plugin',
    'mini-css-extract-plugin',
    'mini-svg-data-uri',
    'terser-webpack-plugin',
    'css-loader'
  ];

  // Create basic package.json if it doesn't exist
  aliasConsoleMessage.info(`  Adding ${packageFileName}...`);

  if (fs.existsSync(consumerPackageJsonPath)) {
    aliasConsoleMessage.warn(`    ${packageFileName} already exists, ignoring`);
  } else {
    aliasCreateFile(aliasOutputStandalonePackageJson(), {
      filename: packageFileName
    });
  }

  // Create basic build and start scripts
  aliasConsoleMessage.info(`  Adding ${packageFileName} scripts...`);

  const consumerPackageJson = JSON.parse(fs.readFileSync(consumerPackageJsonPath, 'utf-8'));
  consumerPackageJson.scripts ??= {};
  consumerPackageJson.scripts['standalone:build'] = `export NODE_ENV=production; webpack --config ./${webpackFileName}`;
  consumerPackageJson.scripts['standalone:start'] =
    `export NODE_ENV=development; webpack serve --config ./${webpackFileName}`;

  aliasCreateFile(`${JSON.stringify(consumerPackageJson, null, 2)}\n`, { filename: packageFileName });

  aliasConsoleMessage.info('    $ npm run standalone:build');
  aliasConsoleMessage.info('    $ npm run standalone:start');

  // Install package versions used in Weldable
  aliasConsoleMessage.info(`  Adding ${packageFileName} developer dependencies...`);

  [...webpackResources, ...preprocessLoaderResources, ...baseConfigResources].forEach(resource => {
    if (dependencies[resource]) {
      aliasConsoleMessage.info(`    * ${resource}@${(isTestMode && 'X.X.X') || dependencies[resource]}`);
      aliasRunCmd(`cd ${contextPath} && npm install ${resource}@${dependencies[resource]} --save-dev`);
    }
  });
};

/**
 * Output a basic babel config file.
 *
 * @returns {string}
 */
const outputStandaloneBabelConfig = () => `module.exports = {};\n`;

/**
 * Create a basic babel config
 *
 * @param {object} options
 * @param {string} options.contextPath
 * @param {string} options.loader
 * @param {object} settings
 * @param {object} settings.consoleMessage
 * @param {Function} settings.createFile
 * @param {string} settings.filename
 * @param {Function} settings.outputStandaloneBabelConfig
 */
const createStandaloneBabelConfig = (
  { contextPath, loader } = OPTIONS,
  {
    consoleMessage: aliasConsoleMessage = consoleMessage,
    createFile: aliasCreateFile = createFile,
    filename = 'babel.config.js',
    outputStandaloneBabelConfig: aliasOutputStandaloneBabelConfig = outputStandaloneBabelConfig
  } = {}
) => {
  if (loader !== 'js') {
    return;
  }

  aliasConsoleMessage.info('  Adding babel configuration...');

  if (fs.existsSync(path.join(contextPath, filename))) {
    aliasConsoleMessage.warn(`    ${filename} already exists, ignoring`);
    return;
  }

  aliasCreateFile(aliasOutputStandaloneBabelConfig().trimStart(), {
    filename
  });
};

/**
 * Organize and output a basic webpack configuration.
 *
 * @param {object} settings
 * @param {object} settings.consoleMessage
 * @param {Function} settings.createStandaloneBabelConfig
 * @param {Function} settings.createStandaloneSrcIndexFile
 * @param {Function} settings.createStandaloneTsConfig
 * @param {Function} settings.createStandalonePackageJson
 * @param {Function} settings.createStandaloneWebpackConfig
 */
const standalone = ({
  consoleMessage: aliasConsoleMessage = consoleMessage,
  createStandaloneBabelConfig: aliasCreateStandaloneBabelConfig = createStandaloneBabelConfig,
  createStandaloneSrcIndexFile: aliasCreateStandaloneSrcIndexFile = createStandaloneSrcIndexFile,
  createStandaloneTsConfig: aliasCreateStandaloneTsConfig = createStandaloneTsConfig,
  createStandalonePackageJson: aliasCreateStandalonePackageJson = createStandalonePackageJson,
  createStandaloneWebpackConfig: aliasCreateStandaloneWebpackConfig = createStandaloneWebpackConfig
} = {}) => {
  aliasConsoleMessage.warn('Creating weldable standalone updates...');

  aliasCreateStandaloneWebpackConfig();
  aliasCreateStandaloneBabelConfig();
  aliasCreateStandaloneSrcIndexFile();
  aliasCreateStandaloneTsConfig();
  aliasCreateStandalonePackageJson();

  aliasConsoleMessage.warn('Completed.');
};

module.exports = {
  standalone,
  createStandaloneBabelConfig,
  createStandalonePackageJson,
  createStandaloneSrcIndexFile,
  createStandaloneTsConfig,
  createStandaloneWebpackConfig,
  outputStandaloneBabelConfig,
  outputStandalonePackageJson,
  outputStandaloneSrcIndexFile,
  outputStandaloneWebpackConfig
};
