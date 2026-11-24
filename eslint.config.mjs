import { node, jest } from '@cdcabrera/eslint-config-toolkit';

export default [
  ...node,
  ...jest,
  {
    languageOptions: {
      globals: {
        cleanConfigurationPaths: 'readonly',
        fixturePath: 'readonly',
        generateFixture: 'readonly',
        mockObjectProperty: 'readonly',
        removeFixture: 'readonly',
        setMockResourceFunctions: 'readonly',
        tempFixturePath: 'readonly'
      }
    },
    rules: {
      'id-length': ['error', {
        min: 2,
        properties: 'never',
        exceptions: ['a', 'b', 'e', 'i', 'j', 'k', '_']
      }],
      'import/no-dynamic-require': 0
    }
  }
];
