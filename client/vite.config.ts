import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'node:path'
import monacoEditorPlugin from 'vite-plugin-monaco-editor';

export default defineConfig({
  server: {
    port: 5174
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        chunkFileNames: 'static/js/[name]-[hash].js',
        entryFileNames: 'static/js/[name]-[hash].js',
        assetFileNames: 'static/[ext]/[name]-[hash].[ext]',
      }
    }
  },
  assetsInclude: ['**/*.gif'],
  plugins: [
    vue(),
    monacoEditorPlugin({})
  ],
  publicDir: 'public',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // 配置别名
    }
  },
  // 强制预构建插件包
  // optimizeDeps: {
  //   include: [
  //     `monaco-editor/esm/vs/language/json/json.worker`,
  //     `monaco-editor/esm/vs/language/css/css.worker`,
  //     `monaco-editor/esm/vs/language/html/html.worker`,
  //     `monaco-editor/esm/vs/language/typescript/ts.worker`,
  //     `monaco-editor/esm/vs/editor/editor.worker`
  //   ], 
  // },
})