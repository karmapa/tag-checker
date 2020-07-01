require('@babel/register')({
  ignore: /node_modules\/(?!tag-checker)/
});
require('core-js/stable');
require('regenerator-runtime/runtime');
require('./src/main.js');
