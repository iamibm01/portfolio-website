import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { apiDevServer } from './vite/apiDevServer'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  // In dev, api/*.ts runs inside the Vite server; in production Vercel deploys each one as a function
  plugins: [react(), apiDevServer(loadEnv(mode, process.cwd(), ''))],
}))
