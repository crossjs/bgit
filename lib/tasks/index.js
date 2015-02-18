'use strict';

var fs = require('fs');
var path = require('path');

fs.readdirSync(path.join(__dirname, 'modules'))
  .forEach(function(file) {
    exports[file.replace(/\..+?$/, '')] = require('./modules/' + file);
  });
