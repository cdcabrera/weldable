const wpConfigs = require('../wpConfigs');
const path = require('path');
const { OPTIONS } = require('../global');

describe('webpackConfigs', () => {
  const baseOptions = {
    dotenv: {
      NODE_ENV: 'development',
      _BUILD_APP_INDEX_PREFIX: 'index',
      _BUILD_DIST_DIR: path.join(fixturePath, 'dist'),
      _BUILD_HOST: 'localhost',
      _BUILD_PORT: 3000,
      _BUILD_RELATIVE_DIRNAME: fixturePath,
      _BUILD_SRC_DIR: path.join(fixturePath, 'src')
    }
  };

  /**
   * Test multiple configurations consistently
   *
   * @param {Function} method
   * @param {object} options
   * @param {string} options.loader
   * @param {string} options.mode
   * @returns {{prodHash: string, prodSnapshot: string|undefined, loader: string, devSnapshot: string|undefined,
   *     isEqual: boolean, devHash: string}}
   */
  const processConfig = (method, { mode, loader = 'none' } = {}) => {
    let devSnapshot;
    let prodSnapshot;

    if (mode === 'development' || mode === undefined) {
      const { mockClear: mockDevClear } = mockObjectProperty(OPTIONS, {
        ...baseOptions,
        dotenv: {
          ...baseOptions.dotenv
        },
        loader
      });

      const devOutput = method();
      devSnapshot = cleanConfigurationPaths(devOutput);
      mockDevClear();
    }

    if (mode === 'production' || mode === undefined) {
      const { mockClear: mockProdClear } = mockObjectProperty(OPTIONS, {
        ...baseOptions,
        dotenv: {
          ...baseOptions.dotenv,
          NODE_ENV: 'production'
        },
        loader
      });

      const prodOutput = method();
      prodSnapshot = cleanConfigurationPaths(prodOutput);
      mockProdClear();
    }

    return {
      loader,
      devSnapshot,
      prodSnapshot
    };
  };

  it('should return specific properties', () => {
    expect(wpConfigs).toMatchSnapshot('specific properties');
  });

  it('should return a preprocessLoader configuration object', () => {
    expect([
      processConfig(wpConfigs.preprocessLoader, { loader: 'js' }),
      processConfig(wpConfigs.preprocessLoader, { loader: 'ts' }),
      processConfig(wpConfigs.preprocessLoader)
    ]).toMatchSnapshot('language dev and prod hashes, code snapshots');
  });

  it('should return a common configuration object', () => {
    expect([
      processConfig(wpConfigs.common, { loader: 'js' }),
      processConfig(wpConfigs.common, { loader: 'ts' }),
      processConfig(wpConfigs.common)
    ]).toMatchSnapshot('common dev and prod hashes, code snapshots');
  });

  it('should return a development configuration object', () => {
    expect([
      processConfig(wpConfigs.development, { loader: 'js', mode: 'development' }),
      processConfig(wpConfigs.development, { loader: 'ts', mode: 'development' }),
      processConfig(wpConfigs.development, { mode: 'development' })
    ]).toMatchSnapshot('development dev hashes, code snapshots');
  });

  it('should return a production configuration object', () => {
    expect([
      processConfig(wpConfigs.production, { loader: 'js', mode: 'production' }),
      processConfig(wpConfigs.production, { loader: 'ts', mode: 'production' }),
      processConfig(wpConfigs.production, { mode: 'production' })
    ]).toMatchSnapshot('production prod hashes, code snapshots');
  });
});
