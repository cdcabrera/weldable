const crypto = require('crypto');
const wpConfigs = require('../wpConfigs');
const path = require('path');
const { OPTIONS } = require('../global');

describe('webpackConfigs', () => {
  const baseOptions = {
    dotenv: {
      NODE_ENV: 'development',
      _BUILD_DIST_DIR: path.join(fixturePath, 'dist'),
      _BUILD_HOST: 'localhost',
      _BUILD_PORT: 3000,
      _BUILD_RELATIVE_DIRNAME: fixturePath,
      _BUILD_SRC_DIR: path.join(fixturePath, 'src')
    }
  };

  /**
   * Provide a consistent way of processing configs.
   *
   * @param {object} obj
   * @param {boolean} isHash
   * @returns {string}
   */
  const cleanConfig = (obj, isHash) => {
    const contents = JSON.stringify(obj, null, 2).replace(/"[a-z0-9/-_.,*()\s]*\/weldable\//gi, '"./');
    if (isHash) {
      return crypto.createHash('md5').update(contents).digest('hex');
    }

    return contents;
  };

  /**
   * Test multiple configurations consistently
   *
   * @param {Function} method
   * @param {string} loader
   * @returns {{prodHash: string, isEqual: boolean, loader, devHash: string}}
   */
  const processConfigIntoHashes = (method, loader = 'none') => {
    const { mockClear: mockDevClear } = mockObjectProperty(OPTIONS, {
      dotenv: {
        ...baseOptions.dotenv
      },
      loader
    });

    expect(cleanConfig(method())).toMatchSnapshot(`${method.name} dev: ${loader}`);
    const devHash = cleanConfig(method(), true);
    mockDevClear();

    const { mockClear: mockProdClear } = mockObjectProperty(OPTIONS, {
      dotenv: {
        ...baseOptions.dotenv,
        NODE_ENV: 'production'
      },
      loader
    });

    const prodHash = cleanConfig(method(), true);
    mockProdClear();

    return {
      loader,
      isEqual: devHash === prodHash,
      devHash,
      prodHash
    };
  };

  it('should return specific properties', () => {
    expect(wpConfigs).toMatchSnapshot('specific properties');
  });

  it('should return a preprocessLoader configuration object', () => {
    expect([
      processConfigIntoHashes(wpConfigs.preprocessLoader, 'js'),
      processConfigIntoHashes(wpConfigs.preprocessLoader, 'ts'),
      processConfigIntoHashes(wpConfigs.preprocessLoader)
    ]).toMatchSnapshot('language dev, prod hashes');
  });

  it('should return a common configuration object', () => {
    expect([
      processConfigIntoHashes(wpConfigs.common, 'js'),
      processConfigIntoHashes(wpConfigs.common, 'ts'),
      processConfigIntoHashes(wpConfigs.common)
    ]).toMatchSnapshot('common dev, prod hashes');
  });

  it('should return a development configuration object', () => {
    expect([
      processConfigIntoHashes(wpConfigs.development, 'js'),
      processConfigIntoHashes(wpConfigs.development, 'ts'),
      processConfigIntoHashes(wpConfigs.development)
    ]).toMatchSnapshot('development dev, prod hashes');
  });

  it('should return a production configuration object', () => {
    // This is expected to be false for result hashes, NODE_ENV is displayed in the obj
    expect([
      processConfigIntoHashes(wpConfigs.production, 'js'),
      processConfigIntoHashes(wpConfigs.production, 'ts'),
      processConfigIntoHashes(wpConfigs.production)
    ]).toMatchSnapshot('production dev, prod hashes');
  });
});
