// @ts-check
'use strict';

const rules = require('./.eslintrc_rules');

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
    'airbnb-base',
    'airbnb-typescript/base',
  ],
  rules,
};

module.exports = config;
