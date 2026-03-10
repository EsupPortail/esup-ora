import { fileURLToPath, URL } from 'node:url'
import { defineConfig, type UserConfig } from 'vite'
import fs from "fs"
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

export default defineConfig(async ({ command }): Promise<UserConfig> => {
  
  const plugins: any[] = [
    vue(),
    vueJsx(),
  ];
  let appVersion = "0.0.0";
  try {
    appVersion = fs.readFileSync("./app.module.version", "utf8").trim();
  } catch (e) {
    appVersion = "dev-build";
  }

  return {
    base: '/',
    define: {
      __APP_VERSION__: JSON.stringify(appVersion)
    },
    server: {
      allowedHosts: ['localhost', 'ora-frontend', 'ora-backend'],
    },
    build: {
      chunkSizeWarningLimit: 1000,
      minify: false
    },
    plugins: plugins,
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '',
        }
      }
    }
  }
})