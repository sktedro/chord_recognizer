const webpack = require('webpack');
const path = require('path');

module.exports = {
  entry: path.resolve(__dirname, './src/index.js'),
  module: {
    rules: [
      { 
        test: /\.css$/, 
        use: [ 'style-loader', 'css-loader' ] 
      },
      {
        test: /\.(jpe?g|png|gif|woff|woff2|eot|ttf|svg)(\?[a-z0-9=.]+)?$/,
        use: 'url-loader' 
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['*', '.js', '.jsx'],
  },
  output: {
    path: path.resolve(__dirname, './public'),
    filename: 'bundle.js',
  },
  devServer: {
    contentBase: path.resolve(__dirname, './public'),
  },
  // plugins: [
    // new webpack.ProvidePlugin({
      // process: 'process/browser',
    // }),
    // new webpack.DefinePlugin({
      // 'process.env.NODE_ENV': JSON.stringify('development')
    // })
  // ],
  target: 'node'
}
