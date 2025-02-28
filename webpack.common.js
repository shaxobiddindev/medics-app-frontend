const path = require('path');

module.exports = {
  entry: {
    app: './js/style.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    clean: true,
    filename: './js/style.js',
  },
};
