const { resolve } = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const DEV = process.env.NODE_ENV === 'development'

let config = {
  entry: [resolve(__dirname, 'src/index.js')],
  output: {
    publicPath: '/',
    filename: 'bundle.js',
    path: resolve(__dirname, 'build')
  },
  resolve: {
    extensions: ['*', '.js', '.css']
  },
  devtool: DEV ? 'cheap-module-source-map' : 'source-map',
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        loader: DEV ?
          'style-loader!css-loader?modules&importLoaders=1!postcss-loader' :
          ExtractTextPlugin.extract({
            fallbackLoader: 'style-loader',
            loader: 'css-loader?-autoprefixer&modules&importLoaders=1!postcss-loader'
          })
      },
      {
        test: /\.(ico|jpe?g|png|gif|webp|svg|mp4|webm|wav|mp3|m4a|aac|oga)(\?.*)?$/,
        include: resolve(__dirname, 'src'),
        exclude: /\/favicon.ico$/,
        loader: 'file-loader',
        query: {
          name: 'assets/[name].[hash:8].[ext]'
        }
      },
      {
        test: /\/favicon.ico$/,
        include: resolve(__dirname, 'src'),
        loader: 'file-loader',
        query: {
          name: 'favicon.ico'
        }
      },
      {
        test: /\.html$/,
        loader: 'html-loader',
        query: {
          attrs: ['link:href']
        }
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      }
    ]
  },
  plugins: DEV ? [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new HtmlWebpackPlugin({
      inject: true,
      hash: true,
      template: resolve(__dirname, 'src/index.html')
    })
  ] : [
    new HtmlWebpackPlugin({
      inject: true,
      hash: true,
      template: resolve(__dirname, 'src/index.html'),
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true
      }
    }),
    new ExtractTextPlugin({
      filename: 'bundle.css'
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false
    }),
    new webpack.optimize.UglifyJsPlugin({
      beautify: false,
      mangle: {
        screw_ie8: true,
      },
      compress: {
        screw_ie8: true,
        warnings: false
      },
      output: {
        comments: false,
        screw_ie8: true
      }
    })
  ],
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
  }
}

config.plugins.unshift(new webpack.DefinePlugin({
  'process.env': {
    NODE_ENV: JSON.stringify(process.env.NODE_ENV)
  }
}))

if (DEV) {
  config.entry.unshift(
    'react-hot-loader/patch',
    'webpack-dev-server/client?http://localhost:3000',
    'webpack/hot/only-dev-server'
  )
  config.context = resolve(__dirname, 'src')
  config.devServer = {
    hot: true,
    historyApiFallback: true,
    host: 'localhost',
    port: 3000
  }
  config.performance = {
    hints: false
  }
}

module.exports = config
