const fs = require('fs');
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlReplaceWebpackPlugin = require('html-replace-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const SvgToMiniDataURI = require('mini-svg-data-uri');
const TerserJSPlugin = require('terser-webpack-plugin');
const { babelLoaderResolve, babelPresetEnvResolve, cssLoaderResolve, tsLoaderResolve } = require('../lib/packages');
const { jsFileExtensions, OPTIONS, tsFileExtensions } = require('./global');
const { consoleMessage } = require('./logger');
const { setupWebpackDotenvFilesForEnv } = require('./dotenv');

/**
 * @module webpackConfigs
 */

/**
 * Assumption based preprocess loader for JS
 *
 * @param {object} dotenv
 * @param {string} dotenv._BUILD_SRC_DIR
 * @param {object} settings
 * @param {Array<string>} settings.jsFileExtensions
 * @returns {{module: {rules: Array}}}
 */
const preprocessLoaderJs = (
  { _BUILD_SRC_DIR: SRC_DIR = '' } = OPTIONS.dotenv || {},
  { jsFileExtensions: aliasJsFileExtensions = jsFileExtensions } = {}
) => ({
  module: {
    rules: [
      {
        test: new RegExp(`\\.(${aliasJsFileExtensions.join('|')})?$`),
        include: [SRC_DIR],
        resolve: {
          // Dependent on loader resolutions this may, or may not, be necessary
          extensions: aliasJsFileExtensions.map(ext => `.${ext}`)
        },
        use: [
          {
            loader: babelLoaderResolve,
            options: {
              presets: [babelPresetEnvResolve]
            }
          }
        ]
      }
    ]
  }
});

/**
 * Assumption based preprocess loader for Typescript
 *
 * @param {object} dotenv
 * @param {string} dotenv._BUILD_SRC_DIR
 * @param {object} settings
 * @param {Array<string>} settings.jsFileExtensions
 * @param {Array<string>} settings.tsFileExtensions
 * @returns {{module: {rules: Array}}}
 */
const preprocessLoaderTs = (
  { _BUILD_SRC_DIR: SRC_DIR = '' } = OPTIONS.dotenv || {},
  {
    jsFileExtensions: aliasJsFileExtensions = jsFileExtensions,
    tsFileExtensions: aliasTsFileExtensions = tsFileExtensions
  } = {}
) => ({
  module: {
    rules: [
      {
        test: new RegExp(`\\.(${[...aliasTsFileExtensions, ...aliasJsFileExtensions].join('|')})?$`),
        include: [SRC_DIR],
        resolve: {
          // Dependent on loader resolutions this may, or may not, be necessary
          extensions: [...aliasTsFileExtensions, ...aliasJsFileExtensions].map(ext => `.${ext}`)
        },
        use: [
          {
            loader: tsLoaderResolve
          }
        ]
      }
    ]
  }
});

/**
 * Assumption based preprocess loader for none
 *
 * @returns {{module: {rules: Array}}}
 */
const preprocessLoaderNone = () => ({
  module: {
    rules: []
  }
});

/**
 * Assumption based preprocess loader
 *
 * @param {object} options
 * @param {string} options.loader
 * @returns {{module: {rules: Array}}}
 */
const preprocessLoader = ({ loader } = OPTIONS) => {
  switch (loader) {
    case 'js':
      return preprocessLoaderJs();
    case 'ts':
      return preprocessLoaderTs();
    default:
      return preprocessLoaderNone();
  }
};

/**
 * Common webpack settings between environments.
 *
 * @param {object} dotenv
 * @param {string} dotenv._BUILD_APP_INDEX_PREFIX
 * @param {string} dotenv._BUILD_DIST_DIR
 * @param {string} dotenv._BUILD_HTML_INDEX_DIR
 * @param {string} dotenv._BUILD_PUBLIC_PATH
 * @param {string} dotenv._BUILD_RELATIVE_DIRNAME
 * @param {string} dotenv._BUILD_SRC_DIR
 * @param {string} dotenv._BUILD_STATIC_DIR
 * @param {string} dotenv._BUILD_UI_NAME
 * @param {object} settings
 * @param {object} settings.consoleMessage
 * @param {Array<string>} settings.jsFileExtensions
 * @param {Function} settings.setupWebpackDotenvFilesForEnv
 * @param {Array<string>} settings.tsFileExtensions
 * @returns {{output: {path: string, filename: string, publicPath: string, clean: boolean}, entry: {app: string},
 *     resolve: {cacheWithContext: boolean, symlinks: boolean}, plugins: any[], module: {rules: Array}}}
 */
const common = (
  {
    _BUILD_APP_INDEX_PREFIX: APP_INDEX_PREFIX,
    _BUILD_DIST_DIR: DIST_DIR,
    _BUILD_HTML_INDEX_DIR: HTML_INDEX_DIR = '',
    _BUILD_PUBLIC_PATH: PUBLIC_PATH,
    _BUILD_RELATIVE_DIRNAME: RELATIVE_DIRNAME,
    _BUILD_SRC_DIR: SRC_DIR = '',
    _BUILD_STATIC_DIR: STATIC_DIR = '',
    _BUILD_UI_NAME: UI_NAME
  } = OPTIONS.dotenv || {},
  {
    consoleMessage: aliasConsoleMessage = consoleMessage,
    jsFileExtensions: aliasJsFileExtensions = jsFileExtensions,
    setupWebpackDotenvFilesForEnv: aliasSetupWebpackDotenvFilesForEnv = setupWebpackDotenvFilesForEnv,
    tsFileExtensions: aliasTsFileExtensions = tsFileExtensions
  } = {}
) => ({
  context: RELATIVE_DIRNAME,
  entry: {
    app: (() => {
      let entryFiles;

      try {
        const fileExtensions = [...aliasTsFileExtensions, ...aliasJsFileExtensions];
        const entryFilesSet = new Set([...fileExtensions.map(ext => path.join(SRC_DIR, `${APP_INDEX_PREFIX}.${ext}`))]);

        entryFiles = Array.from(entryFilesSet).filter(file => fs.existsSync(file));

        if (!entryFiles.length) {
          aliasConsoleMessage.warn(
            `webpack app entry file error: Missing entry/app file. Expected an index file! ${APP_INDEX_PREFIX}.(${fileExtensions.join('|')})`
          );
        }
      } catch (e) {
        aliasConsoleMessage.error(`webpack app entry file error: ${e.message}`);
      }

      return entryFiles;
    })()
  },
  output: {
    filename: '[name].bundle.js',
    path: DIST_DIR,
    publicPath: PUBLIC_PATH,
    clean: true
  },
  module: {
    rules: [
      {
        test: /\.(svg|ttf|eot|woff|woff2)$/,
        include: input => input.indexOf('fonts') > -1 || input.indexOf('icon') > -1,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[hash][ext][query]'
        }
      },
      {
        test: /\.svg$/i,
        include: input => input.indexOf('fonts') === -1 || input.indexOf('icon') === -1,
        type: 'asset',
        parser: {
          dataUrlCondition: { maxSize: 5000 }
        },
        generator: {
          dataUrl: content => SvgToMiniDataURI(content.toString()),
          filename: 'images/[hash][ext][query]'
        }
      },
      {
        test: /\.(jpg|jpeg|png|gif)$/i,
        type: 'asset',
        parser: {
          dataUrlCondition: { maxSize: 5000 }
        },
        generator: {
          filename: 'images/[hash][ext][query]'
        }
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, cssLoaderResolve]
      }
    ]
  },
  plugins: [
    ...aliasSetupWebpackDotenvFilesForEnv({
      directory: RELATIVE_DIRNAME
    }),
    ...(() => {
      const staticFile = path.join(HTML_INDEX_DIR, 'index.html');

      if (fs.existsSync(staticFile)) {
        return [
          new HtmlWebpackPlugin({
            ...(UI_NAME && { title: UI_NAME }),
            template: staticFile
          }),
          new HtmlReplaceWebpackPlugin([
            {
              pattern: /%([A-Z_]+)%/g,
              replacement: (match, $1) => process.env?.[$1] || match
            }
          ])
        ];
      }

      return [
        new HtmlWebpackPlugin({
          ...(UI_NAME && { title: UI_NAME })
        })
      ];
    })(),
    ...(() => {
      try {
        let fileResults;

        if (fs.existsSync(STATIC_DIR)) {
          fileResults = fs
            .readdirSync(STATIC_DIR)
            ?.filter(fileDir => !/^(\.|index)/.test(fileDir))
            ?.map(fileDir => ({
              from: path.join(STATIC_DIR, fileDir),
              to: path.join(DIST_DIR, fileDir)
            }));
        }

        return (
          (fileResults?.length > 0 && [
            new CopyPlugin({
              patterns: fileResults
            })
          ]) ||
          []
        );
      } catch (e) {
        aliasConsoleMessage.error(`webpack.common.js copy plugin error: ${e.message}`);

        return [];
      }
    })()
  ],
  resolve: {
    symlinks: false,
    cacheWithContext: false
  }
});

