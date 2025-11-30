const { defineConfig } = require("@vue/cli-service");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = defineConfig({
  transpileDependencies: true,
  outputDir: "./jinli_simple_tab",
  filenameHashing: false,
  configureWebpack: {
    output: {
      clean: true,
    },
    plugins: [
      new CopyPlugin({
        patterns: [
          {
            from: "public/images/*.png",
            to: "images/[name][ext]",
          },
          {
            from: "public/manifest.json",
            to: "manifest.json",
          },
          {
            from: "public/background.js",
            to: "background.js",
          },
        ],
      }),
    ],
  },
});
