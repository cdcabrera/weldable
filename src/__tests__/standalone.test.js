const standalone = require('../standalone');
const fs = require('node:fs');

jest.mock('../dotenv', () => ({
  setDotenvParam: () => '<setDotenvParam />',
  setupWebpackDotenvFile: () => '<setupWebpackDotenvFile />',
  setupWebpackDotenvFilesForEnv: () => '<setupWebpackDotenvFilesForEnv />',
  setupDotenvFile: () => '<setupDotenvFileForEnv />',
  setupDotenvFilesForEnv: () => '<setupDotenvFileForEnv />'
}));

jest.mock('../wpConfigs', () => ({
  common: () => '<common />',
  development: () => '<development />',
  preprocessLoaderJs: () => '<preprocessLoader />',
  preprocessLoaderTs: () => '<preprocessLoaderTs />',
  preprocessLoaderNone: () => '<preprocessLoaderNone />',
  production: () => '<production />'
}));

describe('standalone', () => {
  const snapshotChecks = (
    method,
    { createFile = jest.fn(), isMockFileExists = false, readFileMock = () => '{}', runCmd = jest.fn() } = {}
  ) => {
    const consoleInfo = jest.spyOn(console, 'info').mockImplementation((...args) => args);
    const consoleWarn = jest.spyOn(console, 'warn').mockImplementation((...args) => args);
    const mockFileExists = jest.spyOn(fs, 'existsSync').mockImplementation(() => isMockFileExists);
    const mockReadFile = jest.spyOn(fs, 'readFileSync').mockImplementation(readFileMock);
    method({ mockCreateFile: createFile, mockRunCmd: runCmd });

    const output = {
      mockCreateFileCalls: createFile.mock.calls,
      mockConsoleInfo: consoleInfo.mock.calls,
      mockConsoleWarn: consoleWarn.mock.calls
    };

    createFile.mockClear();
    consoleInfo.mockClear();
    consoleWarn.mockClear();
    mockReadFile.mockClear();
    mockFileExists.mockClear();
    return output;
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return specific properties', () => {
    expect(standalone).toMatchSnapshot('specific properties');
  });

  it('should produce consistent content output', () => {
    expect([
      standalone.outputStandaloneBabelConfig(),
      standalone.outputStandalonePackageJson(),
      standalone.outputStandaloneSrcIndexFile(),
      standalone.outputStandaloneWebpackConfig({ loader: 'js' }),
      standalone.outputStandaloneWebpackConfig({ loader: 'ts' }),
      standalone.outputStandaloneWebpackConfig({ loader: 'none' })
    ]).toMatchSnapshot('content');
  });

  it('should attempt to createStandaloneBabelConfig for js loaders', () => {
    expect(
      snapshotChecks(
        ({ mockCreateFile }) =>
          standalone.createStandaloneBabelConfig(
            { contextPath: fixturePath, loader: 'js' },
            { createFile: mockCreateFile }
          ),
        {
          isMockFileExists: true
        }
      )
    ).toMatchSnapshot('file exists');

    expect(
      snapshotChecks(
        ({ mockCreateFile }) =>
          standalone.createStandaloneBabelConfig(
            { contextPath: fixturePath, loader: 'js' },
            { createFile: mockCreateFile }
          ),
        {
          isMockFileExists: false
        }
      )
    ).toMatchSnapshot('file does not exist');
  });

  it('should attempt to createStandalonePackageJson for multiple loaders', () => {
    expect(
      snapshotChecks(
        ({ mockCreateFile, mockRunCmd }) =>
          standalone.createStandalonePackageJson(
            { contextPath: fixturePath, loader: 'lorem' },
            { createFile: mockCreateFile, runCmd: mockRunCmd }
          ),
        {
          isMockFileExists: true
        }
      )
    ).toMatchSnapshot('file exists');

    expect(
      snapshotChecks(
        ({ mockCreateFile, mockRunCmd }) =>
          standalone.createStandalonePackageJson(
            { contextPath: fixturePath, loader: 'none' },
            { createFile: mockCreateFile, runCmd: mockRunCmd }
          ),
        {
          isMockFileExists: false
        }
      )
    ).toMatchSnapshot('loader none');

    expect(
      snapshotChecks(
        ({ mockCreateFile, mockRunCmd }) =>
          standalone.createStandalonePackageJson(
            { contextPath: fixturePath, loader: 'js' },
            { createFile: mockCreateFile, runCmd: mockRunCmd }
          ),
        {
          isMockFileExists: false
        }
      )
    ).toMatchSnapshot('loader js');

    expect(
      snapshotChecks(
        ({ mockCreateFile, mockRunCmd }) =>
          standalone.createStandalonePackageJson(
            { contextPath: fixturePath, loader: 'ts' },
            { createFile: mockCreateFile, runCmd: mockRunCmd }
          ),
        {
          isMockFileExists: false
        }
      )
    ).toMatchSnapshot('loader ts');
  });

  it('should attempt to createStandaloneWebpackConfig', () => {
    expect(
      snapshotChecks(
        ({ mockCreateFile }) =>
          standalone.createStandaloneWebpackConfig({ contextPath: fixturePath }, { createFile: mockCreateFile }),
        {
          isMockFileExists: true
        }
      )
    ).toMatchSnapshot('file exists');

    expect(
      snapshotChecks(
        ({ mockCreateFile }) =>
          standalone.createStandaloneWebpackConfig({ contextPath: fixturePath }, { createFile: mockCreateFile }),
        {
          isMockFileExists: false
        }
      )
    ).toMatchSnapshot('file does not exist');
  });

  it('should attempt to createStandaloneSrcIndexFile', () => {
    expect(
      snapshotChecks(
        ({ mockCreateFile }) =>
          standalone.createStandaloneSrcIndexFile(
            { contextPath: fixturePath, loader: 'lorem' },
            { createFile: mockCreateFile }
          ),
        {
          isMockFileExists: true
        }
      )
    ).toMatchSnapshot('file exists');

    const mockCreateFile = jest.fn();
    expect(
      snapshotChecks(
        () =>
          standalone.createStandaloneSrcIndexFile(
            { contextPath: fixturePath, loader: 'ts' },
            { createFile: mockCreateFile }
          ),
        {
          isMockFileExists: false
        }
      )
    ).toMatchSnapshot('file does not exist');
    expect(mockCreateFile).toHaveBeenCalledTimes(1);
  });

  it('should attempt to createStandaloneTsConfig', () => {
    expect(
      snapshotChecks(
        ({ mockCreateFile }) =>
          standalone.createStandaloneTsConfig(
            { contextPath: fixturePath, loader: 'ts' },
            { createFile: mockCreateFile }
          ),
        {
          isMockFileExists: true
        }
      )
    ).toMatchSnapshot('file exists');

    expect(
      snapshotChecks(
        ({ mockCreateFile }) =>
          standalone.createStandaloneTsConfig(
            { contextPath: fixturePath, loader: 'ts' },
            { createFile: mockCreateFile, createTsConfig: jest.fn() }
          ),
        {
          isMockFileExists: false
        }
      )
    ).toMatchSnapshot('file does not exist');
  });
});
