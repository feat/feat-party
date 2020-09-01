const merge = require('lodash/merge');
const path = require('path');
const alias = require('../alias-config');
module.exports = {
  module:{
    rules: [
      {
        test: /\.md$/,
        loader: 'raw-loader',
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
          },
          {
            loader: 'sass-loader',
            options: {
              includePaths: [path.resolve(__dirname, '../app/styles')],
            },
          },
        ],
      },
      {
        test: /\.(jpg|png|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              fallback: {
                loader: 'file-loader',
                options: {
                  publicPath: [path.resolve(__dirname, '../app/images')],
                },
              },
            },
          },
        ],
      },
      {
        test: /\.(eot|otf|ttf|woff|woff2)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'fonts/[hash].[ext]',
            },
          },
        ],
      },
      {
        test: /fonts?\/.*?\.svg$/,
        include: /node_modules/,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      },
      {
        test: (path) => {
          return /\.svg$/.test(path) && !/fonts?\/.*?\.svg$/.test(path);
        },
        use: [{ 
          loader: 'svg-inline-loader',
          options: {
            removingTagAttrs: ['id'],
          },
        }],
      },
    ],
  },
  resolve: {
    alias,
  },
};
