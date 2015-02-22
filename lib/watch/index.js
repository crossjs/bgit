'use strict';

var path = require('path')

var chalk = require('chalk')
var gaze = require('gaze')

var _watcher

module.exports = function(dest, callback, log) {
  if (_watcher) {
    return
  }

  _watcher = gaze(dest + '/**/*', function() {
    log(chalk.magenta('  watching: %s\n'), path.relative(process.cwd(), dest))

    var timeout

    // On changed/added/deleted
    this.on('all', function(event, filepath) {
      log(chalk.yellow('  %s: %s\n'), event, path.relative(dest, filepath))

      if (timeout) {
        clearTimeout(timeout)
      }

      timeout = setTimeout(callback, 1000)
    })
  })
}
