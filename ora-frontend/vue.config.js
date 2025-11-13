const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  publicPath: '/',
  pluginOptions: {
    webpack: {
      dir: [
        './webpack'
      ]
    }
  }
})
