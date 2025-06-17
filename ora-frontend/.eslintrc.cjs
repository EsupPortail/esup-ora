import { ru } from 'element-plus/es/locale/index.mjs'

/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  'extends': [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier/skip-formatting'
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules: {
    // "vue/no-v-text-v-html-on-component": [
    //   "error",
    //   { "allow": ["router-link", "nuxt-link"] }
    // ]
    "vue/valid-v-slot": 
      [
        "error", 
        {
          "allowModifiers": false
        }
      ]
  }
}
