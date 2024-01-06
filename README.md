# weldable
[![License](https://img.shields.io/github/license/cdcabrera/weldable.svg)](https://github.com/cdcabrera/changelog-light/blob/main/LICENSE)

Default webpack development and production configuration.

The goal of `weldable` was to make it easier to install `webpack` build packages and be up and running with a basic
`development` or `production` server with minimal preferences.

`weldable` is intended...

- To be used for basic webpack development and production builds.
- To purposefully not include webpack configurations for linting and styling aspects beyond basic webpack capabilities.
- To be designed with the expectation that you can expand on the `weldable` base using the CLI extend option. `-x ./webpack.exampleConfig.js`.
- To be used as a build resource with exposed webpack plugins/addons. And without the need to reinstall available webpack packages (or at least the ones `weldable` uses).

## Requirements
The basic requirements:
 * [NodeJS version 18+](https://nodejs.org/)
 * NPM
   > There appear to be dependency mapping issues with `Yarn` v1.x.x lock files, `Typescript` and `webpack`, and specific dependencies
   > using ES modules. If you do decide to use [Yarn](https://yarnpkg.com) use the latest version.

## Install CLI and package

NPM install...

  ```shell
    $ npm i weldable
  ```

or Yarn

  ```shell
    $ yarn add weldable
  ```

## How to use
For in-depth use of `weldable` see our [DOCS](./DOCS.md).

#### Basic CLI use

```
  $ weldable --help
  Use a webpack configuration for development and production.

  Usage: weldable [options]

  Options:
  -e, --env           Use a default configuration type if NODE_ENV is not set to the available choices.
                                                               [string] [choices: "development", "production"] [default: "production"]
  -l, --lang          Codebase language, JS or TS                                       [string] [choices: "js", "ts"] [default: "js"]
  -s, --stats         Output JSON webpack bundle stats. Use the default, or a relative project path and filename [./stats.json]
                                                                                                                              [string]
      --tsconfig      Generate a base tsconfig from NPM @tsconfig/[base]. An existing tsconfig.json will override this option, see
                      tsconfig-opt.
                            [string] [choices: "", "create-react-app", "node18", "node20", "react-native", "recommended", "strictest"]
      --tsconfig-opt  Regenerate or merge a tsconfig                           [string] [choices: "merge", "regen"] [default: "regen"]
  -x, --extend        Extend, or override, the default configs with your own relative path webpack configs using webpack merge.[array]
  -h, --help          Show help                                                                                              [boolean]
  -v, --version       Show version number                                                                                    [boolean]
```

Example NPM scripts

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

#### Basic lib use
The `lib` aspect of `weldable` is exported as CommonJS and is intended to be run as part of a build process.

CommonJS...
```
const { packages } = require('weldable');

const aPackage = packages.[PACKAGE_NAME];
```

ES Module...
```
import { packages } from 'weldable';

const aPackage = packages.[PACKAGE_NAME];
```

A listing of exposed packages and weldable functions can be found under our [DOCS](./DOCS.md) or
[package.json](./package.json) `dependencies`.


## Credit
This project is influenced by [Create React App](https://github.com/facebook/create-react-app) and other packaging tools.

## Contributing
Contributing? Guidelines can be found here [CONTRIBUTING.md](./CONTRIBUTING.md).
