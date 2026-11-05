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
    // .agents and .claude hold vendored AI-tooling skills, not site code
    ignores: ['dist', 'node_modules', '.git', '.agents', '.claude', '.taste-skill', 'api/_lib/generated'],
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
      // TypeScript itself reports real redeclarations; the base rule misreads a value and a type
      // sharing a name (e.g. a zod schema and its inferred type)
      'no-redeclare': 'off',
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
  
  // Node.js globals for the Vercel functions, the shared protocol and the build/test config
  {
    files: ['api/**/*.ts', 'shared/**/*.ts', 'vite/**/*.ts', '*.config.ts'],
    languageOptions: {
      globals: {
        ...globals.node
      }
    }
  },

  // Server code never ships to the browser: the chat client talks to /api over HTTP only
  {
    files: ['src/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': ['error', {
        patterns: [
          { group: ['@anthropic-ai/*', '@prisma/*', 'pg', 'resend', '@vercel/functions'], message: 'Server-only package: keep it under api/.' },
          { group: ['**/api/*', '**/api/**'], message: 'Browser code must not import server code; use shared/ for the contract.' }
        ]
      }]
    }
  },

  // Prettier config - MUST BE LAST to override other formatting rules
  prettierConfig
]