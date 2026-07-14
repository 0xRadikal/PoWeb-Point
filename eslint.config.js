import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

export default tseslint.config(
  {
    // Build output, deps, native Android project and generated caches are not linted.
    ignores: ['dist/**', 'node_modules/**', 'android-twa/**', '.wrangler/**', '*.bak'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      globals: { ...globals.browser, ...globals.es2022 },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      // Correctness-focused rules (real bugs), kept as errors:
      'no-console': 'off',
      'no-debugger': 'error',
      'no-var': 'error',
      'prefer-const': 'error',
      'eqeqeq': ['error', 'smart'],
      // Unused code is a real signal; allow intentional _-prefixed args.
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_', ignoreRestSiblings: true },
      ],
      // `any` is discouraged but not every legacy site can be typed today; warn.
      '@typescript-eslint/no-explicit-any': 'warn',
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
  },
  {
    // Ambient type-declaration files rely on declaration merging, where an
    // empty interface that `extends` another type is the idiomatic pattern
    // (e.g. augmenting React.JSX.IntrinsicElements with react-three-fiber).
    files: ['**/*.d.ts'],
    rules: {
      '@typescript-eslint/no-empty-object-type': 'off',
    },
  },
  {
    // Service worker runs in a Worker global scope, not the DOM.
    files: ['public/sw.js'],
    languageOptions: {
      globals: { ...globals.serviceworker },
    },
  },
  {
    // Node scripts / config files.
    files: ['*.config.{js,ts}', 'scripts/**/*.{js,ts}'],
    languageOptions: {
      globals: { ...globals.node },
    },
  }
);
