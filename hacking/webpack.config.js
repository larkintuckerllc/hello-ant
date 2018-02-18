const webpack = require('webpack');
const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = (env) => {
  const globalLessLoaders = [
    {
      loader: 'css-loader',
      options: {
        importLoaders: 1,
        sourceMap: true,
      },
    },
    {
      loader: 'less-loader',
      options: {
        sourceMap: true,
        modifyVars: {
          "@primary-color": "#1DA57A",
        },
      },
    },
  ];
  const globalCssLoaders = [
    {
      loader: 'css-loader',
      options: {
        sourceMap: true,
      },
    },
  ];
  const cssLoaders = [
    {
      loader: 'css-loader',
      options: {
        modules: true,
        importLoaders: 2,
        sourceMap: true,
        localIdentName: env.NODE_ENV === 'production'
          ? '[hash:base64]'
          : '[name]__[local]___[hash:base64:5]',
      },
    },
    {
      loader: 'sass-loader',
      options: {
        sourceMap: true,
      },
    },
    {
      loader: 'postcss-loader',
    },
  ];
  const plugins = [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(env.NODE_ENV),
    }),
    new UglifyJSPlugin({ sourceMap: true }),
    new ExtractTextPlugin({
      allChunks: true,
      filename: 'styles.[contenthash].css',
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'public', 'index.html'),
    }),
    new CleanWebpackPlugin(['build']),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: ({ resource }) => (
        resource !== undefined &&
        resource.indexOf('node_modules') !== -1
      ),
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'main',
      children: true,
      async: true,
      minChunks: ({ resource }) => (
        resource !== undefined &&
        resource.indexOf('node_modules') !== -1
      ),
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      minChunks: Infinity,
    }),
    new CopyWebpackPlugin([
      { from: 'public/favicon.ico' },
    ]),
  ];
  if (env.analyze) plugins.push(new BundleAnalyzerPlugin());
  return ({
    resolve: {
      extensions: ['.js', '.jsx'],
    },
    devtool: env.NODE_ENV === 'production' ? 'source-map' : 'cheap-eval-source-map',
    entry: './src/index.jsx',
    output: {
      filename: env.NODE_ENV === 'production' ? '[name].[chunkhash].bundle.js' : '[name].bundle.js',
      path: path.resolve(__dirname, 'build'),
    },
    module: {
      rules: [
        {
          enforce: 'pre',
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          loader: 'eslint-loader',
          options: {
            failOnWarning: true,
            failOnError: true,
          },
        },
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
        },
        {
          test: /\.(scss|css)$/,
          exclude: /node_modules/,
          use: env.NODE_ENV === 'production' ?
            ExtractTextPlugin.extract({
              use: cssLoaders,
              fallback: 'style-loader',
            }) :
            [
              {
                loader: 'style-loader',
              },
              ...cssLoaders,
            ],
        },
        {
          test: /node_modules\/.*\.css$/,
          use: env.NODE_ENV === 'production' ?
            ExtractTextPlugin.extract({
              use: globalCssLoaders,
              fallback: 'style-loader',
            }) :
            [
              {
                loader: 'style-loader',
              },
              ...globalCssLoaders,
            ],
        },
        {
          test: /node_modules\/.*\.less$/,
          use: env.NODE_ENV === 'production' ?
            ExtractTextPlugin.extract({
              use: globalLessLoaders,
              fallback: 'style-loader',
            }) :
            [
              {
                loader: 'style-loader',
              },
              ...globalLessLoaders,
            ],
        },
        {
          test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
          loader: 'url-loader',
          options: {
            limit: 10000,
          },
        },
      ],
    },
    plugins,
  });
};
