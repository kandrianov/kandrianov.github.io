const webpack = require('webpack');
const path = require('path');
const HtmlPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OpenBrowser = require('open-browser-webpack-plugin');

// process.noDeprecation = true;

const {
  port = 3001,
  proxy = false,
  vendors = [],
  assets = [],
  publicPath = {},
  initialState = {},
} = require('../project.config.js');

const {addHash, getEntries} = require('./helpers');

const ENV = process.env.NODE_ENV;
const DEV = process.env.NODE_ENV === 'development';
const PROD = process.env.NODE_ENV === 'production';
const ROOT = path.resolve(process.cwd(), '');
const SRC = path.join(ROOT, 'src');
const DEST = path.join(ROOT, 'build', 'public');

const entry = getEntries(SRC);
entry.vendors = vendors;

const cssLoaders = [
  {
    loader: 'css-loader',
    query: {
      sourceMaps: true,
    },
  },
  'postcss-loader',
];

const config = {

  entry,

  output: {
    path: DEST,
    filename: addHash('[name].js', 'hash'),
    publicPath: publicPath[ENV] || '/',
  },

  devtool: DEV ? 'cheap-inline-module-source-map' : PROD ? 'source-map' : null,

  cache: DEV,

  resolve: {
    extensions: ['.js', '.jsx'],
    modules: [
      SRC,
      'node_modules',
    ],
    mainFiles: ['index'],
  },

  watchOptions: {
    aggregateTimeout: 100,
  },

  profile: true,

  module: {
    loaders: [
      // react
      {
        test: /\.jsx$/,
        loader: 'babel-loader',
        include: [
          SRC,
        ],
        query: {
          presets: [
            'react',
            ['latest', {
              es2015: {
                modules: false,
              },
            }],
            PROD && 'react-optimize',
          ].filter(Boolean),
          plugins: [
            'transform-runtime',
            'transform-object-rest-spread',
            PROD && 'react-hot-loader/babel',
          ].filter(Boolean),
        },
      },

      // js
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [
          SRC,
        ],
        query: {
          presets: [
            ['latest', {
              es2015: {
                modules: false,
              },
            }],
          ],
          plugins: [
            'transform-runtime',
            'transform-object-rest-spread',
          ],
        },
      },

      {
        test: /\.(png|jpg|svg|ttf|eot|woff|woff2)/,
        loader: addHash('file-loader?name=[path][name].[ext]', 'hash:6'),
      },

      {
        test: /\.pug/,
        loader: 'pug-loader',
      },

      {
        test: /\.css$/,
        loaders: DEV ? ['style-loader', ...cssLoaders] : ExtractTextPlugin.extract({
          fallbackLoader: 'style-loader',
          loader: cssLoaders,
        }),
      },

      {
        test: /\.scss$|\.sass$/,
        loaders: DEV ? ['style-loader', ...cssLoaders, 'sass-loader?sourcemap'] : ExtractTextPlugin.extract({
          fallbackLoader: 'style-loader',
          loader: [...cssLoaders, 'sass-loader?sourcemap'],
        }),
      },

    ],
  },

  plugins: [

    new webpack.LoaderOptionsPlugin({
      options: {
        context: ROOT,
        postcss: [
          require('postcss-font-magician')(),
          require('autoprefixer')(),
        ],
      },
    }),

    DEV && new webpack.HotModuleReplacementPlugin(),

    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendors',
      minChunks: Infinity,
      filename: addHash('[name].js', 'hash'),
    }),

    new webpack.DefinePlugin({
      'process.env': { NODE_ENV: PROD ? JSON.stringify('production') : JSON.stringify('development') },
      publicPath: publicPath[ENV] ? JSON.stringify(publicPath[ENV]) : JSON.stringify(''),
    }),

    PROD && new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        drop_console: true,
        unsafe: true,
        screw_ie8: true,
      },
    }),

    new HtmlPlugin({
      template: 'pages/index.pug',
      initialState: JSON.stringify(initialState),
    }),

    new ExtractTextPlugin({
      filename: addHash('[name].css', 'hash'),
      disable: false,
      allChunks: true,
    }),



    new OpenBrowser({url: `http://localhost:${port}`}),

  ].filter(Boolean),

  performance: {
    hints: PROD ? 'warning' : false,
  },

  devServer: {
    hot: true,
    historyApiFallback: true,
    host: 'localhost',
    port,
    stats: {
      hash: false,
      version: false,
      timings: true,
      assets: true,
      chunks: false,
      modules: false,
      cached: true,
      colors: true,
    },
  },
};

if (proxy instanceof Array && proxy.length) {
  config.devServer.proxy = proxy;
}

module.exports = config;
