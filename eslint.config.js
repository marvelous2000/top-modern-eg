import js from '@eslint/js';

export default [
  js.configs.recommended,
  {
    rules: {
      'no-unused-vars': 'warn',
      'no-console': 'off',
      'no-undef': 'off', // Disable no-undef for Node.js globals
    },
  },
  {
    ignores: ['.next/**', 'node_modules/**', 'out/**'],
  },
  {
    files: ['*.js', '*.mjs', '*.cjs'], // Node.js files
    languageOptions: {
      globals: {
        console: 'readonly',
        process: 'readonly',
        require: 'readonly',
        exports: 'writable',
        module: 'readonly',
        __dirname: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
      },
    },
  },
];
