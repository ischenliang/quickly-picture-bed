import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'node:path'

export default defineConfig({
  server: {
    port: 5174
  },
  build: {
    outDir: 'dist',
    chunkSizeWarningLimit: 1500,
    cssCodeSplit: true,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        chunkFileNames: 'static/js/[name]-[hash].js',
        entryFileNames: 'static/js/[name]-[hash].js',
        assetFileNames: 'static/[ext]/[name]-[hash].[ext]',
        manualChunks (id) {
          if (id.includes("node_modules")) {
            return 'vendor'
          }
        }
      }
    }
  },
  assetsInclude: ['**/*.gif'],
  plugins: [
    vue({
      template: {
        compilerOptions: {
          // 跳过组件解析
          isCustomElement: (tag) => tag.includes('custom-')
        }
      }
    })
  ],
  publicDir: 'public',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // 配置别名
    }
  },
})