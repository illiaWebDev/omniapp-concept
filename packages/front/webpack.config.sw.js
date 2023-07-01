/* eslint-disable  @typescript-eslint/no-var-requires,import/no-extraneous-dependencies */
// @ts-check
// eslint-disable-next-line strict, lines-around-directive
'use strict';

const path = require( 'path' );
const ForkTsCheckerWebpackPlugin = require( 'fork-ts-checker-webpack-plugin' );
// const Dotenv = require( 'dotenv-webpack' );


const publicDir = path.resolve( __dirname, './public' );
const isProd = process.env.NODE_ENV === 'production';
const isDevBuild = process.env.NODE_ENV === 'devbuild';

/** @type { import( 'webpack-dev-server' ).WebpackConfiguration } */
const config = {
  mode: isProd ? 'production' : 'development',
  entry: {
    sw: path.resolve( __dirname, 'src', 'sw', 'index.ts' ),
  },
  output: {
    path: publicDir,
    filename: '[name].js',
  },
  resolve: {
    extensions: [ '.ts', '.tsx', '.js' ],
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
  plugins: /** @type { NonNullable< import( 'webpack-dev-server' ).WebpackConfiguration[ 'plugins' ] > } */(
    []
  ).concat( ( isProd || isDevBuild ) ? [] : [
    new ForkTsCheckerWebpackPlugin(),
  ] ),
  ...( ( isProd || isDevBuild ) ? {} : {
    watchOptions: {
      // for some systems, watching many files can result in a lot of CPU or memory usage
      // https://webpack.js.org/configuration/watch/#watchoptionsignored
      // don't use this pattern, if you have a monorepo with linked packages
      ignored: /node_modules/,
    },
    watch: true,
    devtool: 'inline-source-map',
  } ),
};

module.exports = config;
