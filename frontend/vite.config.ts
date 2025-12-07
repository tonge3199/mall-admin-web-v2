import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    createSvgIconsPlugin({
      iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
      symbolId: 'icon-[name]',
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(process.cwd(), 'src'),
    },
  },
  // -- PROXY CONFIGURATION START --
  server: {
    proxy: {
      '/dev-api': {
        target: 'http://localhost:8081', // Points to your Spring Boot Gateway
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/dev-api/, '') // Removes /dev-api before sending to backend
      }
    }
  }
  // --- PROXY CONFIGURATION END ---
})
