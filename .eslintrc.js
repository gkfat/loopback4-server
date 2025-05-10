module.exports = {
    root: true,
    extends: [
      '@loopback/eslint-config',
      'plugin:@typescript-eslint/recommended',
    ],
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
    ignorePatterns: ['dist/*', '**/*.d.ts'],
    env: {
      node: true,
      browser: true,
      es2021: true,
    },
    rules: {
      indent: ['error', 4],
      quotes: ['error', 'single'],
      semi: 'error',
      'comma-dangle': ['error', 'always-multiline'],
      'no-multiple-empty-lines': ['error', { max: 1 }],
      'object-curly-spacing': ['error', 'always'],
      'object-curly-newline': [
        'error',
        {
          multiline: true,
          minProperties: 2,
        },
      ],
      'array-bracket-newline': [
        'error',
        {
          multiline: true,
          minItems: 3,
        },
      ],
      'array-element-newline': ['error', { minItems: 3 }],
    },
  };
  