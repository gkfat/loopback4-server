import globals from 'globals';
import tslint from 'typescript-eslint';

import jsLint from '@eslint/js';

export default [
    // preset configs
    jsLint.configs.recommended,
    ...tslint.configs.recommended,

    { ignores: ['dist/*', '**/*.d.ts'] },

    // all files
    {
        rules: {
            indent: ['error', 4],
            quotes: ['error', 'single'],
            semi: 'error',
            'comma-dangle': ['error', 'always-multiline'],
            'no-multiple-empty-lines': ['error', { max: 1 }],
            'object-curly-spacing': ['error', 'always'],
            'object-curly-newline': [
                'error', {
                    multiline: true, minProperties: 2,
                },
            ],
            'array-bracket-newline': [
                'error', {
                    multiline: true, minItems: 3,
                },
            ],
            'array-element-newline': ['error', { minItems: 3 }],
        },
    },

    // config envs
    {
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
            },
        },
    },
];
