const path = require( 'path' );
const HtmlWebpackPlugin = require( 'html-webpack-plugin' );
const DotenvWebpackPlugin = require( 'dotenv-webpack' );
const Dotenv = require( 'dotenv-webpack' );

module.exports = {
  entry: './app/index.jsx',
  output: {
    path: path.resolve( __dirname, 'dist' ),
    filename: 'bundle.js',
  },
  devServer: {
    proxy: {
      '/': {
        target: 'http://localhost:3001',
      },
    },
  },
  module: {
    rules: [
      { test: /\.(js)$/, use: 'babel-loader' },
      { test: /\.(jsx)$/, use: 'babel-loader' },
      { test: /\.css$/, use: ['style-loader', 'css-loader'] },
    ],
  },
  mode: 'development',
  plugins: [
    new HtmlWebpackPlugin( {
      template: 'app/index.html',
    } ),
    new Dotenv(),
  ],

};
