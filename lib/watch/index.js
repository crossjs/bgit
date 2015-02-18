'use strict';

var path = require('path');

var chalk = require('chalk');
var gaze = require('gaze');
var _s = require('underscore.string');

var __watcher;

module.exports = function(dest, callback, log) {
  if (__watcher) {
    return;
  }

  __watcher = gaze(dest + '/**/*', function() {
    log(chalk.magenta('  Watching: %s\n'), path.relative(process.cwd(), dest));

    var timeout;

    // On changed/added/deleted
    this.on('all', function(event, filepath) {
      log(chalk.yellow('  %s: %s'), _s.capitalize(event), path.relative(dest, filepath));

      if (timeout) {
        clearTimeout(timeout);
      }

      timeout = setTimeout(callback, 1000);
    });
  });
};
