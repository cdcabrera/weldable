# How to use

<details>
<summary><h3 style="display: inline-block">Tooling requirements</h3></summary>

The basic use requirements:
* [NodeJS version 18+](https://nodejs.org/)
* NPM
  > There appear to be dependency mapping issues with `Yarn` v1.x.x lock files, `Typescript` and `webpack`, and specific dependencies
  > using ES modules. If you do decide to use [Yarn](https://yarnpkg.com) use the latest version.
</details>

<details>
<summary><h3 style="display: inline-block">Setup a project</h3></summary>

`weldable` makes assumptions on project structure in order to be up and moving. Many of these assumptions can be
overridden, or ignored, to fit your own preferences.

Assumptions `weldable` presets...
- `src` project directory, `Your project -> src -> your work`
- `index.(js|jsx|ts|tsx)` application prefix and possible extensions located in `src`, `Your project -> src -> index.(js|jsx|ts|tsx)` 
- `dist` directory for webpack bundle output, `Your project -> dist`
- `localhost` host name
- `port` default of `3000`

> To alter these presets see [`dotenv`](#dotenv-use) use.

#### Setup
> All setup directions are based on a MacOS experience. If Linux, or Windows, is used and
you feel the directions could be updated please open a pull request to update documentation.

**For those with experience**, to get up and running quickly...

1. Confirm you installed the correct version of [NodeJS](https://nodejs.org)
1. Confirm you added `weldable` as a `dependency` to your project
1. Make sure you have a `src` directory with at least an `index.(js|jsx|ts|tsx)`
1. Create NPM scripts that reference the `weldable` CLI
   ```
   "scripts": {
    "build": "weldable",
    "start": "weldable -e development"
   },
   ```
1. Run the NPM scripts and that's it, customize away!

**And for those with less experience**, directions for all...

1. Confirm you installed the correct version of [NodeJS](https://nodejs.org/). The current minimum NodeJS version is noted on the main [README.md](./README.md)
1. Create a new directory, open your terminal and change directories into it
   ```
   $ cd ./[new_directory]
   ```
1. Create your `package.json` file. You can use the terminal to initialize the project, you'll be asked questions (there are defaults, just hit enter or fill them out)...
   ```
   $ npm init
   ```
1. After creating `package.json`. Add `weldable` as a `devDependency` via the terminal
   ```
   $ npm i weldable --save-dev
   ```
1. Next, add a `src` directory to your new directory, like `new_directory -> src`
1. Next, add an `index.js` file to `src`, like `new_directory -> src -> index.js`
1. Add the following contents to `index.js`
   ```
   const body = document.querySelector('BODY');
   const div = document.createElement('div');
   div.innerText = `hello world`;
   body.appendChild(div);
   ```
1. To get everything running, we need to add some NPM scripts inside the `package.json` `scripts` section
   ```
   "scripts": {
    "build": "weldable",
    "start": "weldable -e development"
   },
   ```
1. Next, in the terminal, lets run the development mode.
   ```
   $ npm start
   ```
   > If everything is working correctly you should see messaging telling you where files are running.
   >
   > If everything did NOT work, you may receive messaging from `weldable`, or `webpack`, explaining what the issue is.
   > If you receive no error messaging a standard practice is to reconfirm you have the correct tooling installed and walk
   > back through the previous steps.
1. Finally, in the terminal, we'll create our bundle
   ```
   $ npm run build
   ```
   > If everything is working correctly you should see messaging telling you basic bundle stats and a successful completion message.
   > You can access your bundle under the `dist` directory.
   >
   > If things are NOT working, `weldable` and `webpack` should provide messaging to help you
   > debug why your bundle isn't being compiled 


</details>

<details>
<summary><h3 style="display: inline-block">dotenv use</h3></summary>

`weldable` makes use of dotenv parameters for aspects of webpack configuration overrides.
> Instead of dotenv files you can choose to export parameters via the terminal

#### dotenv via terminal
Using the terminal to handle dotenv parameters
Set a parameter
```shell
export YOUR_DOTENV_PARAM="lorem ipsum"; echo $YOUR_DOTENV_PARAM
```
Unset a parameter
```shell
unset YOUR_DOTENV_PARAM; echo $YOUR_DOTENV_PARAM
```

#### dotenv via files
dotenv files are structured to cascade, similar to stylesheets. Each additional dotenv file builds settings from a root `.env` file.

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

`weldable` makes use of exposed dotenv parameters to handle webpack configuration settings...

| dotenv parameter               | definition                                                                                                                                                                                                                                                                                                                                                                   | default value |
|--------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------|
| RELATIVE_DIRNAME (*read only*) | A dynamically build populated string reference for the root context path                                                                                                                                                                                                                                                                                                     |               |
| APP_INDEX_PREFIX               | A static string for the webpack application entry file `[APP_INDEX_PREFIX].[ext]`                                                                                                                                                                                                                                                                                            | index         |
| DIST_DIR                       | A static string for the webpack build output directory                                                                                                                                                                                                                                                                                                                       | ./dist        |
| HOST                           | A static string for the webpack dev server host                                                                                                                                                                                                                                                                                                                              | localhost     |
| HTML_INDEX_DIR                 | A static string referencing what directory your `index.html` file is located. If there is no `index.html`, webpack is nice, it'll create one for you.                                                                                                                                                                                                                        | ./src         |
| NODE_ENV                       |                                                                                                                                                                                                                                                                                                                                                                              |               |
| PORT                           | A static number for the webpack dev server port                                                                                                                                                                                                                                                                                                                              | 3000          |
| OPEN_PATH                      | A static string for the webpack dev server browser open path                                                                                                                                                                                                                                                                                                                 |               |
| PUBLIC_PATH                    | A static string for the webpack output base expected path of your application. **Tip: This parameter can cause `webpack` to reference an incorrect path, specifically for static assets and your bundle output, resulting in `404`s and hair-pulling during development, see [`webpack` docs for more info](https://webpack.js.org/configuration/output/#outputpublicpath)** | /             |
| PUBLIC_URL                     | A static string alias for PUBLIC_PATH                                                                                                                                                                                                                                                                                                                                        | /             |
| SRC_DIR                        | A static string for application source directory                                                                                                                                                                                                                                                                                                                             | ./src         |
| STATIC_DIR                     | A static string associated with the directory containing static build assets. We've generally used this directory for files included directly in `index.html`, and resources included with XHR. **Warning: importing, or requiring, assets from this directory to within the `SRC_DIR` WILL cause webpack to attempt bundling the asset along with copying it!**             |               |
| UI_NAME                        | A static string title for `index.html`. `index.html` being a file you, or webpack, creates within the STATIC_DIR                                                                                                                                                                                                                                                             |               |

> Technically all dotenv parameters are strings. When consuming them it is important to cast them accordingly.
</details>

<details>
<summary><h3 style="display: inline-block">CLI use</h3></summary>

Basic CLI functionality can also be viewed under a simple terminal command
```shell
$ weldable -h
```

#### Options
| CLI OPTION     | DESCRIPTION                                                                                                                                                                                                                                         | CHOICES                                                                | DEFAULT      |
|----------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------|--------------|
| -e, --env      | Use a default configuration type if NODE_ENV is not set to the available choices of "development" and "production"                                                                                                                                  | development, production                                                | production   |
| -l, --loader   | Preprocess loader, use the classic JS (babel-loader), TS (ts-loader), or "none" to use webpack defaults, or a different loader.                                                                                                                     | js, ts, none                                                           | js           |
| -s, --stats    | Output JSON webpack bundle stats for use with "webpack-bundle-analyzer". Use the default or enter a relative path and filename                                                                                                                      |                                                                        | ./stats.json |
| --tsconfig     | Generate a base tsconfig from one of the available NPM @tsconfig/[base]. An existing tsconfig.json will override this option, see "tsconfig-opt". This option can be run without running webpack.                                                   | create-react-app, node18, node20, react-native, recommended, strictest |              |
| --tsconfig-opt | Regenerate or merge a tsconfig. Useful if a tsconfig already exists. Requires the use of "tsconfig" option                                                                                                                                          | merge, regen                                                           | regen        |
| -x, --extend   | Extend, or override, the default configs with your own relative path webpack configs using webpack merge. Configuration can be a callback that returns a webpack config object, available dotenv parameters are returned as the callback parameter. |                                                                        |              |
| -h, --help     |                                                                                                                                                                                                                                                     |                                                                        |              |
| -v, --version  |                                                                                                                                                                                                                                                     |                                                                        |              |

#### Use the CLI with NPM scripts
CLI usage can be placed under NPM scripts

A basic development start, and production build, using your own scripts

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
</details>

<details>
<summary><h3 style="display: inline-block">Lib use</h3></summary>

The `lib` aspect of `weldable` is exported as CommonJS and is intended to be run as part of your build process without the need to install many additional packages.

Two primary things are exposed through `weldable`...
- packages, such as `webpack-merge`
- and `weldable` "helper" functions

Example use within build files...
```
const { dotenv } = require('weldable');

const dotenvFunc = dotenv.[FUNC];
```

#### Exposed packages
See our [package.json](./package.json) `dependencies` for exposed packages.

You can also use the `weldable` namespace, or you can always call the package directly...
```
const packages = require('weldable/lib/packages');

const aPackage = packages.[PACKAGE_NAME];
```

**Heads up**
- Packages is kept separated from `weldable` functions due to ES module loading. Certain packages do but others don't provide modules which can cause issues with tooling, such as `Jest`.
- Every package has 2 exported aspects, the `required` package and a `require.resolve`
- We do not provide package use documentation. For package use review associated package.
- All packages retain their respective license. It is your responsibility to use said packages accordingly.

> The `weldable` lib bundles a [`txt` resource](./lib/packagesLicenses.txt) containing available license materials.

| PACKAGES                     | EXPOSED NAME                                                |
|------------------------------|-------------------------------------------------------------|
| @babel/core                  | babelCore, babelCoreResolve                                 |
| @tsconfig/create-react-app   | N/A                                                         |
| @tsconfig/node18             | N/A                                                         |
| @tsconfig/node20             | N/A                                                         |
| @tsconfig/react-native       | N/A                                                         |
| @tsconfig/recommended        | N/A                                                         |
| @tsconfig/strictest          | N/A                                                         |
| babel-loader                 | babelLoader, babelLoaderResolve                             |
| copy-webpack-plugin          | CopyWebpackPlugin, CopyWebpackPluginResolve                 |
| css-loader                   | cssLoader, cssLoaderResolve                                 |
| css-minimizer-webpack-plugin | CssMinimizerWebpackPlugin, CssMinimizerWebpackPluginResolve |
| dotenv                       | dotenv, dotenvResolve                                       |
| dotenv-expand                | dotenvExpand, dotenvExpandResolve                           |
| dotenv-webpack               | dotenvWebpack, dotenvWebpackResolve                         |
| eslint-webpack-plugin        | EslintWebpackPlugin, EslintWebpackPluginResolve             |
| html-replace-webpack-plugin  | htmlReplaceWebpackPlugin, htmlReplaceWebpackPluginResolve   |
| html-webpack-plugin          | HtmlWebpackPlugin, HtmlWebpackPluginResolve                 |
| less                         | less, lessResolve                                           | 
| less-loader                  | lessLoader, lessLoaderResolve                               |
| mini-css-extract-plugin      | MiniCssExtractPlugin, MiniCssExtractPluginResolve           |
| mini-svg-data-uri            | miniSvgDataUri, miniSvgDataUriResolve                       |
| rimraf                       | rimraf, rimrafResolve                                       |
| sass                         | sass, sassResolve                                           |
| sass-loader                  | sassLoader, sassLoaderResolve                               |
| style-loader                 | styleLoader, styleLoaderResolve                             |
| terser-webpack-plugin        | TerserWebpackPlugin, TerserWebpackPluginResolve             |
| ts-loader                    | tsLoader, tsLoaderResolve                                   |
| tslib                        | tslib, tslibResolve                                         |
| typescript                   | typescript, typescriptResolve                               |
| webpack                      | webpack, webpackResolve                                     |
| webpack-bundle-analyzer      | webpackBundleAnalyzer, webpackBundleAnalyzerResolve         |
| webpack-cli                  | WebpackCli, WebpackCliResolve                               |
| webpack-dev-server           | WebpackDevServer, WebpackDevServerResolve                   |
| webpack-merge                | webpackMerge, webpackMergeResolve                           |

An example webpack config rules loader using the provided `require.resolve`...
```
const { cssLoaderResolve, MiniCssExtractPlugin, sassLoaderResolve } = require('weldable/lib/packages');

module.exports = ({ SRC_DIR } = {}) => ({
  module: {
    rules: [
      {
        test: /\.(sa|sc)ss$/i,
        use: [MiniCssExtractPlugin.loader, cssLoaderResolve, sassLoaderResolve]
      }
    ]
  }
});
```


#### Exposed weldable functions

`weldable` exposes limited helper functions

You can access the functions like so...
```
const { dotenv } = require('weldable');

const dotenvFunc = dotenv.[FUNC];
```

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
  RELATIVE_DIRNAME,
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
  env: 'loremIpsum',
  relativePath: process.cwd()
});

const webpackProduction = {
...
  plugins: [
    ...setupWebpackDotenvFilesForEnv({
      directory: RELATIVE_DIRNAME,
      env: NODE_ENV
    }),
...
};
``` 

> `setupDotenvFilesForEnv` falls back to creating a NODE_ENV parameter if one is not already set. It is
> recommended if you decide to use webpack and a non-standard env beyond `development` or `production` you
> also export a NODE_ENV=development or NODE_ENV=production to avoid issues.

</details>
