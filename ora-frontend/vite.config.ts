import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vueDevtools from 'vite-plugin-vue-devtools'

import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

// import VuetifyPlugin from './src/plugins/vite-plugin-vuetify.js';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  build: {
    chunkSizeWarningLimit: 1000, //1Mo,
    minify: false
  },
  plugins: [
    vue(),
    vueJsx(),
    vueDevtools(),
    // VuetifyPlugin()
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        sassOptions: {
          indentedSyntax: false,
          // Si vous utilisez la syntaxe indentée (.sass) plutôt que SCSS (.scss), réglez cette option sur true
        }
      }
    }
  }
})
