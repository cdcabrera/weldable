const path = require('path');
const ts = require('../ts');
const { contextPath } = require('../global');

describe('Typescript', () => {
  afterEach(() => {
    removeFixture('tsconfig.json');
  });

  it('should return specific properties', () => {
    expect(ts).toMatchSnapshot('specific properties');
  });

  it('should create a basic tsconfig', () => {
    const results = ts.createTsConfig(
      { _BUILD_DIST_DIR: path.join(contextPath, 'dist') },
      { loader: 'ts', contextPath: tempFixturePath, isCreateTsConfig: true, isRegenTsConfig: true }
    );

    expect(results).toMatchSnapshot('basic');
  });

  it('should create a tsconfig with a base template', () => {
    const results = ts.createTsConfig(
      { _BUILD_DIST_DIR: path.join(contextPath, 'dist') },
      {
        baseTsConfig: 'create-react-app',
        loader: 'ts',
        contextPath: tempFixturePath,
        isCreateTsConfig: true,
        isRegenTsConfig: true
      }
    );

    expect(results).toMatchSnapshot('base template');
  });

  it('should update a tsconfig with a subsequent merge', () => {
    const _BUILD_DIST_DIR = path.join(contextPath, 'dist');
    const baseResults = ts.createTsConfig(
      { _BUILD_DIST_DIR },
      {
        baseTsConfig: 'create-react-app',
        loader: 'ts',
        contextPath: tempFixturePath,
        isCreateTsConfig: true,
        isRegenTsConfig: true
      }
    );

    const mergeResults = ts.createTsConfig(
      { _BUILD_DIST_DIR },
      {
        baseTsConfig: 'strictest',
        loader: 'ts',
        contextPath: tempFixturePath,
        isCreateTsConfig: true,
        isMergeTsConfig: true
      }
    );

    expect({
      original: baseResults,
      merged: mergeResults
    }).toMatchSnapshot('merged template');
  });
});
