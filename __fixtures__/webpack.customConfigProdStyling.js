const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const config = {
  module: {
    rules: [
      {
        test: /\.(sa|sc)ss$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
      },
      {
        test: /\.less$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'less-loader']
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      chunkFilename: 'loremIpsum.[name].[contenthash:8].chunk.css',
      filename: 'loremIpsum.[name].[contenthash:8].css'
    })
  ]
};

module.exports = config;
