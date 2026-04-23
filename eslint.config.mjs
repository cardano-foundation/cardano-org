import js from '@eslint/js';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import globals from 'globals';

export default [
  {
    ignores: [
      'build/**',
      '.docusaurus/**',
      'node_modules/**',
      'static/**',
      'i18n/**',
      'blog/**',
      'docs/**',
    ],
  },

  js.configs.recommended,
  react.configs.flat.recommended,
  react.configs.flat['jsx-runtime'],
  jsxA11y.flatConfigs.recommended,

  {
    files: ['src/**/*.{js,jsx}', 'scripts/**/*.js', 'docusaurus.config.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: { ...globals.browser, ...globals.node },
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    plugins: { 'react-hooks': reactHooks },
    rules: {
      // PropTypes are not used project-wide; TS checking via @ts-check covers types.
      'react/prop-types': 'off',

      // Stylistic / cleanup rules disabled for the initial rollout. They produced
      // ~260 warnings on the brownfield codebase that drowned out real signal.
      // Re-enable in a follow-up cleanup branch (see SEO/A11y roadmap).
      'no-unused-vars': 'off',
      'no-empty': 'off',
      'no-empty-pattern': 'off',
      'no-useless-escape': 'off',
      'react/display-name': 'off',
      'react/no-unescaped-entities': 'off',
      'react/no-unknown-property': 'off',

      // react-hooks v7 flags real antipatterns (effects causing cascading
      // renders, refs accessed during render, missing deps). Kept as warnings
      // so they stay visible without blocking CI; address in focused branches.
      'react-hooks/rules-of-hooks': 'warn',
      'react-hooks/exhaustive-deps': 'warn',
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/refs': 'warn',

      // jsx-a11y rules stay as errors. They are the primary motivation for
      // adding ESLint to this project and should block CI when violated.
    },
    settings: { react: { version: '18.3' } },
  },

  {
    files: ['scripts/**/*.js', 'docusaurus.config.js'],
    languageOptions: { globals: { ...globals.node } },
  },
];
