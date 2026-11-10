import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Project page: https://oranwiriya.github.io/vlr-visual-2024-2026/
const REPO_BASE = '/vlr-visual-2024-2026/'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? REPO_BASE : '/',
  plugins: [react(), tailwindcss()],
}))
