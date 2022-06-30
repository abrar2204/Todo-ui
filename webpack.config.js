const path = require("path");
const webpack = require("webpack");
const HTMLWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",
  entry: {
    index: path.resolve(__dirname,"src/index.js")
  },
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname,"dist")
  },
  module: {
    rules:[
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: "babel-loader"
      },
      {
        test: /\.html$/,
        use: "html-loader"
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  plugins: [
    new HTMLWebpackPlugin({
      template: path.resolve(__dirname,"public/index.html"),
    }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    hot:true,
    compress: true,
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        router: () => 'http://localhost:8080',
        logLevel: 'debug'
      }
    }
  },
}