'use strict';

var path = require('path');

var chalk = require('chalk');
var compass = require('compass');
var stripAnsi = require('strip-ansi');

module.exports = function sass(io, next) {

  compass.compile({ cwd: io.options.src }, function(err, stdout/*, stderr*/) {
    stripAnsi(stdout).split('\n').forEach(function(line) {
      var match = line.match(/^\s*(wri|crea)te (.+)$/);

      if (match) {
        io.log(chalk.green('Created: %s'),
          path.relative(io.options.dest, match[1] === 'wri' ? match[2] :
            path.relative(io.options.dest, path.join(io.options.src, match[2]))));
      }
    });

    io.log('');

    next();
  });

};
