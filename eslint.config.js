import js from '@eslint/js';
import pluginVue from 'eslint-plugin-vue';
import pluginVitest from '@vitest/eslint-plugin';
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting';

export default [
  {
    name: 'app/files-to-lint',
    files: ['**/*.{js,mjs,jsx,vue,ts,tsx}'],
  },
  {
    name: 'app/files-to-ignore',
    ignores: ['**/dist/**', '**/dist-ssr/**', '**/coverage/**'],
  },
  js.configs.recommended,
  ...pluginVue.configs['flat/essential'],
  {
    ...pluginVitest.configs.recommended,
    files: ['src/**/__tests__/*'],
  },
  skipFormatting,
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: '@typescript-eslint/parser',
      parserOptions: {
        tsconfigRoot: './',
        project: './tsconfig.json',
        sourceType: 'module',
      },
    },
    rules: {

    },
  },
];
