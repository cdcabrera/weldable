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
  -h, --help          Show help                                                                                              [boolean]
  -v, --version       Show version number                                                                                    [boolean]
```

## Contributing
Contributing? Guidelines can be found here [CONTRIBUTING.md](./CONTRIBUTING.md).
