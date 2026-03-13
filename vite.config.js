import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['vis-network', 'vis-data', '@neo4j-nvl/react', '@neo4j-nvl/base'],
    esbuildOptions: {
      supported: {
        bigint: true
      }
    }
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        rewrite: path => path
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      external: [],
      output: {
        manualChunks: undefined
      }
    }
  },
  ssr: {
    external: ['vis-network', 'vis-data', '@neo4j-nvl/react', '@neo4j-nvl/base']
  }
})
