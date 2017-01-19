require('babel-register')({
  ignore: /node_modules\/(?!tag-checker)/
});
require('babel-polyfill');
require('./src/main.js');