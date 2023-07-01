/** @type { NonNullable< import('eslint').Linter.Config[ 'rules' ] > } */
const rules = {
  'max-len': [
    "warn",
    {
      code: 120,
      ignoreComments: true,
      ignoreTemplateLiterals: true,
      ignoreStrings: true,
      ignoreRegExpLiterals: true,
    }
  ],
  'no-multiple-empty-lines': ["warn", { max: 2, maxEOF: 0, maxBOF: 0 }],
  '@typescript-eslint/type-annotation-spacing': ["warn", { after: true }],
  'space-in-parens': ['warn', 'always'],
  'import/prefer-default-export': 'off',
  'no-void': 'off',
  'no-underscore-dangle': 'off',
  'arrow-parens': ['warn', "as-needed"],
  '@typescript-eslint/no-shadow': 'off',
  'computed-property-spacing': ['warn', 'always'],
  'template-curly-spacing': ['warn', 'always'],
  'array-bracket-spacing': ['warn', 'always'],
  'no-console': ['warn', {
    allow: ["warn", "error", "info"],
  }],
  'func-names': 'off',
  '@typescript-eslint/space-before-function-paren': ['warn', {
    anonymous: 'never',
    named: 'never',
    asyncArrow: 'always',
  }],
  '@typescript-eslint/no-empty-interface': 'off',
  '@typescript-eslint/naming-convention': 'off',
  'arrow-body-style': 'off',
  'eol-last': 'warn',
  '@typescript-eslint/no-unused-vars': 'warn',
  'object-curly-newline': 'off',
  "@typescript-eslint/member-delimiter-style": "warn",
  '@typescript-eslint/indent': ['warn', 2, {
    SwitchCase: 1,
    ignoredNodes: [
      /**
        @example
        type A = Promise<
          number
        >;
      */
      'TSTypeParameterInstantiation *',
    ],
  }],
  'require-await': 'warn',
  'no-restricted-syntax': 'off',
};

module.exports = rules;
