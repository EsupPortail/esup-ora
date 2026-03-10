import { fileURLToPath, URL } from 'node:url'
import { mergeConfig, defineConfig, configDefaults } from 'vitest/config'
import viteConfigRaw from './vite.config'


export default defineConfig(async (env) => {
  const resolvedViteConfig = await (typeof viteConfigRaw === 'function' 
    ? viteConfigRaw(env) 
    : viteConfigRaw);

  return mergeConfig(
    resolvedViteConfig,
    defineConfig({
      test: {
        environment: 'jsdom',
        exclude: [...configDefaults.exclude, 'e2e/*'],
        root: fileURLToPath(new URL('./', import.meta.url))
      }
    })
  );
});