const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const client = {
  entry: './front/js/home.js',
  target: 'web',
  name: 'client',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'client.bundle.js',
    publicPath: '/dist/',
  },
  resolve: {
    extensions: ['.js'],
    modules: ['./node_modules/'],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1,
              },
            },
          ],
        }),
      },
    ],
  },
  plugins: [
    new ExtractTextPlugin('styles.css'),
  ],
};

const server = {
  entry: './back/server.js',
  target: 'node',
  name: 'server',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'server.bundle.js',
    libraryTarget: 'commonjs2',
  },
};

module.exports = [
  client,
  server,
];
