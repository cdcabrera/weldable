const path = require('path');
const crypto = require('crypto');
const wp = require('../wp');
const { OPTIONS } = require('../global');

describe('webpack', () => {
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
    expect(wp).toMatchSnapshot('specific properties');
  });

  it('should create a basic webpack config', async () => {
    const { mockClear } = mockObjectProperty(OPTIONS, {
      dotenv: {
        ...baseOptions.dotenv
      }
    });

    const dev = await wp.createWpConfig({
      nodeEnv: 'development'
    });

    const prod = await wp.createWpConfig();

    expect({
      dev: cleanConfig(dev),
      prod: cleanConfig(prod)
    }).toMatchSnapshot('basic configurations');
    mockClear();
  });

  it('should extend a basic webpack config using commonJS resources', async () => {
    const { mockClear } = mockObjectProperty(OPTIONS, {
      dotenv: {
        ...baseOptions.dotenv
      }
    });

    const commonDev = await wp.createWpConfig({
      nodeEnv: 'development',
      extendedConfigs: [path.resolve(fixturePath, 'webpack.customConfigDev.js')]
    });

    expect({
      common: cleanConfig(commonDev)
    }).toMatchSnapshot('configurations');
    mockClear();
  });

  it('should attempt to start a development server', async () => {
    const { mockClear } = mockObjectProperty(OPTIONS, {
      dotenv: {
        ...baseOptions.dotenv
      }
    });

    const basic = await wp.createWpConfig({ nodeEnv: 'development' });
    const startDevServer = jest.fn();
    const webpackDevServer = jest.fn().mockImplementation(() => ({ start: startDevServer }));
    await wp.startWp(basic, { nodeEnv: 'development' }, { WebpackDevServer: webpackDevServer });

    expect(webpackDevServer).toHaveBeenCalledTimes(1);
    expect(startDevServer).toHaveBeenCalledTimes(1);

    mockClear();
  });

  it('should attempt to produce build output bundle', async () => {
    const { mockClear } = mockObjectProperty(OPTIONS, {
      dotenv: {
        ...baseOptions.dotenv,
        NODE_ENV: 'production'
      }
    });

    const basic = await wp.createWpConfig({ nodeEnv: 'production' });
    const webpack = jest.fn();
    await wp.startWp(basic, { nodeEnv: 'production' }, { webpack });

    expect(webpack).toHaveBeenCalledTimes(1);
    mockClear();
  });

  it('should handle build output bundle errors, stats errors, and stat output', () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation((...args) => args);
    const logSpy = jest.spyOn(console, 'log').mockImplementation((...args) => args);

    wp.startWpErrorStatsHandler(new Error('basic error'));
    wp.startWpErrorStatsHandler(undefined, {
      hasErrors: () => true,
      compilation: { errors: [new Error('compile error')] }
    });
    wp.startWpErrorStatsHandler(
      undefined,
      {
        hasErrors: () => false,
        toJson: () => ({ lorem: 'ipsum' }),
        toString: () => 'lorem: ipsum'
      },
      {
        statsFile: 'testJson',
        statsPath: tempFixturePath
      }
    );

    expect({
      errors: errorSpy.mock.calls,
      logs: logSpy.mock.calls
    }).toMatchSnapshot('startWpErrorStatsHandler');

    errorSpy.mockClear();
    logSpy.mockClear();
  });
});
