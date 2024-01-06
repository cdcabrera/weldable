# How to use

<details>
<summary><h3 style="display: inline-block">Tooling requirements</h3></summary>

The basic requirements:
* [NodeJS version 18+](https://nodejs.org/)
* NPM
  > There appear to be dependency mapping issues with `Yarn` v1.x.x lock files, `Typescript` and `webpack`, and specific dependencies
  > using ES modules. If you do decide to use [Yarn](https://yarnpkg.com) use the latest version.
</details>

<details>
<summary><h3 style="display: inline-block">CLI use</h3></summary>

Basic CLI functionality can also be viewed under a simple terminal command
```shell
$ weldable -h
```

#### Options
| CLI OPTION     | DESCRIPTION                                                                                                                                      | CHOICES                                                                | DEFAULT      |
|----------------|--------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------|--------------|
| -e, --env      | Use a default configuration type if NODE_ENV is not set to the available choices of "development" and "production"                               | development, production                                                | production   |
| -l, --lang     | Codebase language, JS or TS                                                                                                                      | js, ts                                                                 | js           |
| -s, --stats    | Output JSON webpack bundle stats for use with "webpack-bundle-analyzer". Use the default or enter a relative path and filename                   |                                                                        | ./stats.json |
| --tsconfig     | Generate a base tsconfig from one of the available NPM @tsconfig/[base]. An existing tsconfig.json will override this option, see "tsconfig-opt" | create-react-app, node18, node20, react-native, recommended, strictest |              |
| --tsconfig-opt | Regenerate or merge a tsconfig. Useful if a tsconfig already exists                                                                              | merge, regen                                                           | regen        |
| -x, --extend   | Extend, or override, the default configs with your own relative path webpack configs using webpack merge.                                        |                                                                        |              |
| -h, --help     |                                                                                                                                                  |                                                                        |              |
| -v, --version  |                                                                                                                                                  |                                                                        |              |

#### NPM script use
CLI usage can be placed under NPM scripts

A basic development start, and production build, using your own op

   ```js
   "scripts": {
     "start": "weldable -e development",
     "build": "weldable"
   }
   ```

A development start, and production build, using your own webpack configurations merged with the defaults.

   ```js
   "scripts": {
     "start": "weldable -e development -x ./webpack.yourCustomBuild.js -x ./webpack.developmentBuild.js",
     "build": "weldable -x ./webpack.yourCustomBuild.js -x ./webpack.productionBuild.js"
   }
   ```

#### dotenv use
`weldable` makes use of dotenv parameters for aspects of webpack configuration overrides.
> Instead of dotenv files you can choose to export parameters via the terminal

**dotenv via terminal**
Using the terminal to handle dotenv parameters
Set a parameter
```shell
export YOUR_DOTENV_PARAM="lorem ipsum"; echo $YOUR_DOTENV_PARAM
```
Unset a parameter
```shell
unset YOUR_DOTENV_PARAM; echo $YOUR_DOTENV_PARAM
```

**dotenv via files**
dotenv files are structured to cascade each additional dotenv file settings from a root `.env` file.

```
 .env = base dotenv file settings
 .env.local = local settings overrides that enhance the base .env settings
 .env -> .env.development = development settings that enhances the base .env settings
 .env -> .env.development.local = local run development settings that enhances the base .env and .env.development settings
 .env -> .env.production = build modifications associated with all environments
 .env -> .env.production.local = local run build modifications that enhance the base .env and .env.production settings
```

In certain instances it is encouraged that you `.gitignore` all dotenv files since they can contain application settings.
For this framework, however, we encourage application settings being applied to `.env*.local` files and adding 2 entries
to your project's `.gitignore`

```
!.env
.env*.local
```

This allows you to have both local settings that are NOT checked in, and settings that are.

**Available dotenv parameters**

| dotenv parameter                      | definition                                                                                                       | default value |
|---------------------------------------|------------------------------------------------------------------------------------------------------------------|---------------|
| _BUILD_RELATIVE_DIRNAME (*read only*) | A dynamically build populated string reference for the root context path                                         |               |
| DIST_DIR                              | A static string for the webpack build output directory                                                           | ./dist        |
| HOST                                  | A static string for the webpack dev server host                                                                  | localhost     |
| NODE_ENV                              |                                                                                                                  |               |
| PORT                                  | A static number for the webpack dev server port                                                                  | 3000          |
| OPEN_PATH                             | A static string for the webpack dev server browser open path                                                     |               |
| PUBLIC_PATH                           | A static string for the webpack output base expected path of your application                                    | /             |
| PUBLIC_URL                            | A static string alias for PUBLIC_PATH                                                                            | /             |
| SRC_DIR                               | A static string for application source directory                                                                 | ./src         |
| STATIC_DIR                            | A static string associated with the directory containing static build assets                                     | ./public      |
| UI_NAME                               | A static string title for `index.html`. `index.html` being a file you, or webpack, creates within the STATIC_DIR |               |


</details>

<details>
<summary><h3 style="display: inline-block">Lib use</h3></summary>

The `lib` aspect of `weldable` is exported as CommonJS and is intended to be run as part of your build process without the need to install many additional packages.

#### Use within build files
**CommonJS...**
```
const { packages, dotenv } = require('weldable');

const aPackage = packages.[PACKAGE_NAME];
const dotenvFunc = dotenv.[FUNC];
```

**ES Module...**
```
import { packages, dotenv } from 'weldable';

const aPackage = packages.[PACKAGE_NAME];
const dotenvFunc = dotenv.[FUNC];
```

#### Exposed packages
See our [package.json](./package.json) `dependencies` for exposed packages.

- We do not provide package use documentation. For package use review associated package.
- All packages retain their respective license. It is your responsibility to use said packages accordingly.

> The `weldable` lib bundles a [`txt` resource](./lib/packagesLicenses.txt) containing available license materials.

| PACKAGES                     | EXPOSED NAME         |
|------------------------------|----------------------|
| @babel/core                  | babelCore            |
| @tsconfig/create-react-app   | N/A                  |
| @tsconfig/node18             | N/A                  |
| @tsconfig/node20             | N/A                  |
| @tsconfig/react-native       | N/A                  |
| @tsconfig/recommended        | N/A                  |
| @tsconfig/strictest          | N/A                  |
| babel-loader                 | babelLoader          |
| copy-webpack-plugin          | CopyWebpackPlugin    |
| css-loader                   | cssLoader            |
| css-minimizer-webpack-plugin | CssMinimizerWebpackPlugin |
| dotenv                       | dotenv               |
| dotenv-expand                | dotenvExpand         |
| dotenv-webpack               | dotenvWebpack        |
| eslint-webpack-plugin        | EslintWebpackPlugin  |
| html-replace-webpack-plugin  | htmlReplaceWebpackPlugin |
| html-webpack-plugin          | HtmlWebpackPlugin    |
| less                         | less                 | 
| less-loader                  | lessLoader           |
| mini-css-extract-plugin      | MiniCssExtractPlugin |
| mini-svg-data-uri            | miniSvgDataUri       |
| rimraf                       | rimraf               |
| sass                         | sass                 |
| sass-loader                  | sassLoader           |
| style-loader                 | styleLoader          |
| terser-webpack-plugin        | TerserWebpackPlugin  |
| ts-loader                    | tsLoader             |
| tslib                        | tslib                |
| typescript                   | typescript           |
| webpack                      | webpack              |
| webpack-bundle-analyzer      | webpackBundleAnalyzer |
| webpack-cli                  | WebpackCli           |
| webpack-dev-server           | WebpackDevServer     |
| webpack-merge                | webpackMerge         |

#### Exposed weldable functions

`weldable` exposes limited helper functions

| HELPER                                                                                               | EXPOSED NAME                         | DESCRIPTION                                                                                                                                                                     |
|------------------------------------------------------------------------------------------------------|--------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [dotenv](./src/README.md#module_dotenv)                                                              | dotenv                               | An object group of helper functions designed to consume dotenv files. Useful for implementing your own dotenv parameters used during testing, or for a standalone webpack build |
| [dotenv.setupDotenvFilesForEnv](./src/README.md#module_dotenv..setupDotenvFilesForEnv)               | dotenv.setupDotenvFilesForEnv        | A function for use with non-webpack configurations. Access local and specific dotenv file parameters. Failed or missing parameters return an empty string.                      |
| [dotenv.setupWebpackDotenvFilesForEnv](./src/README.md#module_dotenv..setupWebpackDotenvFilesForEnv) | dotenv.setupWebpackDotenvFilesForEnv | A function for use with webpack configurations. Set multiple webpack dotenv file parameters during configuration and build.                                                     |

**Examples**

Example usage with Jest, `setupTests.js`. This will allow the use of `.env.test` and `.env.test.local` files.
```
/**
 * Set dotenv params for use during testing.
 */
setupDotenvFilesForEnv({ env: 'test' });
```

Example usage with a webpack build configuration. The associated dotenv files would be
- `.env`
- `.env.local`
- `.env.loremIpsum`
- `.env.loremIpsum.local`

```
const { dotenv } = require('weldable');
const { setupDotenvFilesForEnv, setupWebpackDotenvFilesForEnv } = dotenv;

process.env.NODE_ENV='development';

const {
  _BUILD_RELATIVE_DIRNAME,
  DIST_DIR
  HOST
  NODE_ENV
  PORT
  OPEN_PATH
  PUBLIC_PATH
  PUBLIC_URL
  SRC_DIR
  STATIC_DIR
} = setupDotenvFilesForEnv({
  env: 'loremIpsum'
});

const webpackProduction = {
...
  plugins: [
    ...setupWebpackDotenvFilesForEnv({
      directory: _BUILD_RELATIVE_DIRNAME,
      env: NODE_ENV
    }),
...
};
``` 

> `setupDotenvFilesForEnv` falls back to creating a NODE_ENV parameter if one is not already set. It is
> recommended if you decide to use webpack and a non-standard env beyond `development` or `production` you
> also export a NODE_ENV=development or NODE_ENV=production to avoid issues.

</details>
