/* eslint-disable  @typescript-eslint/no-var-requires,import/no-extraneous-dependencies */
// @ts-check
// eslint-disable-next-line strict, lines-around-directive
'use strict';

const path = require( 'path' );
const HtmlWebpackPlugin = require( 'html-webpack-plugin' );
const ForkTsCheckerWebpackPlugin = require( 'fork-ts-checker-webpack-plugin' );
const ReactRefreshWebpackPlugin = require( '@pmmmwh/react-refresh-webpack-plugin' );
const { uploadTinyMCEImageRoute } = require( '@omniapp-concept/common/dist/helpers/uploadTinyMCEImageRoute' );
const Dotenv = require( 'dotenv-webpack' );


const publicDir = path.resolve( __dirname, './public' );
const isProd = process.env.NODE_ENV === 'production';
const isDevBuild = process.env.NODE_ENV === 'devbuild';

/** @type { import( 'webpack-dev-server' ).WebpackConfiguration } */
const config = {
  mode: isProd ? 'production' : 'development',
  entry: {
    main: path.resolve( __dirname, 'src', 'index.tsx' ),
  },
  output: {
    path: publicDir,
    filename: '[name].[chunkhash].js',
    publicPath: '/',
  },
  resolve: {
    extensions: [ '.ts', '.tsx', '.js' ],
    alias: {
      '@utils': path.resolve( __dirname, 'src', 'utils' ),
      '@components': path.resolve( __dirname, 'src', 'components' ),
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'esbuild-loader',
        options: {
          loader: 'tsx', // Or 'ts' if you don't need tsx
          target: 'es2015',
        },
      },
    ],
  },
  optimization: {
    // minimize: false,
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  },
  plugins: [
    new HtmlWebpackPlugin( {
      template: path.resolve( __dirname, './index.html' ),
    } ),
    new Dotenv( { systemvars: true } ),
  ].concat( ( isProd || isDevBuild ) ? [] : [
    new ForkTsCheckerWebpackPlugin(),
    new ReactRefreshWebpackPlugin(),
  ] ),
  ...( ( isProd || isDevBuild ) ? {} : {
    watchOptions: {
      // for some systems, watching many files can result in a lot of CPU or memory usage
      // https://webpack.js.org/configuration/watch/#watchoptionsignored
      // don't use this pattern, if you have a monorepo with linked packages
      ignored: /node_modules|src[/\\]sw/,
    },

    devServer: {
      port: 3003,
      allowedHosts: 'all',
      static: {
        directory: publicDir,
        watch: false,
      },
      hot: true,
      historyApiFallback: true,
      proxy: {
        [ uploadTinyMCEImageRoute ]: 'http://localhost:3002',
      },
    },
    devtool: 'source-map',
  } ),
};

module.exports = config;
