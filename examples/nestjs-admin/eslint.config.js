import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['**/dist/**', '**/coverage/**', '**/src/generated/**'] },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-explicit-any': 'off'
    }
  },
  {
    files: ['apps/api/src/**/*.ts'],
    rules: {
      // Nest constructor and DTO metadata requires runtime imports even when TypeScript sees type-only usage.
      '@typescript-eslint/consistent-type-imports': 'off'
    }
  }
);
