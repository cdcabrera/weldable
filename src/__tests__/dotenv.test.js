const path = require('path');
const crypto = require('crypto');
const dotenv = require('../dotenv');
const { contextPath } = require('../global');

describe('dotenv', () => {
  it('should return specific properties', () => {
    expect(dotenv).toMatchSnapshot('specific properties');
  });

  it('should attempt to load and instantiate the dotenv-webpack package', () => {
    expect(dotenv.setupWebpackDotenvFile()).toMatchSnapshot('setupWebpackDotenvFile');
  });

  it('should attempt to load dotenv files for webpack configuration', () => {
    const results = dotenv.setupWebpackDotenvFilesForEnv({ directory: contextPath, env: 'development' });

    expect(results.length).toBe(4);
    expect(
      results.map(params => {
        const { path: filePath, ...rest } = params.config;

        return { ...rest, path: path.basename(filePath) };
      })
    ).toMatchSnapshot('setupWebpackDotenvFilesForEnv');
  });

  it('should attempt to load dotenv files standalone and apply to process.env', () => {
    const dotenvParamName = 'DOTENV_TEST';
    const content = crypto.randomBytes(20).toString('hex');
    const { path: filePath, removeFixture } = generateFixture(`${dotenvParamName}=${content}`);

    dotenv.setupDotenvFile(filePath);
    expect(process.env[dotenvParamName]).toBe(content);
    removeFixture();
  });

  it('should attempt to load dotenv files as part of a working env and apply to process.env', () => {
    const dotenvParamName = 'DOTENV_TEST_ENV';
    const content = crypto.randomBytes(20).toString('hex');
    const { dir, removeFixture } = generateFixture(`${dotenvParamName}=${content}`, { filename: '.env.test', ext: '' });

    const result = dotenv.setupDotenvFilesForEnv({ env: 'test', relativePath: dir });

    expect(result[dotenvParamName]).toBe(content);
    removeFixture();
  });
});
