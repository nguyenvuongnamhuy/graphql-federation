module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js', '.commitlintrc.js'],
  rules: {
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
      },
    ],
    eqeqeq: 'error',
    'max-len': ['error', { code: 150, tabWidth: 2, ignoreTemplateLiterals: true, ignoreStrings: true, ignoreUrls: true, ignoreRegExpLiterals: true }],
    'no-var': 'error',
    'no-await-in-loop': 'warn',
    'no-console': 'error',
    'no-promise-executor-return': 'error',
    'no-template-curly-in-string': 'error',
    'no-useless-backreference': 'error',
    'require-atomic-updates': 'error',
    '@typescript-eslint/prefer-optional-chain': 'error',
    '@typescript-eslint/prefer-nullish-coalescing': 'off',
    '@typescript-eslint/no-confusing-non-null-assertion': 'error',
    '@typescript-eslint/prefer-for-of': 'error',
    '@typescript-eslint/no-unnecessary-type-constraint': 'error',
    'no-multiple-empty-lines': 'error',
    '@typescript-eslint/lines-between-class-members': ['error', 'always', { exceptAfterSingleLine: true }],
    'jest/valid-title': [0, { ignoreTypeOfDescribeName: true }],
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'prefer-rest-params': 'off',
  },
  overrides: [
    {
      files: ['src/**/*.spec.ts'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
      },
      env: {
        jest: true,
      },
      extends: ['plugin:jest/recommended', 'plugin:jest/style'],
    },
  ],
};
