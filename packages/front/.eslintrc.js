// @ts-check
'use strict';

const rules = require('../common/.eslintrc_rules')

/** @type { import('eslint').Linter.Config } */
const config = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    // necessary for some airbnb ts stuff
    project: './tsconfig.json'
  },
  env: { es2022: true },
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    "airbnb",
    "airbnb/hooks",
    'airbnb-typescript',
  ],
  rules: {
    ...rules,
    'jsx-quotes': ['warn', 'prefer-single'],
    'react/jsx-curly-spacing': ['warn', { when: 'always', "children": true }],
    '@typescript-eslint/default-param-last': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react/prop-types': 'off',
  }
};

module.exports = config;
