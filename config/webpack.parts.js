const HtmlWebPackPlugin = require('html-webpack-plugin');
// eslint-disable-next-line max-len
const HtmlWebpackInjectPreload = require('@principalstudio/html-webpack-inject-preload');
const paths = require('./paths');

const siteData = {
  title: 'Webpack Boilerplate',
  description: 'Comprehensive Webpack 5 Boilerplate',
  keywords: 'webpack, boilerplate, template, config',
};

// optionally pass in `isProduction` to apply environment-specific logic
const parts = (/* isProduction */) => {
  module.exports.loadPages = () => ({
    plugins: [
      new HtmlWebPackPlugin({
        filename: 'index.html',
        title: `Home | ${siteData.title}`,
        template: `${paths.src}/index.html`,
        meta: {
          description: siteData.description,
          keywords: siteData.keywords,
          viewport: 'width=device-width',
          'Content-Security-Policy': "default-src 'self'; script-src *",
        },
        base: paths.publicPath,
      }),
      new HtmlWebpackInjectPreload({
        files: [
          {
            match: /.[\da-z-]*.css$/,
            attributes: { as: 'style' },
          },
        ],
      }),
      new HtmlWebPackPlugin({
        filename: '404.html',
        title: `404 | ${siteData.title}`,
        template: `${paths.src}/404.html`,
        meta: {
          description: siteData.description,
          keywords: siteData.keywords,
          viewport: 'width=device-width',
        },
        base: paths.publicPath,
      }),
    ],
  });
};

module.exports = parts;
