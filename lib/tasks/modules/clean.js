'use strict';

var path = require('path')

var chalk = require('chalk')
var del = require('del')

module.exports = function clean(io, next) {

  del([
    path.join(io.options.dest, './index' + io.options.ext.html),
    path.join(io.options.dest, './favicon.*'),
    path.join(io.options.dest, './post/**'),
    path.join(io.options.dest, './css/**'),
    path.join(io.options.dest, './img/**'),
    path.join(io.options.dest, './js/**'),
    path.join(io.options.dest, './font/**')], function(err, files) {
    if (err) {
      io.log.error(err)
    }

    files.forEach(function(file) {
      io.log(chalk.cyan('delete: %s'), path.relative(io.options.dest, file))
    })

    io.log('')

    next()
  })

}
