const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  pluginOptions: {
    webpack: {
      dir: [
        './webpack'
      ]
    }
  }
})