/**
 * Development webpack configuration.
 *
 * @param {object} dotenv
 * @param {string} dotenv.NODE_ENV
 * @param {string} dotenv._BUILD_DIST_DIR
 * @param {string} dotenv._BUILD_HOST
 * @param {string} dotenv._BUILD_HTML_INDEX_DIR
 * @param {string} dotenv._BUILD_OPEN_PATH
 * @param {string} dotenv._BUILD_RELATIVE_DIRNAME
 * @param {string} dotenv._BUILD_PORT
 * @param {string} dotenv._BUILD_SRC_DIR
 * @param {string} dotenv._BUILD_STATIC_DIR
 * @param {object} settings
 * @param {Function} settings.setupWebpackDotenvFilesForEnv
 * @returns {{mode: string, devtool: string, devServer: {historyApiFallback: boolean, static: {directory: string},
 *     port: string, compress: boolean, host: string, devMiddleware: {writeToDisk: boolean, stats: string|object},
 *     client: {overlay: boolean, progress: boolean}, hot: boolean, watchFiles: {paths: string[]}}, plugins: any[]}}
 */
const development = (
  {
    NODE_ENV: MODE,
    _BUILD_DIST_DIR: DIST_DIR,
    _BUILD_HOST: HOST,
    _BUILD_HTML_INDEX_DIR: HTML_INDEX_DIR,
    _BUILD_OPEN_PATH: OPEN_PATH,
    _BUILD_RELATIVE_DIRNAME: RELATIVE_DIRNAME,
    _BUILD_PORT: PORT,
    _BUILD_SRC_DIR: SRC_DIR,
    _BUILD_STATIC_DIR: STATIC_DIR
  } = OPTIONS.dotenv || {},
  { setupWebpackDotenvFilesForEnv: aliasSetupWebpackDotenvFilesForEnv = setupWebpackDotenvFilesForEnv } = {}
) => ({
  mode: MODE,
  devtool: 'eval-source-map',
  devServer: {
    ...((OPEN_PATH && { open: OPEN_PATH }) || {}),
    host: HOST,
    port: PORT,
    compress: true,
    historyApiFallback: true,
    hot: true,
    devMiddleware: {
      stats: 'errors-warnings',
      writeToDisk: false
    },
    client: {
      overlay: false,
      progress: true
    },
    static: {
      directory: DIST_DIR
    },
    watchFiles: {
      paths: (() => {
        const updatedPaths = new Set();

        if (SRC_DIR) {
          updatedPaths.add(path.basename(SRC_DIR));
        }

        if (HTML_INDEX_DIR) {
          updatedPaths.add(path.basename(HTML_INDEX_DIR));
        }

        if (STATIC_DIR) {
          updatedPaths.add(path.basename(STATIC_DIR));
        }

        return Array.from(updatedPaths).map(value => path.join(value, '**', '*'));
      })()
    }
  },
  plugins: [
    ...aliasSetupWebpackDotenvFilesForEnv({
      directory: RELATIVE_DIRNAME,
      env: MODE
    }),
    new MiniCssExtractPlugin({
      filename: '[name].bundle.css'
    })
  ]
});

