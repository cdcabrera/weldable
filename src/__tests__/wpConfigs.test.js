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

  const cleanConfig = (obj, isHash) => {
    const contents = JSON.stringify(obj, null, 2).replace(/"[a-z0-9/-_.,*()\s]*\/weldable\//gi, '"./');
    if (isHash) {
      return crypto.createHash('md5').update(contents).digest('hex');
    }

    return contents;
  };

  it('should return specific properties', () => {
    expect(wpConfigs).toMatchSnapshot('specific properties');
  });

  it('should return a common configuration object', () => {
    const { mockClear: mockDevClear } = mockObjectProperty(OPTIONS, {
      dotenv: {
        ...baseOptions.dotenv
      }
    });

    expect(cleanConfig(wpConfigs.common())).toMatchSnapshot('common dev');
    const devHash = cleanConfig(wpConfigs.common(), true);
    mockDevClear();

    const { mockClear: mockProdClear } = mockObjectProperty(OPTIONS, {
      dotenv: {
        ...baseOptions.dotenv,
        NODE_ENV: 'production'
      }
    });

    const prodHash = cleanConfig(wpConfigs.common(), true);

    expect({
      isEqual: devHash === prodHash,
      devHash,
      prodHash
    }).toMatchSnapshot('common dev, prod hashes');
    mockProdClear();
  });

  it('should return a development configuration object', () => {
    const { mockClear: mockDevClear } = mockObjectProperty(OPTIONS, {
      dotenv: {
        ...baseOptions.dotenv
      }
    });

    expect(cleanConfig(wpConfigs.development())).toMatchSnapshot('development dev');
    const devHash = cleanConfig(wpConfigs.development(), true);
    mockDevClear();

    const { mockClear: mockProdClear } = mockObjectProperty(OPTIONS, {
      dotenv: {
        ...baseOptions.dotenv,
        NODE_ENV: 'production'
      }
    });

    const prodHash = cleanConfig(wpConfigs.development(), true);

    expect({
      isEqual: devHash === prodHash,
      devHash,
      prodHash
    }).toMatchSnapshot('development dev, prod hashes');
    mockProdClear();
  });

  it('should return a production configuration object', () => {
    const { mockClear: mockProdClear } = mockObjectProperty(OPTIONS, {
      dotenv: {
        ...baseOptions.dotenv,
        NODE_ENV: 'production'
      }
    });

    expect(cleanConfig(wpConfigs.production())).toMatchSnapshot('production prod');
    const prodHash = cleanConfig(wpConfigs.production(), true);
    mockProdClear();

    const { mockClear: mockDevClear } = mockObjectProperty(OPTIONS, {
      dotenv: {
        ...baseOptions.dotenv
      }
    });

    const devHash = cleanConfig(wpConfigs.production(), true);

    expect({
      isEqual: devHash === prodHash,
      devHash,
      prodHash
    }).toMatchSnapshot('production dev, prod hashes');
    mockDevClear();
  });
});
