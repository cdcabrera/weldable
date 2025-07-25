import { join } from 'node:path';
import { includeIgnoreFile } from '@eslint/compat';
import eslintPluginJs from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import jestPlugin from 'eslint-plugin-jest';
import jsdocPlugin from 'eslint-plugin-jsdoc';
import nodePlugin from 'eslint-plugin-n';
import prettierPlugin from 'eslint-plugin-prettier/recommended';

export default [
  includeIgnoreFile(join(process.cwd(), '.gitignore')),
  jestPlugin.configs['flat/recommended'],
  jsdocPlugin.configs['flat/recommended'],
  nodePlugin.configs['flat/recommended'],
  importPlugin.flatConfigs.recommended,
  eslintPluginJs.configs.recommended,
  prettierPlugin,
  {
    ignores: ['src/__fixtures__/**/*'],
    languageOptions: {
      globals: {
        cleanConfigurationPaths: 'readonly',
        fixturePath: 'readonly',
        generateFixture: 'readonly',
        mockObjectProperty: 'readonly',
        removeFixture: 'readonly',
        setMockResourceFunctions: 'readonly',
        tempFixturePath: 'readonly'
      },
      ecmaVersion: 2022
    },
    rules: {
      'arrow-parens': ['error', 'as-needed'],
      'comma-dangle': 0,
      'consistent-return': 1,
      'jsdoc/no-undefined-types': 2,
      'jsdoc/no-defaults': 0,
      'jsdoc/require-jsdoc': 2,
      'jsdoc/require-param': 2,
      'jsdoc/require-param-description': 0,
      'jsdoc/require-param-name': 2,
      'jsdoc/require-param-type': 2,
      'jsdoc/require-property': 2,
      'jsdoc/require-property-description': 0,
      'jsdoc/require-property-name': 2,
      'jsdoc/require-property-type': 2,
      'jsdoc/require-returns': 2,
      'jsdoc/require-returns-description': 0,
      'jsdoc/require-returns-type': 2,
      'jsdoc/tag-lines': [
        'warn',
        'always',
        {
          count: 0,
          applyToEndTag: false,
          startLines: 1
        }
      ],
      'max-len': [
        'error',
        {
          code: 240,
          ignoreUrls: true
        }
      ],
      'n/no-unsupported-features/es-syntax': 1,
      'n/shebang': 0,
      'n/no-unpublished-bin': 0,
      'no-console': 0,
      'no-debugger': 1,
      'no-plusplus': 0,
      'no-unused-vars': [
        'error',
        {
          caughtErrors: 'none'
        }
      ],
      'no-unsafe-optional-chaining': 1,
      'no-var': 2,
      'padded-blocks': 0,
      'prettier/prettier': [
        'error',
        {
          arrowParens: 'avoid',
          singleQuote: true,
          trailingComma: 'none',
          printWidth: 120
        }
      ]
    }
  }
];