/**
 * Production webpack configuration.
 *
 * @param {object} dotenv
 * @param {string} dotenv.NODE_ENV
 * @param {string} dotenv._BUILD_RELATIVE_DIRNAME
 * @param {object} settings
 * @param {Function} settings.setupWebpackDotenvFilesForEnv
 * @returns {{mode: string, devtool: undefined, output: {chunkFilename: string, filename: string},
 *     optimization: {minimize: boolean, runtimeChunk: string, minimizer: Array<any|CssMinimizerPlugin>,
 *     splitChunks: {chunks: string, cacheGroups: {vendor: {test: RegExp, chunks: string, name: string}}}},
 *     plugins: Array}}
 */
const production = (
  { NODE_ENV: MODE, _BUILD_RELATIVE_DIRNAME: RELATIVE_DIRNAME } = OPTIONS.dotenv || {},
  { setupWebpackDotenvFilesForEnv: aliasSetupWebpackDotenvFilesForEnv = setupWebpackDotenvFilesForEnv } = {}
) => ({
  mode: MODE,
  devtool: undefined,
  output: {
    chunkFilename: '[name].[contenthash:8].chunk.js',
    filename: '[name].[contenthash:8].js'
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserJSPlugin({
        parallel: true
      }),
      new CssMinimizerPlugin({
        minimizerOptions: {
          preset: ['default', { mergeLonghand: false }]
        }
      })
    ],
    runtimeChunk: 'single',
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          chunks: 'all',
          name: 'vendor',
          test: /[\\/]node_modules[\\/]/
        }
      }
    }
  },
  plugins: [
    ...aliasSetupWebpackDotenvFilesForEnv({
      directory: RELATIVE_DIRNAME,
      env: MODE
    }),
    new MiniCssExtractPlugin({
      chunkFilename: '[name].[contenthash:8].chunk.css',
      filename: '[name].[contenthash:8].css'
    })
  ]
});

module.exports = {
  common,
  development,
  preprocessLoader,
  preprocessLoaderNone,
  preprocessLoaderJs,
  preprocessLoaderTs,
  production
};
