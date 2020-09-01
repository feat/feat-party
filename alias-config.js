const path = require('path')

module.exports = {
  '@': path.resolve(path.join(process.cwd(), 'app')),
  '@mock': path.resolve(path.join(process.cwd(), 'mock')),
  'draft-js': '@feat/draft-js',
};