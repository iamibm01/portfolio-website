import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import prettierConfig from 'eslint-config-prettier'

export default [
  // Ignore common directories
  {
    ignores: ['dist', 'server/dist', 'node_modules', '.git']
  },
  
  // Base JavaScript rules
  js.configs.recommended,
  
  // Configuration for TypeScript files
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true
        }
      },
      globals: {
        ...globals.browser,
        ...globals.es2020
      }
    },
    plugins: {
      '@typescript-eslint': tseslint,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh
    },
    rules: {
      // Disable base rule in favour of the TypeScript-aware version below
      'no-unused-vars': 'off',
      // TypeScript rules
      '@typescript-eslint/no-unused-vars': ['warn', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_'
      }],
      
      // React Hooks rules
      ...reactHooks.configs.recommended.rules,
      
      // React Refresh rule
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true }
      ],
      
      // General best practices
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'prefer-const': 'warn'
    }
  },
  
  // Node.js globals for the Express server and Vercel serverless functions
  {
    files: ['server/src/**/*.ts', 'api/**/*.ts'],
    languageOptions: {
      globals: {
        ...globals.node
      }
    }
  },

  // Prettier config - MUST BE LAST to override other formatting rules
  prettierConfig
]