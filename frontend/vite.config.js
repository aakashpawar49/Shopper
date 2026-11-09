import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const rootDir = path.dirname(fileURLToPath(import.meta.url))
const certKeyPath = path.resolve(rootDir, 'certs', 'cert.key')
const certPath = path.resolve(rootDir, 'certs', 'cert.crt')

// Serve the dev server over HTTPS only when a local certificate exists in
// frontend/certs/ (git-ignored). Without it, the dev server runs on plain HTTP.
const https =
  fs.existsSync(certKeyPath) && fs.existsSync(certPath)
    ? { key: fs.readFileSync(certKeyPath), cert: fs.readFileSync(certPath) }
    : undefined

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    https,
  },
  build: {
    rollupOptions: {
      output: {
        // Keep rarely-changing libraries in their own chunks so browsers can
        // cache them across deploys of the app code.
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined
          if (/[\\/]node_modules[\\/](react|react-dom|react-router|react-router-dom|scheduler)[\\/]/.test(id)) {
            return 'react'
          }
          if (/[\\/]node_modules[\\/](@reduxjs|react-redux|redux|redux-thunk|immer|reselect)[\\/]/.test(id)) {
            return 'redux'
          }
          return 'vendor'
        },
      },
    },
  },
})
