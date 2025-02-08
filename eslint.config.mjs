import { FlatCompat } from '@eslint/eslintrc';
import pluginQuery from '@tanstack/eslint-plugin-query';
import perfectionist from 'eslint-plugin-perfectionist';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  ...pluginQuery.configs['flat/recommended'],
  perfectionist.configs['recommended-natural'],
  {
    ignores: ['node_modules', 'dist', 'build', 'out'],
    rules: {
      '@typescript-eslint/consistent-type-imports': 'error',
      curly: 'error',
    },
  },
];

export default eslintConfig;
