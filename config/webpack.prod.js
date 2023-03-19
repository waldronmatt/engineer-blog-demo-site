// eslint-disable-next-line unicorn/prevent-abbreviations
const { ESBuildMinifyPlugin } = require('esbuild-loader');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const zlib = require('node:zlib');
const CopyPlugin = require('copy-webpack-plugin');
const { extendWebpackBaseConfig } = require('@waldronmatt/webpack-config');
const commonConfig = require('./webpack.common');
const paths = require('./paths');

const productionConfig = {
  // @PERFORMANCE-COMMENT
  // minify js and css for smaller bundle sizes across the network
  plugins: [
    new ESBuildMinifyPlugin({
      target: 'es2015',
      css: true,
    }),
    new ImageMinimizerPlugin({
      test: /\.(apng|avif|gif|jpe?g|png|svg|webp)$/i,
      minimizer: {
        implementation: ImageMinimizerPlugin.imageminMinify,
        options: {
          plugins: [['jpegtran', { progressive: true }]],
        },
      },
      // @PERFORMANCE-COMMENT
      // convert images to use webp format for reduced
      // payload across the network
      generator: [
        {
          preset: 'webp',
          implementation: ImageMinimizerPlugin.imageminGenerate,
          options: {
            plugins: ['imagemin-webp'],
          },
        },
      ],
    }),
    // @PERFORMANCE-COMMENT
    // compress minified assets for even smaller payloads
    new CompressionPlugin({
      algorithm: 'brotliCompress',
      test: /\.(js|css|html)$/,
      compressionOptions: {
        params: {
          [zlib.constants.BROTLI_PARAM_QUALITY]: 11,
        },
      },
    }),
    new CopyPlugin({
      patterns: [{ from: paths.public, to: paths.dist }],
    }),
  ],
  optimization: {
    splitChunks: {
      // @PERFORMANCE-COMMENT
      // this isn't in-use for this example
      //
      // if we were to use a framework or 3rd party libs like react
      // we can code split them for better performance
      cacheGroups: {
        vendor: {
          name: 'vendors',
          chunks: 'all',
          test: /node_modules/,
          priority: 20,
        },
        // @PERFORMANCE-COMMENT
        // break out shared code into a single chunk for reduced payload
        common: {
          name: 'commons',
          minChunks: 2,
          chunks: 'all',
          priority: 10,
          reuseExistingChunk: true,
          enforce: true,
        },
      },
    },
  },
};

module.exports = extendWebpackBaseConfig(commonConfig, productionConfig);
