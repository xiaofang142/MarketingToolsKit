import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue({
      compilerOptions: {
        // 禁用深度选择器弃用警告
        isCustomElement: () => false,
        whitespace: 'condense',
        // 添加自定义编译器选项以禁用警告
        compatConfig: {
          MODE: 3
        }
      }
    })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        // 移除自动导入，改用@use语法
      }
    },
    // 添加CSS配置以处理深度选择器警告
    devSourcemap: true
  },
  // 添加构建选项以禁用警告
  build: {
    outDir: 'dist',
    sourcemap: false,
    chunkSizeWarningLimit: 1600,
    rollupOptions: {
      output: {
        manualChunks: {
          vue: ['vue', 'vue-router', 'pinia'],
          elementPlus: ['element-plus'],
          utils: ['axios']
        }
      }
    }
  },
  // 添加服务器配置以禁用警告
  server: {
    port: 5173,
    strictPort: false, // 端口被占用时自动递增
    open: true,
    hmr: {
      overlay: false
    },
    proxy: {
      '/api': {
        target: 'http://localhost:8086',
        changeOrigin: true,
        secure: false
      }
    }
  },
  // 添加优化选项
  optimizeDeps: {
    include: ['vue', 'vue-router', 'pinia', 'element-plus', 'axios']
  },
  // 添加自定义配置以禁用警告
  define: {
    __VUE_OPTIONS_API__: true,
    __VUE_PROD_DEVTOOLS__: false
  }
})
