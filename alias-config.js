const path = require('path');

module.exports = {
  '@': path.resolve(path.join(process.cwd(), 'app')),
  '@mock': path.resolve(path.join(process.cwd(), 'mock')),
  '@feat/draft-js': 'draft-js',
  '@feat/feat-ui/lib': path.resolve(
    path.join(process.cwd(), 'packages/feat-ui/src'),
  ),
  '@feat/feat-editor/lib': path.resolve(
    path.join(process.cwd(), 'packages/feat-editor/src'),
  ),
  '@feat/feat-editor': path.resolve(
    path.join(process.cwd(), 'packages/feat-editor/src/FeatEditor.js'),
  ),
};
