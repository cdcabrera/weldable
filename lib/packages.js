const babelCore = require('@babel/core');
exports.babelCore = babelCore;

const babelLoader = require('babel-loader');
exports.babelLoader = babelLoader;

const CopyWebpackPlugin = require('copy-webpack-plugin');
exports.CopyWebpackPlugin = CopyWebpackPlugin;

const cssLoader = require('css-loader');
exports.cssLoader = cssLoader;

const CssMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin');
exports.CssMinimizerWebpackPlugin = CssMinimizerWebpackPlugin;

const dotenv = require('dotenv');
exports.dotenv = dotenv;

const dotenvExpand = require('dotenv-expand');
exports.dotenvExpand = dotenvExpand;

const dotenvWebpack = require('dotenv-webpack');
exports.dotenvWebpack = dotenvWebpack;

const EslintWebpackPlugin = require('eslint-webpack-plugin');
exports.EslintWebpackPlugin = EslintWebpackPlugin;

const htmlReplaceWebpackPlugin = require('html-replace-webpack-plugin');
exports.htmlReplaceWebpackPlugin = htmlReplaceWebpackPlugin;

const HtmlWebpackPlugin = require('html-webpack-plugin');
exports.HtmlWebpackPlugin = HtmlWebpackPlugin;

const less = require('less');
exports.less = less;

const lessLoader = require('less-loader');
exports.lessLoader = lessLoader;

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
exports.MiniCssExtractPlugin = MiniCssExtractPlugin;

const miniSvgDataUri = require('mini-svg-data-uri');
exports.miniSvgDataUri = miniSvgDataUri;

const rimraf = require('rimraf');
exports.rimraf = rimraf;

const sass = require('sass');
exports.sass = sass;

const sassLoader = require('sass-loader');
exports.sassLoader = sassLoader;

const styleLoader = require('style-loader');
exports.styleLoader = styleLoader;

const TerserWebpackPlugin = require('terser-webpack-plugin');
exports.TerserWebpackPlugin = TerserWebpackPlugin;

const tsLoader = require('ts-loader');
exports.tsLoader = tsLoader;

const tslib = require('tslib');
exports.tslib = tslib;

const typescript = require('typescript');
exports.typescript = typescript;

const webpack = require('webpack');
exports.webpack = webpack;

const webpackBundleAnalyzer = require('webpack-bundle-analyzer');
exports.webpackBundleAnalyzer = webpackBundleAnalyzer;

const WebpackCli = require('webpack-cli');
exports.WebpackCli = WebpackCli;

const WebpackDevServer = require('webpack-dev-server');
exports.WebpackDevServer = WebpackDevServer;

const webpackMerge = require('webpack-merge');
exports.webpackMerge = webpackMerge;

const yargs = require('yargs');
exports.yargs = yargs;
