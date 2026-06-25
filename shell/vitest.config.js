import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.js'],
    css: false,
  },
  resolve: {
    alias: {
      // Stub out Module Federation remote imports so tests don't require live remotes
      'mf_detail/PokemonDetail': resolve(__dirname, 'src/__mocks__/PokemonDetail.jsx'),
      'mf_history/PokemonHistory': resolve(__dirname, 'src/__mocks__/PokemonHistory.jsx'),
    },
  },
})
